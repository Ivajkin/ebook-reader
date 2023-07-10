//#region import libs
import axios from 'axios';
import { constants } from '../сonstants';
//#endregion

function registerUser(
  name,
  phone,
  password,
  confirmPassword,
  role = '',
  dealerName = '',
  companyName = '',
  workAlone = 0
) {
  const data = {
    name: name.toString(),
    phone: phone.toString(),
    password: password.toString(),
    password_confirmation: confirmPassword.toString(),
    role: role,
    work_alone: workAlone,
    //companyName: companyName,
  };
  if (!workAlone && dealerName) {
    data.dealerName = dealerName;
  }
  if (companyName) {
    data.company_name = companyName;
  }
  return axios.request({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    url: constants.env.register,
    data,
  });
}

function getRoles() {
  return axios.request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    url: constants.env.getRoles,
  });
}

function loginUser(phone, password) {
  return axios.request({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    url: constants.env.login,
    data: {
      phone: phone.toString(),
      password: password.toString(),
    },
  });
}

function logout(token) {
  return axios.request({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    url: constants.env.logout,
  });
}

function getCode(phone) {
  return axios.request({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    url: constants.env.forgotPassword,
    data: {
      phone: phone,
    },
  });
}

function validateCode(phone, code) {
  return axios.request({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    url: constants.env.checkCode,
    data: {
      phone: phone,
      code,
    },
  });
}

function setNewPass(phone, code, password, confPassword) {
  return axios.request({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    url: constants.env.resetPassword,
    data: {
      phone: phone,
      code,
      password: password,
      password_confirmation: confPassword,
    },
  });
}

function getUserInfo(token = '') {
  return axios.request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    url: constants.env.userInfo,
  });
}

function getOldPassword(token = '') {
  return axios.request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    url: constants.env.resetPassword,
  });
}

export default {
  registerUser,
  loginUser,
  logout,
  getCode,
  validateCode,
  setNewPass,
  getUserInfo,
  getOldPassword,
  getRoles,
};
