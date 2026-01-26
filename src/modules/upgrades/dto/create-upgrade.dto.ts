import { IsNotEmpty, IsEnum, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpgradeType } from '../entities/construction-task.entity';

export class CreateUpgradeDto {
  @ApiProperty({
    description: 'Type of upgrade to construct',
    enum: UpgradeType,
    example: UpgradeType.BUILDING,
  })
  @IsNotEmpty()
  @IsEnum(UpgradeType)
  upgradeType: UpgradeType;

  @ApiProperty({
    description: 'Name of the upgrade',
    example: 'Woodcutter Hut',
  })
  @IsNotEmpty()
  upgradeName: string;

  @ApiProperty({
    description: 'Wood cost for the upgrade',
    example: 50,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  woodCost: number;

  @ApiProperty({
    description: 'Food cost for the upgrade',
    example: 30,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  foodCost: number;

  @ApiProperty({
    description: 'Duration in seconds for construction to complete',
    example: 120,
    minimum: 1,
    required: false,
  })
  @IsInt()
  @Min(1)
  durationSeconds?: number = 60;
}
