import { Module } from '@nestjs/common';
import { AddParticipantLobbyUseCase } from './useCases/add-participant-lobby';
import { FindOrCreateLobbyUseCase } from './useCases/find-or-create-lobby';
import { MarkParticipantAsDisconnectedUseCase } from './useCases/mark-participant-disconnected';
import { JoinLobbyController } from './controllers/join-lobby.controller';
import { LobbyGateway } from 'modules/shared/gateway/lobby.socket';
import { MarkLobbyAsEmptyUseCase } from './useCases/mark-lobby-as-empty';
import { LobbyRepository } from './repositories/lobby.repo';

@Module({
  providers: [
    LobbyGateway,
    LobbyRepository,

    AddParticipantLobbyUseCase,
    FindOrCreateLobbyUseCase,
    MarkLobbyAsEmptyUseCase,
    MarkParticipantAsDisconnectedUseCase,
  ],
  controllers: [JoinLobbyController],
  exports: [],
})
export class LobbyModule {}
