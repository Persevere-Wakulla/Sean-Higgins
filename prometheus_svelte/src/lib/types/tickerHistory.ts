export type TickerHistory = {
    symbol: string,
    date: string,
    latestVolume: number,
    previousClose: number,
    volume: number,
    low: number | string,
    high: number | string,
    latestPrice: number,
    close: number | string,
    open: number | string,
    changePercent: number,
    change: number
}

export type TickerHistoryTT = {
    Date: string,
    Low: number | string,
    High: number | string,
    Close: number | string,
    Open: number | string
}