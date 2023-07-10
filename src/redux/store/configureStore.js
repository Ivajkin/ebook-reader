import AppReducer from '../App/reducers/AppReducer';
import { setupListeners } from '@reduxjs/toolkit/query';
import { configureStore } from '@reduxjs/toolkit';
import { regionsAndCitiesApi } from '../../services/regionsAndCities';
import { regionAndCityReducer } from '../App/reducers/RegionAndCityReducer';
import { tiresReducer } from '../App/reducers/TiresReducer';
import { listsReducer } from '../App/reducers/listsReducer';
import { reportsReducer } from '../App/reducers/reportsReducer';

const configuredStore = configureStore({
  reducer: {
    appGlobal: AppReducer,
    [regionsAndCitiesApi.reducerPath]: regionsAndCitiesApi.reducer,
    regions: regionAndCityReducer,
    tires: tiresReducer,
    lists: listsReducer,
    reports: reportsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }).concat(regionsAndCitiesApi.middleware),
});

export default configuredStore;
setupListeners(configuredStore.dispatch);
