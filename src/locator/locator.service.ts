import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationRepository } from './repositories/location.repository';
import { LocationDto } from './dto/location.dto';
import { User } from '../auth/entities/user.entity';
import { Location } from './entities/location.entity';

@Injectable()
export class LocatorService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: LocationRepository,
  ) {}

  async updateLocation(locationDto: LocationDto, user: User): Promise<void> {
    const { latitude, longitude } = locationDto;
    await this.locationRepository.updateLocation(latitude, longitude, user);
    return;
  }

  async createLocation(locationDto: LocationDto, user: User): Promise<void> {
    const { latitude, longitude, registrationToken } = locationDto;
    await this.locationRepository.createLocation(latitude, longitude, user, registrationToken);
    return;
  }

  async getUserLocation(user: User): Promise<Location> {
    return await this.getUserLocation(user);
  }

  async getAllLocations(): Promise<Location[]> {
    return await this.locationRepository.getAllLocations();
  }
}
