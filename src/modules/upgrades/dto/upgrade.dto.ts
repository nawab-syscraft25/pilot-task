import { ConstructionStatus, UpgradeType } from '../entities/construction-task.entity';

export class UpgradeDto {
  id: string;
  userId: string;
  upgradeType: UpgradeType;
  upgradeName: string;
  woodCost: number;
  foodCost: number;
  durationSeconds: number;
  status: ConstructionStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date;
}
