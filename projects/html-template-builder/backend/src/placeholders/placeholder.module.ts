import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Placeholder } from '../placeholders/entities/placeholder.entity';
import { PlaceholderService } from './placeholder.service';
import { PlaceholderController } from './placeholder.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Placeholder])],
  providers: [PlaceholderService],
  controllers: [PlaceholderController],
})
export class PlaceholderModule {}
