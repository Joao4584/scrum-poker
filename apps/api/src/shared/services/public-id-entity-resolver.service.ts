import { Injectable } from '@nestjs/common';
import { DataSource, EntityTarget } from 'typeorm';
import { AppErrors } from '@/presentation/errors';

interface ResolveByPublicIdOptions {
  entityLabel?: string;
  includeDeleted?: boolean;
  required?: boolean;
}

interface EntityWithPublicId {
  public_id: string;
}

@Injectable()
export class PublicIdEntityResolverService {
  constructor(private readonly dataSource: DataSource) {}

  async resolve<T extends EntityWithPublicId>(
    entity: EntityTarget<T>,
    publicId: string,
    options?: ResolveByPublicIdOptions,
  ): Promise<T | null> {
    const normalizedPublicId = String(publicId ?? '').trim();
    const required = options?.required ?? true;

    if (!normalizedPublicId) {
      if (!required) {
        return null;
      }
      throw AppErrors.badRequest('public_id obrigatorio');
    }

    const repository = this.dataSource.getRepository(entity);
    const resource = await repository.findOne({
      where: { public_id: normalizedPublicId } as never,
      withDeleted: options?.includeDeleted ?? false,
    });

    if (!resource && required) {
      const entityLabel = options?.entityLabel ?? 'Recurso';
      throw AppErrors.notFound(`${entityLabel} nao encontrado`);
    }

    return resource;
  }
}
