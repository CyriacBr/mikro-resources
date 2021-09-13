import { Embeddable, Property } from '@mikro-orm/core';

@Embeddable()
export class Profile {
  @Property() firstName!: string;
  @Property() lastName!: string;
  @Property() emailAddress!: string;
}
