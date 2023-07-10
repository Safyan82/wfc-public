import { configureStore } from '@reduxjs/toolkit';
import createFieldReducer from './reducers/createField.reducer';
import notificationReducer from './reducers/notification.reducer';
import groupReducer from './reducers/group.reducer';
import propertiesReducer from './reducers/properties.reducer';

const store = configureStore({
  reducer: {
    createFieldReducer: createFieldReducer,
    notificationReducer: notificationReducer,
    groupReducer: groupReducer,
    propertyReducer: propertiesReducer,
  },
});

export default store;
