import { createAction } from '@reduxjs/toolkit';
import { ADD_TO_FAVORITES, DELETE_REPORT, REMOVE_FROM_FAVORITES, SET_REPORTS_LIST } from "../../constants";

export const setReports = createAction(SET_REPORTS_LIST);

export const deleteReport = createAction(DELETE_REPORT)
export const addToFavorites = createAction(ADD_TO_FAVORITES);

export const removeFromFavorites = createAction(REMOVE_FROM_FAVORITES);
