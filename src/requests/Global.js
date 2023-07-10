//#region import libs
import axios from 'axios';
import { constants } from '../сonstants';
import md5 from 'md5';
import { Platform } from 'react-native';
import moment from 'moment';
//#endregion

function getFields(reportTypeId, sectionId, token, tab) {
  console.log(reportTypeId, sectionId);
  let params = {
    report_type_id: reportTypeId,
    section_id: sectionId,
  };
  if (tab) {
    params.tab = tab;
  }
  return axios.request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    url: constants.env.reportFields,
    params: params,
  });
}

function createReportApi(token, reportType) {
  console.log('#V1', reportType);
  return axios.post(
    constants.env.reports,
    {
      report_type_id: reportType,
    },

    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

function sendReportData(data, token) {
  return axios.request({
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    url: constants.env.reports,
    data: data,
  });
}

async function sendFiles(filePath, fileName, type, fieldId, reportId, token, column_name = null) {
  let bodyFormData = new FormData();
  bodyFormData.append('file', {
    uri: filePath,
    type: type,
    name: fileName,
  });
  bodyFormData.append('report_id', reportId);
  bodyFormData.append('field_id', fieldId);
  bodyFormData.append('column_name', column_name);

  //console.log('#3', bodyFormData);
  //let result = 0;
  let result = await axios.request({
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
    url: constants.env.fileSend,
    data: bodyFormData,
  });
  return result;
}

async function delFiles(id, token) {
  let result = await axios.request({
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    url: constants.env.fileRemove,
    data: {
      id: id,
    },
  });
  return result;
}

async function getSavedReport(token, reportId, sectionId, tab) {
  let tempData = {};
  if (tab) {
    tempData = {
      section_id: sectionId,
      report_id: reportId,
      tab: tab,
    };
  } else {
    tempData = {
      section_id: sectionId,
      report_id: reportId,
    };
  }
  let result = await axios.request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    url: constants.env.reports,
    params: tempData,
  });
  return result;
}

function getAddreess(lat, lang) {
  return axios.request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    url: constants.env.geocoderGet,
    params: {
      latlng: `${lat}, ${lang}`,
      key: constants.googleApiKey,
      language: 'RU',
    },
  });
}

function getReportType(token) {
  return axios.request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    url: constants.env.reportTypeList,
  });
}

function getUnfilledSections(token, id) {
  console.log('get unfilled axios');
  return axios.request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    url: constants.env.unfilledFieldsGet + id,
  });
}

function sendLog(screen, error) {
  let context = JSON.stringify({
    platform: Platform.OS,
    screen: screen,
    error: error,
  });
  let password = 'iZ5gDwaMqKE3pxDz38BS4@pd3';
  let time = new Date().getTime().toString();
  let token = md5(`${time}:${context}:${password}`);
  axios.post(constants.env.errorlog, {
    context: context,
    timestamp: time,
    token: token,
  });
}

function getFieldsRanges(token) {
  return axios.request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    url: constants.env.fieldsRanges,
  });
}

export default {
  getFields,
  createReportApi,
  sendReportData,
  sendFiles,
  delFiles,
  getSavedReport,
  getAddreess,
  getReportType,
  getUnfilledSections,
  sendLog,
  getFieldsRanges,
};
