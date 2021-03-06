import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-boost';
import { setContext } from 'apollo-link-context';

import { AUTH_TOKEN, THEME } from './utils/constants';
import { typeDefs, resolvers } from './graphql/resolvers';

import App from './App';

const httpLink = createHttpLink({
  uri: 'https://swapp.st6.io/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  typeDefs,
  resolvers,
});

client.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem(AUTH_TOKEN),
    theme: !localStorage.getItem(THEME) ? 'light' : localStorage.getItem(THEME),
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root'),
);
