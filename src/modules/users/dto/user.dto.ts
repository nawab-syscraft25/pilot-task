import { Exclude } from 'class-transformer';
import { ResourceDto } from '../../resources/dto/resource.dto';

export class UserDto {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  resources: ResourceDto;
}
