import { Module } from '@nestjs/common';
import { AddParticipantLobbyUseCase } from './add-participant-lobby.use-case';
import { FindOrCreateLobbyUseCase } from './find-or-create-lobby.use-case';
import { MarkParticipantAsDisconnectedUseCase } from './mark-participant-disconnected.use-case';
import { JoinLobbyController } from '../../presentation/controllers/lobby/join-lobby.controller';
import { LobbyGateway } from '../../presentation/gateways/lobby.gateway';
import { MarkLobbyAsEmptyUseCase } from './mark-lobby-as-empty.use-case';
import { LobbyRepository } from '../../infrastructure/repositories/lobby.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lobby } from '../../infrastructure/entities/lobby.entity';
import { LobbyParticipant } from '../../infrastructure/entities/lobby-participant.entity';
import { UsersRepository } from '@/infrastructure/repositories/user.repository';
import { User } from '@/infrastructure/entities/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Lobby, User, LobbyParticipant])],
  providers: [
    LobbyRepository,
    UsersRepository,
    LobbyGateway,
    AddParticipantLobbyUseCase,
    FindOrCreateLobbyUseCase,
    MarkLobbyAsEmptyUseCase,
    MarkParticipantAsDisconnectedUseCase,
  ],
  controllers: [JoinLobbyController],
})
export class LobbyModule {}