export interface KufarItem {
    account_id: string,
    ad_id: string,
    ad_link: string,
    images: {
        id: string,
        path: string,
    }[],
    list_id: number,
    list_time: string
    price_byn: string
    subject: string
}
