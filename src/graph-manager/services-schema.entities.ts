import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

import { GatewayVersion } from './gateways-version.entities';
import { ObjectBase } from './graph-manager.entities';
import { Service } from './services.entities';

@ObjectType()
@Entity()
export class ServiceSchema extends ObjectBase {
  @Column()
  @Field(() => String)
  version: string;

  @Column('text')
  @Field(() => String)
  typeDefs: string;

  @ManyToOne(
    () => Service,
    service => service.schemas,
  )
  @Field(() => Service)
  service: Promise<Service>;

  @ManyToMany(
    () => GatewayVersion,
    gatewayVersion => gatewayVersion.serviceSchemas,
  )
  @Field(() => [GatewayVersion])
  gatewayVersions: Promise<GatewayVersion[]>;
}
