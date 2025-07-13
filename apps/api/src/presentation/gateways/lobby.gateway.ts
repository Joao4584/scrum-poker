// import { Inject } from '@nestjs/common';
// import {
//   WebSocketGateway,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   ConnectedSocket,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Socket, type Server } from 'socket.io';
// import { AddParticipantLobbyUseCase } from '@/application/lobby/add-participant-lobby.use-case';
// import { MarkParticipantAsDisconnectedUseCase } from '@/application/lobby/mark-participant-disconnected.use-case';
// import { MarkLobbyAsEmptyUseCase } from '@/application/lobby/mark-lobby-as-empty.use-case';

// @WebSocketGateway({ namespace: 'lobby' }) // ws://localhost:3000/lobby
// export class LobbyGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;

//   constructor(
//     @Inject(AddParticipantLobbyUseCase)
//     private readonly addParticipantLobbyUseCase: AddParticipantLobbyUseCase,

//     @Inject(MarkParticipantAsDisconnectedUseCase)
//     private readonly markParticipantAsDisconnectedUseCase: MarkParticipantAsDisconnectedUseCase,

//     @Inject(MarkLobbyAsEmptyUseCase)
//     private readonly markLobbyAsEmptyUseCase: MarkLobbyAsEmptyUseCase,
//   ) {}

//   async handleConnection(client: Socket) {
//     const { user_id, lobbyUuid } = client.handshake.query;

//     if (!user_id || !lobbyUuid) {
//       client.disconnect();
//       return;
//     }

//     await this.addParticipantLobbyUseCase.execute(
//       Number(user_id),
//       String(lobbyUuid),
//     );
//     client.join(lobbyUuid as string);
//   }

//   async handleDisconnect(client: Socket) {
//     const { user_id, lobbyUuid } = client.handshake.query;

//     if (!user_id || !lobbyUuid) return;

//     await this.markParticipantAsDisconnectedUseCase.execute(
//       Number(user_id),
//       String(lobbyUuid),
//     );

//     const clients = await this.server.in(lobbyUuid as string).fetchSockets();

//     if (clients.length === 0) {
//       await this.markLobbyAsEmptyUseCase.execute(String(lobbyUuid));
//     }

//     client.leave(String(lobbyUuid));
//   }
// }
