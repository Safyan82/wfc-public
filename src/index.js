import 'dragula/dist/dragula.css';
import 'react-resizable/css/styles.css';
import 'react-phone-input-2/lib/style.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloProvider } from '@apollo/client';
import { client, publicClient } from './config/apollo';
import { Provider } from 'react-redux';
import store, { persistor } from './middleware/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://f0bf588f36c481a5017e0c9098124c08@o4506751068078080.ingest.sentry.io/4506751071944704",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  // </React.StrictMode>
);
