import {
  CREATED_REPORT_ID,
  OPEN_SCREEN,
  IS_MENU_OPEN,
  REPORT_TYPE,
  SECTION_LIST,
  REPORT_END_MODAL,
  USER_INFO,
  UNFILLED_FIELDS,
} from '../../constants';

/**
 * function for save tokens
 */

export function setReportId(id) {
  return {
    type: CREATED_REPORT_ID,
    payload: id,
  };
}

export function setOpenScreen(screen, status) {
  return {
    type: OPEN_SCREEN,
    payload: { screen: screen, status: status },
  };
}

export function setMenuFlag(status) {
  return {
    type: IS_MENU_OPEN,
    payload: status,
  };
}

export function setReportType(id) {
  return {
    type: REPORT_TYPE,
    payload: id,
  };
}

export function setSectionList(obj) {
  return {
    type: SECTION_LIST,
    payload: obj,
  };
}

export function setReportEndModalFlag(status) {
  return {
    type: REPORT_END_MODAL,
    payload: status,
  };
}

export function setUserInfo(userInfo) {
  return {
    type: USER_INFO,
    payload: userInfo,
  };
}

export function setUnfilledFields(fields) {
  console.log('SET UNFILLED 883');
  return {
    type: UNFILLED_FIELDS,
    payload: fields,
  };
}
