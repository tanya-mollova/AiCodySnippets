import { configureStore } from '@reduxjs/toolkit';
import snippetsReducer from './slices/snippetsSlice';

export const store = configureStore({
  reducer: {
    snippets: snippetsReducer,
  },
});

export default store;
