//#region import libs
import axios from 'axios';
import { constants } from '../сonstants';
//#endregion

function getReportList(token, filterStatus, offset = 0, userId = 0, filter = null, sort = null) {
  // let params = {
  //   limit: 20,
  //   offset: offset,
  // };

  // if (userId) {
  //   //params['filter[user_id]'] = [userId];
  // }
  // if (filterStatus) {
  //   if (filterStatus === 'favorites') {
  //     params['filter[is_favorite]'] = true;
  //   } else {
  //     params['status'] = filterStatus;
  //   }
  // }

  // for (const property in filter) {
  //   if (filter[property]) {
  //     if (
  //       [
  //         'user_id',
  //         'car_type_id',
  //         'car_brand_id',
  //         'car_model_id',
  //         'car_generation_id',
  //         'model_year_id',
  //         'body_type_id',
  //         'engine_type_id',
  //         'drive_unit_id',
  //         'gearbox_type_id',
  //         'color_id',
  //       ].includes(property)
  //     ) {
  //       params[`filter[${property}]`] = filter[property].forSend;
  //     }
  //     if (property.includes('__low')) {
  //       if (!property.includes('price')) {
  //         params[`filter[${property.split('__')[0]}]`] = [
  //           filter[property],
  //           filter[`${property.split('__')[0]}__high`],
  //         ];
  //       } else {
  //         if (filter.for_sale) {
  //           params[`filter[${property.split('__')[0]}]`] = [
  //             filter[property],
  //             filter[`${property.split('__')[0]}__high`],
  //           ];
  //         }
  //       }
  //     }
  //     if (['vin', 'state_number', 'owner_count'].includes(property)) {
  //       params[`filter[${property}]`] = filter[property];
  //     }
  //     if (['new_car', 'emergency', 'not_on_go', 'for_sale'].includes(property)) {
  //       params[`filter[${property}]`] = filter[property];
  //     }
  //   }
  // }
  let params = {}

  let dataFilter = {
    ...filter,
    limit: 20,
    offset: offset,
  };
  if (userId) {
    //TODO: fix that
    dataFilter.user_id = [userId];
  }

  if (filterStatus) {
    if (filterStatus === 'favorites') {
      dataFilter['is_favorite'] = 1;
      //params['filter[is_favorite]'] = true;
    } else {
      params['status'] = filterStatus;
    }
  }
  if (sort) {
    params[`order_by`] = sort.forSend[0];
  }

  params.filter = JSON.stringify(dataFilter);

  console.log('#P1', params, typeof params.filter);
  let axiosOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    params: {},
  };
  return axios.get(constants.env.reportList, {
    ...axiosOptions,
    params: params,
  });
  // return axios.get(constants.env.reportList,  {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${token}`,
  //   },
  //   params: params,
  // });
}

function deleteReport(token, id) {
  return axios.delete(constants.env.reports, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    params: {
      id: id,
    },
  });
}

function addToFavorites(token, id) {
  return axios.post(
    `${constants.env.reportFavorites}/${id}`,
    {
      report_id: id,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

function deleteFromFavorites(token, id) {
  return axios.delete(`${constants.env.reportFavorites}/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

export default {
  getReportList,
  deleteReport,
  addToFavorites,
  deleteFromFavorites,
};
