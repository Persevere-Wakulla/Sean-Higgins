import type { ApolloClient, NormalizedCacheObject } from "@apollo/client/core";
import { readable, writable, type Readable, type Subscriber, type Writable } from "svelte/store";
import { client } from "$lib/apolloClient";
import type { SubscriberType } from "$lib/types/subscriber";


export const chartMAs: Writable<any> = writable([])


export const subscriber: Writable<SubscriberType> = writable({} as SubscriberType)


export const apolloStore: Writable<ApolloClient<NormalizedCacheObject>> = writable(client);