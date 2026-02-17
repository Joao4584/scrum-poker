import { Injectable, PipeTransform, Type, mixin } from '@nestjs/common';
import { EntityTarget } from 'typeorm';
import { PublicIdEntityResolverService } from '@/shared/services/public-id-entity-resolver.service';

interface EntityByPublicIdPipeOptions {
  entityLabel?: string;
  includeDeleted?: boolean;
}

interface EntityWithPublicId {
  public_id: string;
}

export function createEntityByPublicIdPipe<T extends EntityWithPublicId>(
  entity: EntityTarget<T>,
  options?: EntityByPublicIdPipeOptions,
): Type<PipeTransform<string, Promise<T>>> {
  @Injectable()
  class EntityByPublicIdPipe implements PipeTransform<string, Promise<T>> {
    constructor(private readonly resolver: PublicIdEntityResolverService) {}

    async transform(value: string): Promise<T> {
      const resource = await this.resolver.resolve(entity, value, {
        entityLabel: options?.entityLabel,
        includeDeleted: options?.includeDeleted,
        required: true,
      });

      return resource;
    }
  }

  return mixin(EntityByPublicIdPipe);
}
