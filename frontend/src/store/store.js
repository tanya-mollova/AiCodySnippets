import { configureStore } from '@reduxjs/toolkit';
import snippetsReducer from './slices/snippetsSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    snippets: snippetsReducer,
    auth: authReducer,
  },
});

export default store;
