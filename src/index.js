import 'dragula/dist/dragula.css';
import 'react-resizable/css/styles.css';
import 'react-phone-input-2/lib/style.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloProvider } from '@apollo/client';
import { client, publicClient } from './config/apollo';
import { Provider } from 'react-redux';
import store from './middleware/redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
