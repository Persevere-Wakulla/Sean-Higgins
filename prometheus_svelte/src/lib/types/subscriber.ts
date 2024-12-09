export type SubscriberType = {
    _id: string,
    email: string,
    username: string,
    password: string,
    liquidCash: number,
    portfolioValue: number,
    openOrderCashHold: number,
    stocksOwned: string[],
    stocksWatched: string[]
}