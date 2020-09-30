import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

import { Gateway } from './gateways.entities';
import { ObjectBase } from './graph-manager.entities';
import { ServiceSchema } from './services-schema.entities';

@ObjectType()
@Entity()
export class Service extends ObjectBase {
  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  url: string;

  @OneToMany(
    () => ServiceSchema,
    serviceSchema => serviceSchema.service,
  )
  @Field(() => [ServiceSchema])
  schemas: Promise<ServiceSchema[]>;

  @OneToOne(() => ServiceSchema)
  @JoinColumn()
  @Field(() => ServiceSchema, { nullable: true })
  latestSchema: Promise<ServiceSchema>;

  @ManyToMany(
    () => Gateway,
    gateway => gateway.services,
  )
  gateways: Promise<Gateway[]>;
}
