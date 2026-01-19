import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import type { IncomingMessage } from 'http';
import type { Server } from 'ws';
import { WebSocket } from 'ws';
import { UserTypeOrmRepository } from '@/infrastructure/repositories/user.repository';
import { authenticateDashboardRequest } from './dashboard-auth';

interface JoinPayload {
  roomId: string;
}

interface MessagePayload {
  roomId?: string;
  message: string;
  targetUserId?: string;
}

type DashboardActionType = 'friend_request' | 'page_invite' | 'system';

interface ActionPayload {
  roomId?: string;
  actionType: DashboardActionType;
  title: string;
  message?: string;
  targetUserId?: string;
}

type ClientUser = {
  public_id: string;
  name: string;
};

@WebSocketGateway({
  path: '/ws/dashboard',
  cors: {
    origin: true,
    credentials: true,
  },
})
export class DashboardGateway {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger('WS:DASHBOARD');
  private readonly clients = new Map<WebSocket, ClientUser>();
  private readonly rooms = new Map<string, Set<WebSocket>>();
  private readonly clientRooms = new Map<WebSocket, Set<string>>();

  constructor(private readonly usersRepository: UserTypeOrmRepository) {}

  async handleConnection(client: WebSocket, request: IncomingMessage) {
    const user = await authenticateDashboardRequest(
      request,
      this.usersRepository,
    );

    if (!user) {
      this.logger.warn('connection refused: invalid token');
      client.close();
      return;
    }

    this.clients.set(client, {
      public_id: user.public_id,
      name: user.name,
    });
    this.addClientToRoom(client, user.public_id);
    this.logger.log(`connected userId=${user.public_id}`);

    client.send(
      JSON.stringify({
        event: 'ready',
        data: { userId: user.public_id, name: user.name },
      }),
    );
  }

  handleDisconnect(client: WebSocket) {
    const user = this.clients.get(client);
    if (user) {
      this.logger.log(`disconnected userId=${user.public_id}`);
    }
    this.clients.delete(client);
    const rooms = this.clientRooms.get(client);
    if (rooms) {
      for (const roomId of rooms) {
        const room = this.rooms.get(roomId);
        if (!room) continue;
        room.delete(client);
        if (room.size === 0) {
          this.rooms.delete(roomId);
        }
      }
    }
    this.clientRooms.delete(client);
  }

  @SubscribeMessage('join')
  async handleJoin(
    @MessageBody() payload: JoinPayload,
    @ConnectedSocket() client: WebSocket,
  ) {
    const user = this.getUser(client);
    if (!payload?.roomId) {
      this.logger.warn(`join rejected userId=${user.public_id} reason=ROOM_ID_REQUIRED`);
      throw new WsException('ROOM_ID_REQUIRED');
    }

    this.addClientToRoom(client, payload.roomId);

    this.logger.log(`join userId=${user.public_id} roomId=${payload.roomId}`);
    return {
      ok: true,
      roomId: payload.roomId,
      userId: user.public_id,
    };
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() payload: MessagePayload,
    @ConnectedSocket() client: WebSocket,
  ) {
    const user = this.getUser(client);
    if (!payload?.message) {
      this.logger.warn(`message rejected userId=${user.public_id} reason=INVALID_MESSAGE`);
      throw new WsException('INVALID_MESSAGE');
    }

    if (payload.targetUserId) {
      const sent = this.broadcastToUser(payload.targetUserId, 'message', {
        message: payload.message,
        userId: user.public_id,
        name: user.name,
        targetUserId: payload.targetUserId,
      });

      if (!sent) {
        this.logger.warn(
          `message rejected userId=${user.public_id} reason=TARGET_NOT_FOUND`,
        );
        throw new WsException('TARGET_NOT_FOUND');
      }

      this.logger.log(
        `message userId=${user.public_id} targetUserId=${payload.targetUserId}`,
      );
      return { ok: true };
    }

    if (!payload.roomId) {
      this.logger.warn(`message rejected userId=${user.public_id} reason=ROOM_ID_REQUIRED`);
      throw new WsException('ROOM_ID_REQUIRED');
    }

    const room = this.rooms.get(payload.roomId);
    if (!room) {
      this.logger.warn(`message rejected userId=${user.public_id} reason=ROOM_NOT_FOUND`);
      throw new WsException('ROOM_NOT_FOUND');
    }

    this.broadcastToRoom(payload.roomId, 'message', {
      roomId: payload.roomId,
      message: payload.message,
      userId: user.public_id,
      name: user.name,
    });

    this.logger.log(
      `message userId=${user.public_id} roomId=${payload.roomId}`,
    );
    return { ok: true };
  }

  @SubscribeMessage('action')
  async handleAction(
    @MessageBody() payload: ActionPayload,
    @ConnectedSocket() client: WebSocket,
  ) {
    const user = this.getUser(client);
    if (!payload?.actionType || !payload?.title) {
      this.logger.warn(
        `action rejected userId=${user.public_id} reason=INVALID_ACTION`,
      );
      throw new WsException('INVALID_ACTION');
    }

    if (payload.targetUserId) {
      const sent = this.broadcastToUser(payload.targetUserId, 'action', {
        actionType: payload.actionType,
        title: payload.title,
        message: payload.message ?? null,
        targetUserId: payload.targetUserId,
        userId: user.public_id,
        name: user.name,
      });

      if (!sent) {
        this.logger.warn(
          `action rejected userId=${user.public_id} reason=TARGET_NOT_FOUND`,
        );
        throw new WsException('TARGET_NOT_FOUND');
      }

      this.logger.log(
        `action userId=${user.public_id} targetUserId=${payload.targetUserId} type=${payload.actionType}`,
      );
      return { ok: true };
    }

    if (!payload.roomId) {
      this.logger.warn(
        `action rejected userId=${user.public_id} reason=ROOM_ID_REQUIRED`,
      );
      throw new WsException('ROOM_ID_REQUIRED');
    }

    const room = this.rooms.get(payload.roomId);
    if (!room) {
      this.logger.warn(
        `action rejected userId=${user.public_id} reason=ROOM_NOT_FOUND`,
      );
      throw new WsException('ROOM_NOT_FOUND');
    }

    this.broadcastToRoom(payload.roomId, 'action', {
      roomId: payload.roomId,
      actionType: payload.actionType,
      title: payload.title,
      message: payload.message ?? null,
      userId: user.public_id,
      name: user.name,
    });

    this.logger.log(
      `action userId=${user.public_id} roomId=${payload.roomId} type=${payload.actionType}`,
    );
    return { ok: true };
  }

  private broadcastToRoom(
    roomId: string,
    event: 'message' | 'action',
    data: Record<string, unknown>,
  ) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const body = JSON.stringify({
      event,
      data,
    });

    for (const socket of room) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(body);
      }
    }
  }

  private broadcastToUser(
    userId: string,
    event: 'message' | 'action',
    data: Record<string, unknown>,
  ) {
    const room = this.rooms.get(userId);
    if (!room) return false;

    const body = JSON.stringify({
      event,
      data,
    });

    for (const socket of room) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(body);
      }
    }

    return true;
  }

  private addClientToRoom(client: WebSocket, roomId: string) {
    const room = this.rooms.get(roomId) ?? new Set<WebSocket>();
    room.add(client);
    this.rooms.set(roomId, room);

    const clientRoomSet = this.clientRooms.get(client) ?? new Set<string>();
    clientRoomSet.add(roomId);
    this.clientRooms.set(client, clientRoomSet);
  }

  private getUser(client: WebSocket) {
    const user = this.clients.get(client);
    if (!user) {
      throw new WsException('UNAUTHORIZED');
    }
    return user;
  }
}
