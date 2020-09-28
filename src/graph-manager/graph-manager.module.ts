import { Gateway } from './graph-manager.entities';
import { GatewayResolver } from './gateway.resolvers';
import { GatewayService } from './gateway.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Gateway])],
  controllers: [],
  providers: [GatewayService, GatewayResolver],
})
export class GraphManagerModule {}
