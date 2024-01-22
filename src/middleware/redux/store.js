import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createFieldReducer from './reducers/createField.reducer';
import notificationReducer from './reducers/notification.reducer';
import groupReducer from './reducers/group.reducer';
import propertiesReducer from './reducers/properties.reducer';
import archivePropertyReducer from './reducers/archiveProperty.reducer';
import editPropertyReducer from './reducers/editProperty.reducer';
import branchReducer from './reducers/branch.reducer';
import quickFilterReducer from './reducers/quickFilter';
import branchViewReducer from './reducers/branchView.reducer';
import resetReducer from './reducers/reset.reducer';
import noteReducer from './reducers/note.reducer';
import branchDataReducer from './reducers/branchData.reducer';
import permissionReducer from './reducers/permission.reducer';
import moduleCustomPermissionReducer from './reducers/moduleCustomPermission.reducer';
import userReducer from './reducers/user.reducer';
import editUserReducer from './reducers/editUser.reducer';
import userAuthReducer from './reducers/userAuth.reducer';
import userRoleReducer from './reducers/userRole.reducer';

import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { rootReducer } from './rootReducer';



const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});



export const persistor = persistStore(store);


// const store = configureStore({
//   reducer: {
//     createFieldReducer: createFieldReducer,
//     notificationReducer: notificationReducer,
//     groupReducer: groupReducer,
//     propertyReducer: propertiesReducer,
//     archiveReducer: archivePropertyReducer,
//     editPropertyReducer: editPropertyReducer,
//     branchReducer: branchReducer,
//     quickFilterReducer: quickFilterReducer,
//     branchViewReducer: branchViewReducer,
//     reset: resetReducer,
//     noteReducer: noteReducer,
//     branchDataReducer: branchDataReducer,
//     permissionReducer: permissionReducer, 
//     moduleCustomPermissionReducer: moduleCustomPermissionReducer,
//     userDetailReducer: userReducer,
//     editUserReducer: editUserReducer,
//     // this reducer is dedicated for user auth detail only
//     userAuthReducer: userAuthReducer,
//     // this reducer is to handel the edit part of the pre defined user roles in setting
//     userRoleReducer: userRoleReducer
//   },
//   middleware:[...getDefaultMiddleware()]
// });

export default store;
