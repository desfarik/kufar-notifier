import { Module } from '@nestjs/common';
import { KufarController } from './controllers/kufar.controller';
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, TelegramNotifier } from './service/telegram-notifier';
import { TelegramMessageBuilder } from './service/telegram-message.builder';
import { ScheduleModule } from '@nestjs/schedule';
import { NewItemsScheduler } from "./service/new-items-scheduler";
import {
    EXTRA_QUERY,
    MAX_PRICE,
    MIN_PRICE,
    NewItemsService,
    SEARCH_CATEGORY,
    SEARCH_QUERY
} from "./service/new-items.service";
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
        {
            provide: MAX_PRICE,
            useFactory: () => process.env.MAX_PRICE,
        },
        {
            provide: MIN_PRICE,
            useFactory: () => process.env.MIN_PRICE,
        },
        {
            provide: EXTRA_QUERY,
            useFactory: () => process.env.EXTRA_QUERY,
        },
        LastSyncRepository,

    ],
})
export class AppModule {
}
