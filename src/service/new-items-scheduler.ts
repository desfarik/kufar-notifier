import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NewItemsService } from './new-items.service';
import { TelegramNotifier } from './telegram-notifier';
import { LastSyncRepository } from '../repository/last-sync.repository';
import { TelegramMessageBuilder } from "./telegram-message.builder";

@Injectable()
export class NewItemsScheduler {
    constructor(
        private newItemsService: NewItemsService,
        private telegramNotifier: TelegramNotifier,
        private lastSyncRepository: LastSyncRepository,
        private telegramMessageBuilder: TelegramMessageBuilder,
    ) {
        this.checkNewFlats();
    }

    @Cron(CronExpression.EVERY_30_MINUTES)
    async checkNewFlats() {
        try {
            const lastSyncTime = this.lastSyncRepository.getLastSyncTime();
            const items = await this.newItemsService.fetchNewItems(lastSyncTime);
            items.forEach((item) => this.telegramNotifier.notify(this.telegramMessageBuilder.buildMessage(item)));
            if (items.length === 0) {
                console.log(`No new items.`);
            }
            this.lastSyncRepository.setLastSyncTime(Date.now());
        } catch (e) {
            console.log(e);
        }
    }
}
