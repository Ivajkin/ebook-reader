import { createReducer } from '@reduxjs/toolkit';
import {
  addToFavorites,
  deleteReport,
  removeFromFavorites,
  setReports,
} from '../actions/reportsActions';

const initialState = {
  reports: [],
};

export const reportsReducer = createReducer(initialState, builder => {
  builder
    .addCase(setReports, (state, action) => {
      state.reports = action.payload;
    })
    .addCase(addToFavorites, (state, action) => {
      let newReports = state.reports.map(report => {
        if (report.generalReportData.id === action.payload) {
          let newReport = Object.assign({}, report);
          newReport.generalReportData.is_favorite = true;
          return newReport;
        } else {
          return report;
        }
      });
      console.log('add to favs', action.payload);
    })
    .addCase(removeFromFavorites, (state, action) => {
      let newReports = state.reports.map(report => {
        if (report.generalReportData.id === action.payload) {
          let newReport = Object.assign({}, report);
          newReport.generalReportData.is_favorite = false;
          return newReport;
        } else {
          return report;
        }
      });

      console.log('remove from favs', action.payload, newReports);
      state.reports = newReports;
    })
    .addCase(deleteReport, (state, action) => {
      console.log('delete', action.payload);
      state.reports = state.reports.filter(report => report.generalReportData.id !== action.payload);
    });
});
