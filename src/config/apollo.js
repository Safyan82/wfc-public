import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';


// const graphqlEndpoint =  "http://134.209.22.223:5000/graphql"; // Replace with your LIVE GraphQL server URL
const graphqlEndpoint =  "http://localhost:5000/graphql" // Replace with your LOCAL GraphQL server URL


const httpLink = createHttpLink({
  uri: graphqlEndpoint,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('authToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});


export const privateClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});


export const publicClient = new ApolloClient({
  
  uri: graphqlEndpoint,
  
  cache: new InMemoryCache(),


});