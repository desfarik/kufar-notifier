import fetch from 'node-fetch';
import { Inject, Injectable } from '@nestjs/common';
import { TaskManager } from "../core/task-manager";

export const TELEGRAM_BOT_TOKEN = 'TELEGRAM_BOT_TOKEN';
export const TELEGRAM_CHAT_ID = 'TELEGRAM_BOT_ID';

const HEADERS = {
    accept: 'application/json',
    'User-Agent':
        'Telegram Bot SDK - (https://github.com/irazasyed/telegram-bot-sdk)',
    'content-type': 'application/json',
};

@Injectable()
export class TelegramNotifier {
    taskManager = new TaskManager({delay: 200});

    constructor(@Inject(TELEGRAM_BOT_TOKEN) private botToken: string,
                @Inject(TELEGRAM_CHAT_ID) private chatId: string,
    ) {
    }

    get chatUrl(): string {
        return `https://api.telegram.org/${this.botToken}/sendMessage`;
    }

    async notify(message: string): Promise<void> {
        this.taskManager.exec(async () => {
            return  fetch(this.chatUrl, {
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify({
                    text: message,
                    parse_mode: 'Markdown',
                    disable_web_page_preview: false,
                    disable_notification: true,
                    reply_to_message_id: null,
                    chat_id: this.chatId,
                }),
            });
        })
    }
}
