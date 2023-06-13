import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: "/graphql", // Replace with your GraphQL server URL
  cache: new InMemoryCache(),
});
