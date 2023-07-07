import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  // uri: "http://134.209.22.223:5000/graphql", // Replace with your LIVE GraphQL server URL
  uri: "http://localhost:5000/graphql", // Replace with your LOCAL GraphQL server URL
  cache: new InMemoryCache(),
});
