import { configureStore } from '@reduxjs/toolkit';
import createFieldReducer from './reducers/createField.reducer';

const store = configureStore({
  reducer: {
    createFieldReducer: createFieldReducer,
  },
});

export default store;
