import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: "http://localhost:5000/graphql", // Replace with your GraphQL server URL
  cache: new InMemoryCache(),
});
