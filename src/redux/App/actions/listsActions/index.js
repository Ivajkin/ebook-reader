import { createAction } from '@reduxjs/toolkit';
import { SET_BRANDS_LIST, SET_POPULAR_BRANDS_LIST, SET_TIRES_BRANDS_LIST } from '../../constants';

export const setBrandsList = createAction(SET_BRANDS_LIST);
export const setTiresBrandsList = createAction(SET_TIRES_BRANDS_LIST);

export const setPopularBrandsList = createAction(SET_POPULAR_BRANDS_LIST);
