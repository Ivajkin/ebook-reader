import { createReducer } from '@reduxjs/toolkit';
import { setBrandsList, setPopularBrandsList, setTiresBrandsList } from '../actions/listsActions';

const initialState = {
  brandsList: [],
  tiresBrandsList: [],
  popularBrandsList: [],
};
export const listsReducer = createReducer(initialState, builder => {
  builder
    .addCase(setBrandsList, (state, action) => {
      state.brandsList = action.payload;
    })
    .addCase(setTiresBrandsList, (state, action) => {
      state.tiresBrandsList = action.payload;
    })
    .addCase(setPopularBrandsList, (state, action) => {
      state.popularBrandsList = action.payload;
    });
});
