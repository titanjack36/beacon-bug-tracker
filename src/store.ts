import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './features';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false}))
});

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./features', () => store.replaceReducer(rootReducer));
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;