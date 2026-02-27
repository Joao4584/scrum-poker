import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User as UserEntity } from '@/infrastructure/entities/user.entity';
import { CreateSupportRequestUseCase } from '@/application/support/use-case/create-support-request.use-case';
import { ListSupportRequestsUseCase } from '@/application/support/use-case/list-support-requests.use-case';
import { DeleteSupportRequestUseCase } from '@/application/support/use-case/delete-support-request.use-case';
import { CreateSupportRequest } from '@/presentation/requests/support/create-support-request.request';
import { ValidationRequestPipe } from '@/shared/pipes/validation-request.pipe';
import { User } from '@/presentation/decorators/user.decorator';

@ApiTags('Support')
@ApiBearerAuth()
@Controller('support')
export class SupportController {
  constructor(
    private readonly createSupportRequestUseCase: CreateSupportRequestUseCase,
    private readonly listSupportRequestsUseCase: ListSupportRequestsUseCase,
    private readonly deleteSupportRequestUseCase: DeleteSupportRequestUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar feedback ou sugestao de melhoria' })
  @ApiBody({ type: CreateSupportRequest })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        message: 'Feedback enviado com sucesso',
        support: {
          public_id: '01JZY9M0S95ZNK8TRVQX8RGRR8',
          subject: 'Sugestao para atalhos no teclado',
          message: 'Seria legal ter atalho para revelar e esconder votos.',
          rating: 4,
          created_at: '2026-02-27T00:00:00.000Z',
        },
      },
    },
  })
  async create(@Body(ValidationRequestPipe) body: CreateSupportRequest, @User() user: UserEntity) {
    const support = await this.createSupportRequestUseCase.execute({
      user_id: user.id,
      subject: body.subject,
      message: body.message,
      rating: body.rating,
    });

    return {
      message: 'Feedback enviado com sucesso',
      support,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar feedbacks do usuario logado' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        data: [
          {
            public_id: '01JZY9M0S95ZNK8TRVQX8RGRR8',
            subject: 'Sugestao para atalhos no teclado',
            message: 'Seria legal ter atalho para revelar e esconder votos.',
            rating: 4,
            created_at: '2026-02-27T00:00:00.000Z',
          },
        ],
      },
    },
  })
  async list(@User() user: UserEntity) {
    const data = await this.listSupportRequestsUseCase.execute(user.id);
    return { data };
  }

  @Delete(':public_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover feedback' })
  @ApiParam({
    name: 'public_id',
    description: 'Public id do feedback',
  })
  @ApiResponse({ status: 204 })
  async remove(@Param('public_id') public_id: string, @User() user: UserEntity) {
    await this.deleteSupportRequestUseCase.execute(user.id, public_id);
  }
}
