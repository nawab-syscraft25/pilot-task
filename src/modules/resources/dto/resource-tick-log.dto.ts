export class ResourceTickLogDto {
  id: string;
  userId: string;
  username: string;
  woodAdded: number;
  foodAdded: number;
  totalWoodAfter: number;
  totalFoodAfter: number;
  success: boolean;
  errorMessage: string | null;
  tickedAt: Date;
}
