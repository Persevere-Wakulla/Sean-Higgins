export interface IGraphQLQuery {
    data: any,
    loading: boolean
}


export interface IGetSubscriber extends IGraphQLQuery{
    data: {
        getSubscriber: {
            liquidCash: number,
            portfolioValue: number,
            openOrderCashHold: number,
            stocksOwned: [],
            stocksWatched: [],
            email: string,
            username: string,
            password: string,
            _id: string
        }
    }
}
export interface IGetSubscriberTickerData extends IGraphQLQuery{
    data: {
        getSubscriberTickerData: {
            liquidCash: number,
            portfolioValue: number,
            stocksOwned: [],
            stocksWatched: [],
            email: string,
            username: string,
            password: string,
            _id: string
        }
    }
}