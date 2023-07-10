import {
  LOGIN_TOKEN,
  CREATED_REPORT_ID,
  OPEN_SCREEN,
  IS_MENU_OPEN,
  REPORT_TYPE,
  SECTION_LIST,
  REPORT_END_MODAL,
  USER_INFO,
  UNFILLED_FIELDS,
} from '../constants';

/**
 * Initial varriables
 */

const initialState = {
  reportId: null,
  loginToken: null,
  openScreen: {
    TechnicalCharacteristics: 0,
    EquipmentScreen: 0,

    Equipment_overview: 0,
    Equipment_exterior: 0,
    Equipment_anti_theft_protection: 0,
    Equipment_multimedia: 0,
    Equipment_salon: 0,
    Equipment_comfort: 0,
    Equipment_safety: 0,
    Equipment_other: 0,

    DocumentsScreen: 0,
    MarkingsScreen: 0,
    CompletenessScreen: 0,
    TiresScreen: 0,
    FotoExteriorScreen: 0,
    FotoInteriorScreen: 0,
    CheckingLKPScreen: 0,
    DamageScreen: 0,

    Damage_right_side: 0,
    Damage_front_side: 0,
    Damage_left_side: 0,
    Damage_rear_side: 0,
    Damage_roof_side: 0,
    Damage_window_side: 0,
    Damage_rims_side: 0,
    Damage_interior_side: 0,

    TechCheckScreen: 0,

    TechCheck_engine_off: 0,
    TechCheck_engine_on: 0,
    TechCheck_test_drive: 0,
    TechCheck_elevator: 0,

    LocationScreen: 0,
    SignatureScreen: 0,
  },
  isMenuOpen: false,
  reportType: 1,
  sectionList: {},
  reportEndModalFlag: 'inProgress',
  userInfo: {},
  unfilledFields: {},
};
function AppReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_TOKEN:
      return {
        ...state,
        loginToken: action.payload,
      };
    case CREATED_REPORT_ID:
      return {
        ...state,
        reportId: action.payload,
      };
    case OPEN_SCREEN:
      if (typeof action.payload.screen === 'object') {
        return {
          ...state,
          openScreen: { ...state.openScreen, ...action.payload.screen },
        };
      } else {
        return {
          ...state,
          openScreen: { ...state.openScreen, [action.payload.screen]: action.payload.status },
        };
      }
    case IS_MENU_OPEN:
      return {
        ...state,
        isMenuOpen: action.payload,
      };
    case REPORT_TYPE:
      return {
        ...state,
        reportType: action.payload,
      };
    case SECTION_LIST:
      return {
        ...state,
        sectionList: action.payload,
      };
    case REPORT_END_MODAL:
      return {
        ...state,
        reportEndModalFlag: action.payload,
      };
    case USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      };
    case UNFILLED_FIELDS:
      return {
        ...state,
        unfilledFields: action.payload,
      };
    default:
      return state;
  }
}

export default AppReducer;
