import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Design } from '../../entities/design.entity';
import { DesignsController } from './controllers/designs.controller';
import { DesignsService } from './services/designs.service';
import { DesignsResolver } from './resolvers/designs.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Design])],
  controllers: [DesignsController],
  providers: [DesignsService, DesignsResolver],
  exports: [DesignsService],
})
export class DesignsModule {}