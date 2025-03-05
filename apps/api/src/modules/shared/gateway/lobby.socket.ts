import { Inject } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, type Server } from 'socket.io';
import { AddParticipantLobbyUseCase } from 'modules/lobby/useCases/add-participant-lobby';
import { FindOrCreateLobbyUseCase } from 'modules/lobby/useCases/find-or-create-lobby';
import { MarkParticipantAsDisconnectedUseCase } from 'modules/lobby/useCases/mark-participant-disconnected';
import { MarkLobbyAsEmptyUseCase } from 'modules/lobby/useCases/mark-lobby-as-empty';

@WebSocketGateway({ namespace: 'lobby' }) // ws://localhost:3000/lobby
export class LobbyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    @Inject(AddParticipantLobbyUseCase)
    private readonly addParticipantLobbyUseCase: AddParticipantLobbyUseCase,

    @Inject(MarkParticipantAsDisconnectedUseCase)
    private readonly markParticipantAsDisconnectedUseCase: MarkParticipantAsDisconnectedUseCase,

    @Inject(MarkLobbyAsEmptyUseCase)
    private readonly markLobbyAsEmptyUseCase: MarkLobbyAsEmptyUseCase,
  ) {}

  async handleConnection(client: Socket) {
    const { userId, lobbyUuid } = client.handshake.query;

    if (!userId || !lobbyUuid) {
      client.disconnect();
      return;
    }

    await this.addParticipantLobbyUseCase.execute(
      Number(userId),
      String(lobbyUuid),
    );
    client.join(lobbyUuid);
  }

  async handleDisconnect(client: Socket) {
    const { userId, lobbyUuid } = client.handshake.query;

    if (!userId || !lobbyUuid) return;

    await this.markParticipantAsDisconnectedUseCase.execute(
      Number(userId),
      String(lobbyUuid),
    );

    const clients = await this.server.in(lobbyUuid).fetchSockets();

    if (clients.length === 0) {
      await this.markLobbyAsEmptyUseCase.execute(String(lobbyUuid));
    }

    client.leave(String(lobbyUuid));
  }
}
