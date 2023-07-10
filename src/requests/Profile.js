import axios from 'axios';
import { constants } from '../сonstants';

function postUpdateProfile(token, name, role, dealerName, companyName, works_alone) {
  var data = {
    name,
    role,
  };
  if (dealerName) {
    data.dealer_name = dealerName;
  }
  if (companyName) {
    data.company_name = companyName;
  }
  if (works_alone) {
    data.works_alone = works_alone;
  }
  return axios.request({
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    data: data,
    url: constants.env.profile,
  });
}

function putEditPhone(token, phone, password, confirmPassword) {
  return axios.request({
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    data: {
      phone,
      password,
      password_confirmation: confirmPassword,
    },
    url: constants.env.phone,
  });
}

function putEditPassword(token, oldPassword, newPassword, confirmPassword) {
  return axios.request({
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    data: {
      current_password: oldPassword,
      password: newPassword,
      password_confirmation: confirmPassword,
    },
    url: constants.env.password,
  });
}

export { postUpdateProfile, putEditPhone, putEditPassword };
