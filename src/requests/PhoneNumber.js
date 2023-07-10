//#region import libs
import axios from 'axios';
import { constants } from '../сonstants';
//#endregion

function getCountryList() {
  return axios.request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    url: constants.env.phoneCodes,
  });
}

export default {
  getCountryList,
};
