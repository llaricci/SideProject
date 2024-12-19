"use client";

import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:4000/graphql",
  }),
});

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
