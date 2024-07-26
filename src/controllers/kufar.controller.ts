import { Controller, Param, Post } from '@nestjs/common';
import { KufarItem } from '../models/kufar-item';
import { TelegramNotifier } from '../service/telegram-notifier';
import { LastSyncRepository } from '../repository/last-sync.repository';
import { NewItemsScheduler } from '../service/new-items-scheduler';
import { TelegramMessageBuilder } from "../service/telegram-message.builder";
import { NewItemsService } from "../service/new-items.service";

@Controller()
export class KufarController {
  constructor(
    private readonly telegramNotifier: TelegramNotifier,
    private readonly lastSyncRepository: LastSyncRepository,
    private readonly newItemsScheduler: NewItemsScheduler,
    private readonly newItemsService: NewItemsService,
    private messageBuilder: TelegramMessageBuilder,
  ) {}

  @Post('kufar/parse')
  async parseKufar(): Promise<KufarItem[]> {
    const [items, nextToken] =  await this.newItemsService.searchByQuery();
    return items;
  }

  @Post('kufar/parsing/start')
  startParseRealt(): Promise<void> {
    return this.newItemsScheduler.checkNewFlats();
  }

  @Post('kufar/telegram/notify/:count')
  async sendMessageToTelegram(
    @Param('timeInMs') timeInMs: number = 1,
  ): Promise<void> {
    const items = await this.newItemsService.fetchNewItems(new Date().getTime() - timeInMs);
    return items.forEach((item) => this.telegramNotifier.notify(this.messageBuilder.buildMessage(item)));
  }

  @Post('kufar/last-updated-date/:date')
  setLastUpdatedDate(@Param('date') number: number): void {
    this.lastSyncRepository.setLastSyncTime(Number(number));
  }
}
