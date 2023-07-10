const loader = require('./loader.json');

const domain = 'https://autopodbor.gensol.ru/api/';

const domainRoot = 'https://autopodbor.gensol.ru';

// const googleApiKey = 'AIzaSyBe5-y_STY9xRhHy3zxigkXr8xAHHdWCVA';
// const googleApiKey = 'AIzaSyBOdm9oDt_2ynLVgrC_V6kf_y_fXbGJch0';
const googleApiKey = 'AIzaSyBe5-y_STY9xRhHy3zxigkXr8xAHHdWCVA';

const env = {
  domain: domain,
  reportFields: domain + 'fields/',
  cars: domain + 'cars/',
  reportFieldsGrouped: domain + 'fields-grouped-by-section/',
  reports: domain + 'reports',
  reportFavorites: domain + 'report-favorites',
  register: domain + 'register',
  login: domain + 'login',
  logout: domain + 'logout',
  forgotPassword: domain + 'forgot_password',
  checkCode: domain + 'check_code',
  resetPassword: domain + 'reset_password',
  userInfo: domain + 'user-info',
  users: domain + 'users',
  profile: domain + 'profile',
  phone: domain + 'profile/phone',
  password: domain + 'profile/password',
  profilePhoto: domain + 'profile/photo',
  phoneCodes: domain + 'phone_codes',
  carBrands: domain + 'cars/brands',
  carModels: domain + 'cars/models/',
  carGeneration: domain + 'cars/models/generations/',
  tiresBrands: domain + 'tyres/brands',
  tiresModels: domain + 'tyres/models',
  fileSend: domain + 'files/upload',
  fileFetch: domain + 'files/fetch',
  fileRemove: domain + 'files/remove',
  reportList: domain + 'reports/list',
  reportTypeList: domain + 'report_types',
  fieldsRanges: domain + 'search-field-ranges',
  geocoderGet: 'https://maps.googleapis.com/maps/api/geocode/json',
  unfilledFieldsGet: domain + 'reports/unfilled_in_report/',
  reportViewBrowser: domainRoot + '/reports/actions/view/',
  errorlog: domain + 'app-logs',
  getRoles: domain + 'roles',
};

const sectionOrderList = {
  specifications: 'TechnicalCharacteristics',
  equipment: 'EquipmentScreen',
  documents: 'DocumentsScreen',
  markings: 'MarkingsScreen',
  completeness: 'CompletenessScreen',
  tires: 'TiresScreen',
  exterior_photos: 'FotoExteriorScreen',
  interior_photos: 'FotoInteriorScreen',
  checking_paintwork: 'CheckingLKPScreen',
  damaged_parts: 'DamageScreen',
  technical_check_of_auto: 'TechCheckScreen',
  location: 'LocationScreen',
  advantages_and_disadvantages: 'AdvantagesAndDisadvantagesScreen',
  signature: 'SignatureScreen',
};

const fields = {
  specifications: [
    'vin',
    'vin_not_standard',
    'state_number',
    'state_number_not_standard',
    'car_type',
    'car_brand_id',
    'car_model_id',
    'car_generation',
    'model_year',
    'body_type',
    'engine_type',
    'drive_unit',
    'gearbox_type',
    'engine_volume',
    'power',
    'color',
    'mileage',
    'new_car',
    'emergency',
    'not_on_go',
    'for_sale',
    'price',
    'comment',
  ],
  documents: ['pts', 'sts', 'service_book_missing', 'additional_documents', 'owner_count'],
};

const imgCompress = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 40,
  compressFormat: 'JPEG',
};

const errorMessage = {
  photoAdd: 'Ошибка загрузки фото, пожалуйста, попробуйте еще раз',
  photoDel: 'Ошибка удаления фото, пожалуйста, попробуйте еще раз',
  fileAdd: 'Ошибка загрузки файла, пожалуйста, попробуйте еще раз',
  fileDel: 'Ошибка удаления файла, пожалуйста, попробуйте еще раз',
  getReportList: 'Ошибка получения списка отчетов!',
};

export default {
  googleApiKey,
  loader,
  env,
  sectionOrderList,
  fields,
  errorMessage,
  imgCompress,
};
