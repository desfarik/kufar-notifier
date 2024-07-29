import { Inject, Injectable } from '@nestjs/common';
import { KufarItem } from '../models/kufar-item';
import { TaskManager } from "../core/task-manager";
import fetch from 'node-fetch';
import * as https from "https";

export const SEARCH_QUERY = 'SEARCH_QUERY'
export const SEARCH_CATEGORY = 'SEARCH_CATEGORY'
export const MAX_PRICE = 'MAX_PRICE'
export const MIN_PRICE = 'MIN_PRICE'
export const EXTRA_QUERY = 'EXTRA_QUERY'


@Injectable()
export class NewItemsService {

    taskManager = new TaskManager({delay: 1000});


    constructor(@Inject(SEARCH_QUERY) private searchQuery: string,
                @Inject(SEARCH_CATEGORY) private searchCategory: string,
                @Inject(MAX_PRICE) private maxPrice: string,
                @Inject(MIN_PRICE) private minPrice: string,
                @Inject(EXTRA_QUERY) private extraQuery: string,
    ) {
    }

    async fetchNewItems(lastSyncTime: number) {
        const newItems: KufarItem[] = [];
        let token = ''
        while (true) {
            const [items, nextToken] = await this.searchByQuery(token);
            const lastIdIndex = items.findIndex(
                (item) => lastSyncTime > new Date(item.list_time).getTime(),
            );
            token = nextToken;
            if (items.length === 0 || lastIdIndex > -1) {
                newItems.push(...items.slice(0, lastIdIndex));
                return newItems.reverse();
            } else {
                newItems.push(...items);
            }
        }
    }

    public async searchByQuery(cursor: string = ''): Promise<[KufarItem[], string]> {
        const result = await this.taskManager.exec(async () => {
            const url = this.buildUrl(cursor);
            console.log(`Try to fetch items from ${url}`)
            const httpsAgent = new https.Agent({
                rejectUnauthorized: false,
            });

            const response = await fetch(url, {
                method: 'GET',
                agent: httpsAgent
            });
            return response.json();
        }) as { ads: KufarItem[], pagination: { pages: { label: string, token: string }[] } };

        const nextToken = result.pagination.pages.find(page => page.label === 'next')?.token;
        return [result.ads, nextToken];
    }

    private buildUrl(cursor: string): string {
        const cursorQuery = cursor ? `cursor=${cursor}&` : '';
        const searchQuery = this.searchQuery ? `query=${encodeURIComponent(this.searchQuery)}&` : '';
        const categoryQuery = this.searchCategory ? `cat=${this.searchCategory}&` : '';
        const extraQuery = this.extraQuery ? this.extraQuery + '&' : '';
        return `https://api.kufar.by/search-api/v2/search/rendered-paginated?${extraQuery}${cursorQuery}${searchQuery}${categoryQuery}${this.priceQuery}lang=ru&ot=1&rgn=7&size=43&sort=lst.d`
    }

    private get priceQuery(): string {
        if (!this.maxPrice || !this.minPrice) {
            return '';
        }
        const min = Math.max(Number(this.minPrice), 0);
        const max = Math.min(Number(this.maxPrice), 1000000000);
        return `prc=r:${encodeURIComponent(`${min},${max}`)}&`
    }
}
