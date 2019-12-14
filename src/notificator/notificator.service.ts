import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { LocatorService } from '../locator/locator.service';
import * as admin from 'firebase-admin';
import appConfig from '../config/configuration.config';
import { OriginDto } from './dto/origin.dto';

@Injectable()
export class NotificatorService {
  private logger = new Logger('NotificatorService');

  constructor(private readonly locatorService: LocatorService) {}

  async requireAssistance(originDto: OriginDto): Promise<void> {
    const { originLat, originLong, ambulanceEta, description } = originDto;
    const etaInSeconds = ambulanceEta * 60 - 10;
    const relativeUsers = await this.calculateRouteMatrix(originLong, originLat);
    const sorted = relativeUsers.sort((a, b) =>
      a.travelTime > b.travelTime ? 1 : b.travelTime > a.travelTime ? -1 : 0,
    );
    for (const person of sorted) {
      if (person.travelTime > etaInSeconds) {
        break;
      } else {
        const message = await this.constructMessage(
          etaInSeconds,
          originLong,
          originLat,
          person.length,
          person.id,
          person.travelTime,
          description,
        );
        await this.sendNotification(message.message);
      }
    }
  }

  private async sendNotification(message: admin.messaging.MulticastMessage): Promise<void> {
    const serviceAccount = require(appConfig.serverSettings.firebaseAdminSA);

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: appConfig.serverSettings.firebaseAdminUrl,
      });
    }

    admin
      .messaging()
      .sendMulticast(message)
      .then(response => {
        this.logger.log(`${response.successCount} messages were sent successfully`);
      })
      .catch(error => {
        this.logger.error(`Error sending message: ${error}`);
      });
  }

  private async calculateRouteMatrix(originLat: number, originLong: number): Promise<any> {
    const userIds = [];
    const listCoordinates = [];
    const relativeUsers = [];
    const locations = await this.locatorService.getAllLocations();
    for (const location of locations) {
      userIds.push(location.userId);
      listCoordinates.push([location.longitude, location.latitude]);
    }
    const api = appConfig.serverSettings.azureApi;
    const data = await this.constructData(originLat, originLong, listCoordinates);
    const result = await axios.post(api, data);
    const matrix = result.data.matrix[0];
    for (const route of matrix) {
      const relativeUser = {
        userId: userIds.shift(),
        length: route.response.routeSummary.lengthInMeters,
        travelTime: route.response.routeSummary.travelTimeInSeconds,
      };
      relativeUsers.push(relativeUser);
    }
    return relativeUsers;
  }

  private async constructData(originLat: number, originLong: number, listCoordinates: any): Promise<{ data: any }> {
    const data: any = {
      origins: {
        type: 'MultiPoint',
        coordinates: [[originLong, originLat]],
      },
      destinations: {
        type: 'MultiPoint',
        coordinates: listCoordinates,
      },
    };
    return data;
  }

  private async constructMessage(
    ambulanceEta: number,
    originLong: number,
    originLat: number,
    length: number,
    userId: number,
    travelTime: number,
    description: string,
  ): Promise<{ message: admin.messaging.MulticastMessage }> {
    // @Todo: do code review for this token system
    const registrationTokens = await this.locatorService.getAllTokens();

    const message: admin.messaging.MulticastMessage = {
      notification: {
        title: 'EMERGENCY',
        body: `PERSON IN VICINITY OF ${length} METRES NEEDS YOUR AID!`,
      },
      android: {
        ttl: ambulanceEta * 1000,
        notification: {
          color: '#f45342',
          sound: 'default',
        },
      },
      data: {
        longitude: String(originLong),
        latitude: String(originLat),
        userId: String(userId),
        lengthInMeters: String(length),
        travelTimeInSeconds: String(travelTime),
        description: String(description),
      },
      tokens: registrationTokens,
    };
    return { message };
  }
}
