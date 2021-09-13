import { Embedded, Entity } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Profile } from './profile.entity';

@Entity()
export class User extends BaseEntity {
  @Embedded({ entity: () => Profile, object: true }) profile!: Profile;
}
