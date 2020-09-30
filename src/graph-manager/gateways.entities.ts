import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

import { GatewayVersion } from './gateways-version.entities';
import { ObjectBase } from './graph-manager.entities';
import { Service } from './services.entities';

@ObjectType()
@Entity()
export class Gateway extends ObjectBase {
  @Column()
  @Field(() => String)
  name: string;

  @ManyToMany(
    () => Service,
    service => service.gateways,
  )
  @JoinTable()
  @Field(() => [Service])
  services: Promise<Service[]>;

  @OneToMany(
    () => GatewayVersion,
    version => version.gateway,
  )
  @Field(() => [GatewayVersion])
  versions: Promise<GatewayVersion[]>;

  @OneToOne(() => GatewayVersion, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(() => GatewayVersion, { nullable: true })
  currentVersion: Promise<GatewayVersion>;
}
