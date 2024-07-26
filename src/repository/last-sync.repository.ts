import { Inject, Injectable } from '@nestjs/common';
import { JSON_DB, JSON_DB_TOKEN } from '../db/json.db';

const ONE_DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class LastSyncRepository {
  constructor(@Inject(JSON_DB_TOKEN) private db: JSON_DB) {}

  setLastSyncTime(time: number): void {
    this.db.set('lastSyncTime', time);
    console.log('Last Sync Date: ' + new Date(time));
  }

  getLastSyncTime(): number {
    return this.db.get('lastSyncTime') || Date.now() - ONE_DAY;
  }
}
