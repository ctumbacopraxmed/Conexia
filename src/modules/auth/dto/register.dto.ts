import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({required: true})
  @IsString()
  email: string;

  @ApiProperty({required: true})
  @IsString()
  password: string;

  @ApiProperty({ required: false })
  @IsString()
  name?: string;
}
