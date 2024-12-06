import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo-hooks';
import { ApolloClient } from 'apollo-client';
import { RestLink } from 'apollo-link-rest';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { config } from './config';
import { UserStore } from './stores/UserStore';
import * as serviceWorker from './serviceWorker';

// Create HTTP / authentication link for graphql
const httpLink = new RestLink({ uri: config.api.paidpal });

const authLink = setContext((_, options: any) => {
  // Grab user's auth token
  const token = UserStore.user ? UserStore.user.token : '';
  return {
    headers: {
      ...options && options.headers,
      'Cache-Control': 'no-cache',
      'X-AUTH-TOKEN': (UserStore && UserStore.user) ? UserStore.user.token : '',
    },
  };
});

// Initialize apollo graphql client
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Renders the application
ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();