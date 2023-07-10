//#region import libs
import axios from 'axios';
import { constants } from '../сonstants';
//#endregion

function getBrands(token) {
  return axios.get(constants.env.tiresBrands, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

function getModels(brandId, token) {
  return axios.get(constants.env.tiresModels, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    params: {
      tyre_brand_id: brandId,
    },
  });
}

export default {
  getBrands,
  getModels,
};
