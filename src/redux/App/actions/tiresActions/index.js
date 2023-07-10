import { createAction } from '@reduxjs/toolkit';
import {
  ADD_TIRE,
  CLEAR_TIRES,
  INIT_TIRES,
  TURN_ON_MODE_ALL,
  TURN_ON_MODE_HALF,
  TURN_ON_MODE_NONE,
} from '../../constants';

export const initTires = createAction(INIT_TIRES);
export const addTire = createAction(ADD_TIRE);
export const turnOnModeHalf = createAction(TURN_ON_MODE_HALF);
export const turnOnModeAll = createAction(TURN_ON_MODE_ALL);
export const turnOnModeNone = createAction(TURN_ON_MODE_NONE);
export const clearTires = createAction(CLEAR_TIRES);
