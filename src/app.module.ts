import { Module } from '@nestjs/common';
import { KufarController } from './controllers/kufar.controller';
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, TelegramNotifier } from './service/telegram-notifier';
import { TelegramMessageBuilder } from './service/telegram-message.builder';
import { ScheduleModule } from '@nestjs/schedule';
import { NewItemsScheduler } from "./service/new-items-scheduler";
import { NewItemsService, SEARCH_CATEGORY, SEARCH_QUERY } from "./service/new-items.service";
import { LastSyncRepository } from "./repository/last-sync.repository";
import { JSON_DB_TOKEN } from "./db/json.db";

const JSONdb = require("simple-json-db");

@Module({
    imports: [
        ScheduleModule.forRoot(),
    ],
    controllers: [KufarController],
    providers: [
        TelegramNotifier,
        TelegramMessageBuilder,
        NewItemsScheduler,
        NewItemsService,
        {
            provide: JSON_DB_TOKEN,
            useValue: new JSONdb('./db/json.db.json')
        },
        {
            provide: TELEGRAM_CHAT_ID,
            useFactory: () => process.env.TELEGRAM_CHAT_ID,
        },
        {
            provide: TELEGRAM_BOT_TOKEN,
            useFactory: () => process.env.TELEGRAM_BOT_TOKEN,
        },
        {
            provide: SEARCH_QUERY,
            useFactory: () => process.env.SEARCH_QUERY,
        },
        {
            provide: SEARCH_CATEGORY,
            useFactory: () => process.env.SEARCH_CATEGORY,
        },
        LastSyncRepository,

    ],
})
export class AppModule {
}
