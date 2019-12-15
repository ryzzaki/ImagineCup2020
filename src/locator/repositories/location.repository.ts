import { EntityRepository, Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
import { User } from '../../auth/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Location)
export class LocationRepository extends Repository<Location> {
  async createLocation(latitude: number, longitude: number, user: User, registrationToken: string): Promise<void> {
    const location = new Location();
    location.latitude = latitude;
    location.longitude = longitude;
    location.user = user;
    location.userId = user.id;
    location.registrationToken = registrationToken;
    await this.save(location);
  }

  async updateLocation(latitude: number, longitude: number, user: User): Promise<void> {
    const location = await this.findOne({ user });
    location.latitude = latitude;
    location.longitude = longitude;
    await this.update(location.id, location);
  }

  async getUserLocation(user: User): Promise<Location> {
    try {
      const location = await this.findOneOrFail({ user });
      return location;
    } catch (err) {
      throw new NotFoundException('Location not found');
    }
  }

  async getAllLocations(): Promise<Location[]> {
    return await this.find();
  }

  async getAllTokens(): Promise<string[]> {
    const locations: Location[] = await this.find();
    const tokens = [];
    for (const location of locations) {
      tokens.push(location.registrationToken);
    }
    return tokens;
  }
}
