
import { PubSub } from "graphql-subscriptions";


export const pubsub = new PubSub<{
    ADD_WATCHLIST: {subscriber: any}
}>();