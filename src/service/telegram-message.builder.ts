import { Injectable } from '@nestjs/common';
import { KufarItem } from '../models/kufar-item';
import { formatPrice } from "../formatters/price.formatter";

@Injectable()
export class TelegramMessageBuilder {
    buildMessage(item: KufarItem): string {
        return `*${item.subject}*
*Цена:*  ${formatPrice(item.price_byn)}
${item.ad_link}`
    }
}
