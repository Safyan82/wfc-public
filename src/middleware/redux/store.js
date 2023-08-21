import { configureStore } from '@reduxjs/toolkit';
import createFieldReducer from './reducers/createField.reducer';
import notificationReducer from './reducers/notification.reducer';
import groupReducer from './reducers/group.reducer';
import propertiesReducer from './reducers/properties.reducer';
import archivePropertyReducer from './reducers/archiveProperty.reducer';
import editPropertyReducer from './reducers/editProperty.reducer';
import branchReducer from './reducers/branch.reducer';
import quickFilterReducer from './reducers/quickFilter';

const store = configureStore({
  reducer: {
    createFieldReducer: createFieldReducer,
    notificationReducer: notificationReducer,
    groupReducer: groupReducer,
    propertyReducer: propertiesReducer,
    archiveReducer: archivePropertyReducer,
    editPropertyReducer: editPropertyReducer,
    branchReducer: branchReducer,
    quickFilterReducer: quickFilterReducer
  },
});

export default store;
