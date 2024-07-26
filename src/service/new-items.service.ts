import { Inject, Injectable } from '@nestjs/common';
import { KufarItem } from '../models/kufar-item';
import { TaskManager } from "../core/task-manager";
import fetch from 'node-fetch';

export const SEARCH_QUERY = 'SEARCH_QUERY'
export const SEARCH_CATEGORY = 'SEARCH_CATEGORY'


@Injectable()
export class NewItemsService {

    taskManager = new TaskManager({delay: 1000});


    constructor(@Inject(SEARCH_QUERY) private searchQuery: string,
                @Inject(SEARCH_CATEGORY) private searchCategory: string) {
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
            const response = await fetch(url);
            return response.json();
        }) as { ads: KufarItem[], pagination: { pages: { label: string, token: string }[] } };

        const nextToken = result.pagination.pages.find(page => page.label === 'next')?.token;
        return [result.ads, nextToken];
    }

    private buildUrl(cursor: string): string {
        const cursorQuery = cursor ? `cursor=${cursor}&` : '';
        const searchQuery = this.searchQuery ? `query=${encodeURIComponent(this.searchQuery)}&` : '';
        const categoryQuery = this.searchCategory ? `cat=${this.searchCategory}&` : '';
        return `https://api.kufar.by/search-api/v2/search/rendered-paginated?${cursorQuery}${searchQuery}${categoryQuery}lang=ru&ot=1&rgn=7&size=43&sort=lst.d`
    }
}
