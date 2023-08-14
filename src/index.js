import 'dragula/dist/dragula.css';
import 'react-resizable/css/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloProvider } from '@apollo/client';
import { client } from './config/apollo';
import { Provider } from 'react-redux';
import store from './middleware/redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
  </Provider>
  // </React.StrictMode>
);
