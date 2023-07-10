import { createAction } from '@reduxjs/toolkit';
import {
  ADD_CHOSEN_CITY,
  ADD_CHOSEN_REGION,
  ADD_CITY_TO_REGIONS_SHOWN,
  ADD_REGION_TO_REGIONS_SHOWN,
  CLEAR_CHOSEN,
  CLEAR_REGIONS_SHOWN,
  DELETE_CHOSEN_CITY,
  DELETE_CHOSEN_REGION,
  INIT_REGIONS,
  SET_REGIONS_SHOWN_TO_NO_SEARCH_MODE,
  SET_REGION_CITIES,
  SET_REGION_COLLAPSED,
} from '../../constants';
export const initRegions = createAction(INIT_REGIONS);
export const setRegionCities = createAction(SET_REGION_CITIES);
export const setRegionCollapsed = createAction(SET_REGION_COLLAPSED);
export const addChosenRegion = createAction(ADD_CHOSEN_REGION);
export const deleteChosenRegion = createAction(DELETE_CHOSEN_REGION);
export const addChosenCity = createAction(ADD_CHOSEN_CITY);
export const deleteChosenCity = createAction(DELETE_CHOSEN_CITY);
export const clearChosen = createAction(CLEAR_CHOSEN);
export const addCityToRegionsShown = createAction(ADD_CITY_TO_REGIONS_SHOWN);
export const clearRegionsShown = createAction(CLEAR_REGIONS_SHOWN);
export const setRegionsShownToNoSearchMode = createAction(SET_REGIONS_SHOWN_TO_NO_SEARCH_MODE);
export const addRegionToRegionsShown = createAction(ADD_REGION_TO_REGIONS_SHOWN);
