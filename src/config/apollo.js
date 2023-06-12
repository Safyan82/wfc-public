import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: "http://134.209.22.223/graphql", // Replace with your GraphQL server URL
  cache: new InMemoryCache(),
});
