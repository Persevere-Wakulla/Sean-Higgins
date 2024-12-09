import gql from 'graphql-tag';
import { getClient, query, type ReadableQuery, setClient } from 'svelte-apollo-wrappers';

export const ensureApolloLoaded = (store: any) => {
	let hasClient = false;
	try {
		if (getClient()) hasClient = true;
	} catch (error) {
		setClient(store);
		if (getClient()) {
            console.dir('got client')
			hasClient = true;
		}
	}
	return hasClient;
};

export const queryData = (qlCall: string, variables: any): ReadableQuery<any> => {
	return query(gql(qlCall), { variables });
};
