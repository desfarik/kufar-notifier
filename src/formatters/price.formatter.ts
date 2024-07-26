export function formatPrice(price: string): string {
    const priceNum = parseInt(price);
    if (Number.isNaN(priceNum)) {
        return 'Не указана'
    }
    return priceNum / 100 + ' BYN';
}
