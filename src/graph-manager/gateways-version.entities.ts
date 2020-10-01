import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import { Gateway } from './gateways.entities';
import { ObjectBase } from './graph-manager.entities';
import { ServiceSchema } from './services-schema.entities';

export enum GatewayVersionStatus {
  PENDING = 'PENDING',
  VALID = 'VALID',
  INVALID = 'INVALID',
}
registerEnumType(GatewayVersionStatus, {
  name: 'GatewayVersionStatus',
});

@ObjectType()
@Entity()
export class GatewayVersion extends ObjectBase {
  @Column({ default: GatewayVersionStatus.PENDING })
  @Field(() => GatewayVersionStatus)
  status: GatewayVersionStatus;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  validationError: string;

  @ManyToOne(
    () => Gateway,
    gateway => gateway.versions,
  )
  @Field(() => Gateway)
  gateway: Promise<Gateway>;

  @ManyToMany(
    () => ServiceSchema,
    serviceSchema => serviceSchema.gatewayVersions,
  )
  @JoinTable()
  @Field(() => [ServiceSchema])
  serviceSchemas: Promise<ServiceSchema[]>;
}
