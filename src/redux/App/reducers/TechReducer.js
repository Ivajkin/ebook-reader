import { createReducer } from '@reduxjs/toolkit';

import {
  setBodyType,
  setCarBrandId,
  setCarGeneration,
  setCarModelId,
  setCarType,
  setColor,
  setComment,
  setDriveUnit,
  setEmergency,
  setEngineType,
  setEngineVolume,
  setForSale,
  setGearboxType,
  setMileage,
  setModelYear,
  setNewCar,
  setNotOnGo,
  setPower,
  setPrice,
  setStateNumber,
  setStateNumberNotStandard,
  setVin,
  setVinNotStandard,
} from '../actions/techActions';
const emptyReport = {
  report_id: null,
  //section_id: section.id,
  vin: '',
  vin_not_standard: false,
  state_number: null,
  state_number_not_standard: false,
  car_type: { forSend: [], forInput: [] },
  car_brand_id: null,
  car_model_id: null,
  model_year: {
    forSend: [],
    forInput: [],
  },
  body_type: { forSend: [], forInput: [] },
  car_generation: {
    forSend: [],
    forInput: [],
  },
  engine_type: {
    forSend: [],
    forInput: [],
  },
  drive_unit: { forSend: [], forInput: [] },
  gearbox_type: { forSend: [], forInput: [] },
  engine_volume: null,
  power: null,
  color: { forSend: [], forInput: [] },
  mileage: null,
  price: '',
  new_car: false,
  emergency: false,
  not_on_go: false,
  for_sale: false,
  comment: null,
};
const initialState = {
  reports: [],
};

export const techCharsReducer = createReducer(initialState, builder => {
  builder.addCase(setBodyType, (state, action) => {
    const reportId = action.payload.reportId;
    const fieldName = action.payload.fieldName;
    const value = action.payload.value;
    let thisReportIndex = state.reports.findIndex(rep => rep.reportId === reportId);
    if (thisReportIndex === -1) {
      let newReport = { ...emptyReport, [fieldName]: value, reportId: reportId };
      state.reports = [...state.reports, newReport];
    } else {
      state.reports[thisReportIndex][fieldName] = value;
    }
  });
});
