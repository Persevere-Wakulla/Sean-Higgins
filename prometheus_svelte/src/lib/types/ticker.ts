import type { TickerHistory } from "./tickerHistory"

export type Ticker = {
    name: string,
    symbol: string,
    country: string,
    industry: string, 
    sector: string,
    history: TickerHistory[]
}