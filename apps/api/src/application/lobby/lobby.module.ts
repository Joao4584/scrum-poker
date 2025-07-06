import { Module } from '@nestjs/common';
import { AddParticipantLobbyUseCase } from '@/application/lobby/add-participant-lobby.use-case';
import { FindOrCreateLobbyUseCase } from '@/application/lobby/find-or-create-lobby.use-case';
import { MarkParticipantAsDisconnectedUseCase } from '@/application/lobby/mark-participant-disconnected.use-case';
import { JoinLobbyController } from '@/presentation/controllers/lobby/join-lobby.controller';
import { LobbyGateway } from '@/presentation/gateways/lobby.gateway';
import { MarkLobbyAsEmptyUseCase } from '@/application/lobby/mark-lobby-as-empty.use-case';
import { LobbyRepository } from '@/infrastructure/repositories/lobby.repository';

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