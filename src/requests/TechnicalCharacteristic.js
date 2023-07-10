//#region import libs
import axios from 'axios';
import { constants } from '../сonstants';
//#endregion

function getBrandsListApi(token, popularFlag = false) {
  return axios.request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    params: popularFlag
      ? {
          popular: 1,
        }
      : {},
    url: constants.env.carBrands,
  });
}

function getBrandsByIdsListApi(token, brands) {
  return axios.request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    params: { brands },
    url: constants.env.carBrands,
  });
}

function getModelsListApi(brand, token) {
  return axios.request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    url: constants.env.carModels + brand,
  });
}

function getGenerationListApi(model, token) {
  return axios.request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    url: constants.env.carGeneration + model,
    params: {
      model_id: model,
    },
  });
}

function getGenerationsByModelsListApi(models, token) {
  return axios.request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    params: { models },
    url: constants.env.carGeneration,
  });
}

function getUsersListApi(token) {
  return axios.request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    url: constants.env.users,
  });
}

export default {
  getBrandsListApi,
  getBrandsByIdsListApi,
  getModelsListApi,
  getGenerationListApi,
  getGenerationsByModelsListApi,
  getUsersListApi,
};
