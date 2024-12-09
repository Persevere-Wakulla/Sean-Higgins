import { WebSocketLink } from '@apollo/client/link/ws';
import { HttpLink } from '@apollo/client/link/http';
import { split } from '@apollo/client/link/core';
import { getMainDefinition } from '@apollo/client/utilities';

import { ApolloClient, InMemoryCache } from "@apollo/client/core";

const httpLink = new HttpLink({
    uri: 'http://localhost:5173/api/graphql',
  });
  
//   const wsLink = new WebSocketLink({
//     uri: 'ws://localhost:5173/api/graphql',
//     options: {
//       reconnect: true,
//     },
//   });

  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    httpLink,
    httpLink
  );

  
export const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
