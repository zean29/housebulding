import { PartialType } from '@nestjs/swagger';
import { CreateDesignDto } from './create-design.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { DesignStatus } from '../../../entities/design.entity';

export class UpdateDesignDto extends PartialType(CreateDesignDto) {
  @IsOptional()
  @IsEnum(DesignStatus)
  status?: DesignStatus;
}