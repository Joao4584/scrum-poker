import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import type { Socket, Server } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { UserTypeOrmRepository } from '@/infrastructure/repositories/user.repository';

type PlanningHandshakeAuth = {
  token?: string;
  roomPublicId?: string;
  pageId?: string;
};

type JoinPlanningPayload = {
  roomPublicId: string;
  pageId: string;
};

type PlanningSocketUser = {
  publicId: string;
  name: string;
};

type PlanningSocketData = {
  user: PlanningSocketUser;
  roomPublicId: string;
  pageId: string;
};

type JwtPayload = {
  public_id: string;
  iat: number;
};

const roomChannel = (roomPublicId: string) => `planning:room:${roomPublicId}`;
const pageChannel = (pageId: string) => `planning:page:${pageId}`;

@WebSocketGateway({
  path: '/ws/planning',
  cors: {
    origin: true,
    credentials: true,
  },
})
export class PlanningGateway {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger('WS:PLANNING');

  constructor(private readonly usersRepository: UserTypeOrmRepository) {}

  async handleConnection(client: Socket) {
    const auth = (client.handshake.auth ?? {}) as PlanningHandshakeAuth;
    const token = this.extractToken(client, auth);
    const roomPublicId = auth.roomPublicId?.trim();
    const pageId = auth.pageId?.trim();

    if (!token || !roomPublicId || !pageId) {
      this.logger.warn(`connection refused socketId=${client.id} reason=INVALID_HANDSHAKE`);
      client.disconnect(true);
      return;
    }

    const user = await this.authenticateToken(token);
    if (!user) {
      this.logger.warn(`connection refused socketId=${client.id} reason=UNAUTHORIZED`);
      client.disconnect(true);
      return;
    }

    client.data.user = {
      publicId: user.public_id,
      name: user.name,
    };
    client.data.roomPublicId = roomPublicId;
    client.data.pageId = pageId;

    client.join(roomChannel(roomPublicId));
    client.join(pageChannel(pageId));

    this.logger.log(
      `connected socketId=${client.id} userId=${user.public_id} roomPublicId=${roomPublicId} pageId=${pageId}`,
    );

    client.emit('planning:ready', {
      socketId: client.id,
      pageId,
      roomPublicId,
      userId: user.public_id,
      name: user.name,
    });
  }

  handleDisconnect(client: Socket) {
    const data = client.data as Partial<PlanningSocketData>;
    if (!data.user) return;

    this.logger.log(
      `disconnected socketId=${client.id} userId=${data.user.publicId} roomPublicId=${data.roomPublicId} pageId=${data.pageId}`,
    );
  }

  emitRoomSync(roomPublicId: string, event: string, payload: Record<string, unknown> = {}) {
    this.server.to(roomChannel(roomPublicId)).emit("planning:sync", {
      event,
      roomPublicId,
      occurredAt: new Date().toISOString(),
      ...payload,
    });
  }

  @SubscribeMessage('planning:join')
  handleJoin(
    @MessageBody() payload: JoinPlanningPayload,
    @ConnectedSocket() client: Socket,
  ) {
    const data = this.getSocketData(client);
    if (!payload?.roomPublicId || !payload?.pageId) {
      throw new WsException('INVALID_JOIN_PAYLOAD');
    }

    if (payload.roomPublicId !== data.roomPublicId || payload.pageId !== data.pageId) {
      throw new WsException('HANDSHAKE_MISMATCH');
    }

    this.server.to(pageChannel(data.pageId)).emit('planning:presence', {
      socketId: client.id,
      pageId: data.pageId,
      roomPublicId: data.roomPublicId,
      userId: data.user.publicId,
      name: data.user.name,
      status: 'connected',
    });

    return {
      ok: true,
      socketId: client.id,
      pageId: data.pageId,
      roomPublicId: data.roomPublicId,
    };
  }

  private extractToken(client: Socket, auth: PlanningHandshakeAuth) {
    const rawHeader = client.handshake.headers.authorization;
    const headerValue = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
    const handshakeToken = auth.token?.trim();

    if (handshakeToken) return handshakeToken;
    if (!headerValue) return null;
    return headerValue.startsWith('Bearer ') ? headerValue.slice(7) : headerValue;
  }

  private async authenticateToken(token: string) {
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'default-secret',
      ) as JwtPayload;
    } catch {
      return null;
    }

    const user = await this.usersRepository.findByPublicId(decoded.public_id);
    const lastLoginIat =
      user?.last_login_iat !== null && user?.last_login_iat !== undefined
        ? BigInt(user.last_login_iat as any)
        : null;

    if (!user || (lastLoginIat && BigInt(decoded.iat) < lastLoginIat)) {
      return null;
    }

    return user;
  }

  private getSocketData(client: Socket): PlanningSocketData {
    const data = client.data as Partial<PlanningSocketData>;
    if (!data.user || !data.roomPublicId || !data.pageId) {
      throw new WsException('UNAUTHORIZED');
    }
    return data as PlanningSocketData;
  }
}
