import { configureStore } from '@reduxjs/toolkit';
import createFieldReducer from './reducers/createField.reducer';
import notificationReducer from './reducers/notification.reducer';

const store = configureStore({
  reducer: {
    createFieldReducer: createFieldReducer,
    notificationReducer: notificationReducer
  },
});

export default store;
