import { IsNotEmpty, IsString } from 'class-validator';

export class LocationDto {
  @IsNotEmpty()
  latitude: number;

  @IsNotEmpty()
  longitude: number;

  @IsNotEmpty()
  @IsString()
  registrationToken: string;
}
