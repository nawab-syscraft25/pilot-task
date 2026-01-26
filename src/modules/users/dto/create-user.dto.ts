import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username for the user',
    example: 'player1',
    minLength: 3,
  })
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'player1@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
