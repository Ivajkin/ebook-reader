//#region react
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
//#endregion -----------

//#region plagins
import { connect, useDispatch } from 'react-redux';
import AnimatedLoader from 'react-native-animated-loader';
//#endregion -----------

//#region components
import { setOpenScreen } from '../../redux/App/actions/mainActions';
import { HeaderBar, ProgressMenu } from '../../components/menu';
import { ModalChoose, ModalChooseClear, ModalClose } from '../../components/modal';
import { FieldModal, FieldInput, FieldCheckSwitch } from '../../components/fields';
import { constants, loader, icons, theme, COLORS } from '../../сonstants';
import { global, technicalCharacteristic } from '../../requests';
import VinField from './components/vinField';
import { globalFunctions } from '../../utils';
import validateFields from '../../utils/validateRequired';
//#endregion -----------

//#region styles
import { styles } from './styles';
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setBrandsList, setPopularBrandsList } from '../../redux/App/actions/listsActions';
//#endregion -----------

const TechnicalCharacteristics = ({
  route,
  navigation,
  sectionList,
  reportTypeId,
  token,
  reportId,
  menusState,
  setNewBrandsList,
  setNewPopularList,
}) => {
  //#region valuevles
  const netInfo = useNetInfo();

  const section = sectionList.specifications;

  const [fieldArray, setFieldArray] = useState(null);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [modalExitVisible, setModalExitVisible] = useState(false);
  const dispatch = useDispatch();

  //const unfilledFields = route.params?.unfilledFields ?? [];
  const goToUnfilled = route.params?.goToUnfilled ?? null;

  const nextSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'specifications',
    'next'
  );

  /**
   * vin constants
   */
  const [validateVinFlag, changeValidateVinFlag] = useState(true);
  const [vinValue, setVinValue] = useState('');
  const [vinNonStandart, setVinNonStandart] = useState(false);

  /**
   * plate number constants
   */
  const [validatePlateFlag, changeValidatePlateFlag] = useState(true);
  const [plateValue, setPlateValue] = useState(null);
  const [plateNonStandart, setPlateNonStandart] = useState(false);

  /**
   * type constants && functions
   */
  const [carType, changeCarType] = useState({ forSend: [], forInput: [] });
  const [carTypeModalOpen, setcarTypeModalOpen] = useState(false);
  const [validateTypeFlag, changeValidateTypeFlag] = useState(true);
  const [radioButtonsTypeData, setRadioButtonsTypeData] = useState([]);
  const carTypeRadioStyles = {
    borderWidth: 2,
    borderWidthActive: 7,
    borderColor: COLORS.lightGray,
    borderColorActive: COLORS.red,
    containerStyle: { width: '100%', paddingTop: 10, paddingBottom: 10 },
  };

  /**
   * const && functions for model
   */
  const [modalOpenCarModel, setModalOpenCarModel] = useState(false);
  const [chooseCarModel, setChooseCarModel] = useState(null);
  const [chooseCarModelId, setChooseCarModelId] = useState(null);
  const [chosenModels, setChosenModels] = useState({ forSend: [], forInput: [] });
  const [validateModelFlag, changeValidateModelFlag] = useState(true);
  const [radioButtonsModelData, setRadioButtonsModelData] = useState([]);
  const [modelListRaw, setModelListRaw] = useState([]);
  const [modelOpenErrors, setModelOpenErrors] = useState([]);

  /**
   * constants for car brand
   */
  const [carBrandsChosen, setCarBrandsChosen] = useState({ forSend: [], forInput: [] });
  const [carBrand, setCarBrand] = useState(null);
  const [carIdBrand, changeCarBrandId] = useState(null);
  //const [carBrandsList, setCarBrandsList] = useState(null);
  const [validateBrandFlag, changeValidateBrandFlag] = useState(true);
  //const [carBrandPopularList, setCarBrandPopularList] = useState(null);
  const [generationOpenErrors, setGenerationsOpenErrors] = useState([]);

  /**
   * constants for car production
   */
  const [yearData, setYearData] = useState(null);
  const [carProduction, setCarProduction] = useState({
    forSend: [],
    forInput: [],
  });
  const [modalProductionOpen, setModalProductionOpen] = useState(false);
  const [radioButtonsProductionData, setRadioButtonsProductionData] = useState([]);
  const [validateYearFlag, changeValidateYearFlag] = useState(true);
  const [yearsOpenErrors, setYearsOpenErrors] = useState([]);

  /**
   * constants for car body type
   */
  const [carBodyType, setCarBodyType] = useState({ forSend: [], forInput: [] });
  const [modalBodyTypeOpen, setModalBodyTypeOpen] = useState(false);
  const [radioButtonsBodyTypeData, setRadioButtonsBodyTypeData] = useState([]);
  const [validateBodyFlag, changeValidateBodyFlag] = useState(true);

  /**
   * constants for car generaton
   */
  const [carGeneration, setCarGeneration] = useState({
    forSend: [],
    forInput: [],
  });
  const [modalGenerationOpen, setModalGenerationOpen] = useState(false);
  const [radioButtonsGenerationData, setRadioButtonsGenerationData] = useState([]);
  const [validateGenerationFlag, changeValidateGenerationFlag] = useState(true);
  const [generationListRaw, setGenerationListRaw] = useState([]);

  /**
   * constants for engine type
   */
  const [carEngineType, setCarEngineType] = useState({
    forSend: [],
    forInput: [],
  });
  const [modalCarEngineTypeOpen, setModalCarEngineTypeOpen] = useState(false);
  const [radioButtonsEngineTypeData, setRadioButtonsEngineTypeData] = useState([]);
  const [validateEngineTypeFlag, changeValidateEngineTypeFlag] = useState(true);

  /**
   * constants for drive unit
   */
  const [carUnitType, setCarUnitType] = useState({ forSend: [], forInput: [] });
  const [modalUnitTypeOpen, setModalUnitTypeOpen] = useState(false);
  const [radioButtonsUnitTypeData, setRadioButtonsUnitTypeData] = useState([]);
  const [validateUnitFlag, changeValidateUnitFlag] = useState(true);

  /**
   * constants for gear type
   */
  const [carGearType, setCarGearType] = useState({ forSend: [], forInput: [] });
  const [modalGearTypeOpen, setModalGearTypeOpen] = useState(false);
  const [radioButtonsGearTypeData, setRadioButtonsGearTypeData] = useState([]);
  const [validateGearFlag, changeValidateGearFlag] = useState(true);

  /**
   * constants for car color
   */
  const [carColor, setCarColor] = useState({ forSend: [], forInput: [] });
  const [modalCarColor, setModalCarColor] = useState(false);
  const [radioButtonsCarColorData, setRadioButtonsCarColorData] = useState([]);
  const [validateColorFlag, changeValidateColorFlag] = useState(true);

  /**
   * constants for engine volume
   */
  const [carEngineVolume, setCarEngineVolume] = useState(null);
  const [carEngineFieldActive, setCarEngineFieldActive] = useState(false);
  const [validateEngineVolumeFlag, changeValidateEngineVolumeFlag] = useState(true);

  /**
   * constants for engine power
   */
  const [carEnginePower, setCarEnginePower] = useState(null);
  const [carEngineFieldPowerActive, setCarEngineFieldPowerActive] = useState(false);
  const [validateEnginePowerFlag, changeValidateEnginePowerFlag] = useState(true);

  /**
   * constants for car mileage
   */
  const [carMileage, setCarMileage] = useState(null);
  const [carMileageFieldActive, setCarMileageFieldActive] = useState(false);
  const [validateMileageFlag, changeValidateMileageFlag] = useState(true);

  /**
   * constants for car price
   */
  const [carPrice, setCarPrice] = useState('');
  const [carPriceFieldActive, setCarPriceFieldActive] = useState(false);
  const [validatePriceFlag, changeValidatePriceFlag] = useState(true);

  /**
   * constants for car params new
   */
  const [carNewFlag, setCarNewFlag] = useState(false);

  /**
   * constants for car params crash
   */
  const [carCrashFlag, setCarCrashFlag] = useState(false);

  /**
   * constants for car params not run
   */
  const [carNotRunFlag, setCarNotRunFlag] = useState(false);

  /**
   * constants for car params for sale
   */
  const [carForSaleFlag, serCarForSaleFlag] = useState(false);

  const [isFirstChangeBrand, setIsFirstChangeBrand] = useState(true);
  const [isFirstChangeModel, setIsFirstChangeModel] = useState(true);
  const [isFirstChangeGeneration, setIsFirstGeneration] = useState(true);

  useEffect(() => {
    if (fieldArray && fieldArray.price) {
      setFieldArray(data => {
        return {
          ...data,
          price: { ...data.price, required: carForSaleFlag ? 2 : 0 },
        };
      });
    }
  }, [carForSaleFlag]);

  /**
   * constants for comment
   */
  const [comments, setComments] = useState('');
  const [commentsActive, setCommentsActive] = useState(false);
  const [validateCommentFlag, changeValidateCommentFlag] = useState(true);

  /**
   * structre for save all constants
   */

  const allFieldsFlagSetters = {
    vin: changeValidateVinFlag,
    vin_not_standard: () => {},
    state_number: changeValidatePlateFlag,
    state_number_not_standard: () => {},
    car_type: changeValidateTypeFlag,
    car_brand_id: changeValidateBrandFlag,
    car_model_id: changeValidateModelFlag,
    model_year: changeValidateYearFlag,
    body_type: changeValidateBodyFlag,
    car_generation: changeValidateGenerationFlag,
    engine_type: changeValidateEngineTypeFlag,
    drive_unit: changeValidateUnitFlag,
    gearbox_type: changeValidateGearFlag,
    engine_volume: changeValidateEngineVolumeFlag,
    power: changeValidateEnginePowerFlag,
    color: changeValidateColorFlag,
    mileage: changeValidateMileageFlag,
    price: changeValidatePriceFlag,
    new_car: () => {},
    emergency: () => {},
    not_on_go: () => {},
    for_sale: () => {},
    comment: changeValidateCommentFlag,
  };

  const fieldsValues = {
    vin: vinValue,
    vin_not_standard: vinNonStandart,
    state_number: plateValue,
    state_number_not_standard: plateNonStandart,
    car_type: carType,
    car_brand_id: carBrandsChosen,
    car_model_id: chosenModels,
    model_year: carProduction,
    body_type: carBodyType,
    car_generation: carGeneration,
    engine_type: carEngineType,
    drive_unit: carUnitType,
    gearbox_type: carGearType,
    engine_volume: carEngineVolume,
    power: carEnginePower,
    color: carColor,
    mileage: carMileage,
    price: carPrice,
    new_car: carNewFlag,
    emergency: carCrashFlag,
    not_on_go: carNotRunFlag,
    for_sale: carForSaleFlag,
    comment: comments,
  };

  const fieldsStates = {
    vin: setVinValue,
    vin_not_standard: setVinNonStandart,
    state_number: setPlateValue,
    state_number_not_standard: setPlateNonStandart,
    car_type: changeCarType,
    car_brand_id: setCarBrandsChosen,
    car_model_id: [setChooseCarModelId, setChooseCarModel],
    model_year: setCarProduction,
    body_type: setCarBodyType,
    car_generation: setCarGeneration,
    engine_type: setCarEngineType,
    drive_unit: setCarUnitType,
    gearbox_type: setCarGearType,
    engine_volume: setCarEngineVolume,
    power: setCarEnginePower,
    color: setCarColor,
    mileage: setCarMileage,
    price: setCarPrice,
    new_car: setCarNewFlag,
    emergency: setCarCrashFlag,
    not_on_go: setCarNotRunFlag,
    for_sale: serCarForSaleFlag,
    comment: setComments,
  };

  /**
   * collect data for send
   */
  const dataForSend = {
    report_id: reportId,
    section_id: section.id,
    vin: vinValue,
    vin_not_standard: vinNonStandart,
    state_number: plateValue,
    state_number_not_standard: plateNonStandart,
    car_type: carType,
    car_brand_id: carIdBrand,
    car_model_id: chooseCarModelId,
    model_year: carProduction,
    body_type: carBodyType,
    car_generation: carGeneration,
    engine_type: carEngineType,
    drive_unit: carUnitType,
    gearbox_type: carGearType,
    engine_volume: parseInt(carEngineVolume) ? parseInt(carEngineVolume) : null,
    power: carEnginePower,
    color: carColor,
    mileage: carMileage,
    price: carPrice,
    new_car: carNewFlag,
    emergency: carCrashFlag,
    not_on_go: carNotRunFlag,
    for_sale: carForSaleFlag,
    comment: comments,
  };

  //#endregion -----------

  //#region functions

  /**
   * function for check and go to next screen
   */
  const goNext = async () => {
    //console.log('#next in tc');
    setLoaderVisible(true);
    let next = validateRequiredFields();
    console.log('#Q1', next);
    if (next) {
      setLoaderVisible(false);
      globalFunctions.globalSendDataAndGoNext(
        token,
        reportId,
        setLoaderVisible,
        () => sendLocalData(fieldArray, dataForSend, token),
        'TechnicalCharacteristics',
        navigation,
        dispatch,
        sectionList,
        constants,
        'specifications',
        goToUnfilled
      );
    }
    console.log('J2');
    setLoaderVisible(false)
  };

  const generateRadioFields = (arr, setGeneratedRadio, assignArray, current) => {
    if (arr) {
      let temp = [];
      let curLabel = '';
      if (current?.forInput?.length > 0) {
        curLabel = current.forSend[0];
      }
      arr.map((item, index) => {
        temp.push(
          Object.assign(
            {
              id: item.id,
              label: item.label || item.value,
              value: item.value,
              title: item.label || item.value,
              checked: String(item.value) === String(curLabel),
            },
            assignArray
          )
        );
      });
      setGeneratedRadio(temp);
    }
  };

  useEffect(() => {
    setCarBrand(carBrandsChosen.forSend.length > 0 ? carBrandsChosen.forInput[0] : null);
    changeCarBrandId(carBrandsChosen.forInput.length > 0 ? carBrandsChosen.forSend[0] : null);
  }, [carBrandsChosen]);

  useEffect(() => {
    console.log('#LO1', loaderVisible);
  }, [loaderVisible]);
  async function sendLocalData(fieldArray, data, token) {
    setLoaderVisible(true);

    //validateRequiredFields(allFields, fieldArray, true, false, true);
    validateRequiredFields();
    let localData = {
      report_id: data.report_id,
      fields: [],
    };

    let fieldsOfObjects = {};

    Object.keys(data).map((item, index) => {
      if (Object.keys(fieldArray).includes(item)) {
        if (typeof data[item] === 'object' && data[item] !== null) {
          if (data[item].forSend.length > 0) {
            if (data[item]?.forInput[0]?.toString().length) {
              localData.fields.push(
                Object.assign(
                  {
                    val: data[item].forSend[0],
                    val_text: data[item].forInput[0].toString() ? data[item].forInput[0].toString() : '',
                  },
                  {
                    id: fieldArray[item].id,
                  }
                )
              );
              fieldsOfObjects[fieldArray[item].id] = {
                ...fieldArray[item],
                val: data[item].forSend[0],
                val_text: data[item].forInput[0].toString() ? data[item].forInput[0].toString() : '',
                sub_field: {
                  id: data[item].forSend[0],
                  value: data[item].forInput[0].toString() ? data[item].forInput[0].toString() : '',
                },
              };
            }
          }
        } else if (data[item] !== null && typeof data[item] !== 'undefined') {
          if (data[item].toString().length) {
            localData.fields.push(
              Object.assign(
                { val: data[item], val_text: data[item].toString() ? data[item].toString() : '' },
                {
                  id: fieldArray[item].id,
                }
              )
            );
            fieldsOfObjects[fieldArray[item].id] = {
              ...fieldArray[item],
              val: data[item],
              val_text: data[item].toString() ? data[item].toString() : '',
              sub_field: {
                id: data[item],
                value: data[item].toString() ? data[item].toString() : '',
              },
            };
          }
        }
      }
    });

    if (!netInfo?.isConnected) {
      const result = new Promise(async function (resolve, reject) {
        const shouldSendedReportData = JSON.parse(await AsyncStorage.getItem('@shouldSendedReportData'));

        if (
          !shouldSendedReportData ||
          shouldSendedReportData === null ||
          shouldSendedReportData.length < 1
        ) {
          await AsyncStorage.setItem(
            '@shouldSendedReportData',
            JSON.stringify([
              {
                report_id: data.report_id,
                fields: { ...fieldsOfObjects },
              },
            ])
          );
        } else {
          const temple = shouldSendedReportData.find(item => item.report_id === data.report_id) || {
            fields: {},
          };
          const newShouldSend = shouldSendedReportData.filter(item => item.report_id !== data.report_id);
          await AsyncStorage.setItem(
            '@shouldSendedReportData',
            JSON.stringify([
              ...newShouldSend,
              {
                report_id: data.report_id,
                fields: { ...temple.fields, ...fieldsOfObjects },
              },
            ])
          );
        }
        resolve(true);
      });
      console.log('#J3');
      setLoaderVisible(false);
      return result;
    } else {
      const result = await global.sendReportData(localData, token);
      console.log('#J4');
      setLoaderVisible(false);
      return result;
    }
  }
  /**
   * function for validate required fields
   */

  function validateRequiredFields() {
    //validating to show what's left
    let validateResults = validateFields(fieldsValues, fieldArray, goToUnfilled, {
      state_number: validatePlate,
      vin: validateVin,
      price: validatePrice,
    });
    let allValid = Object.values(validateResults).every(item => item);
    Object.keys(validateResults).forEach(key => {
      allFieldsFlagSetters[key](validateResults[key]);
    });

    //validating for menu
    let validateResultsMenu = validateFields(fieldsValues, fieldArray, true, {
      state_number: validatePlate,
      vin: validateVin,
      price: validatePrice,
    });
    let allValidMenu = Object.values(validateResultsMenu).every(item => item);
    allValidMenu
      ? dispatch(setOpenScreen('TechnicalCharacteristics', 2))
      : dispatch(setOpenScreen('TechnicalCharacteristics', 1));

    console.log('#F1', validateResults);

    return allValid;
  }

  function validateVin(text) {
    if (text) {
      if (!vinNonStandart) {
        return text.match(/^[a-np-zA-NP-Z0-9]{17}$/gm) !== null;
      } else {
        return text.length > 1 && /^[a-np-zA-NP-Zа-нп-яёА-НП-ЯЁ0-9]*$/.test(text);
      }
    }
  }
  /**
   * validate plate
   */
  function validatePlate(text) {
    if (text) {
      if (plateNonStandart) {
        return text.length > 0;
        // if (text.length > 0) {
        //   changeValidatePlateFlag(true);
        // } else {
        //   changeValidatePlateFlag(false);
        // }
      } else {
        return text.match(/^[А-ЯЁ]+[А-ЯЁ0-9]+[А-ЯЁ0-9]$/gm) !== null;
        // if (text.match(/^[А-ЯЁ]+[А-ЯЁ0-9]+[А-ЯЁ0-9]$/gm)) {
        //   changeValidatePlateFlag(true);
        // } else {
        //   changeValidatePlateFlag(false);
        // }
      }
    }
  }

  const validatePrice = text => {
    let trimmed = text.split(' ').join('');
    if (trimmed.length > 0) {
      let numParts = trimmed.match(/\d+,?\d+$/gm);
      return numParts?.length === 1 && numParts[0] === trimmed;
    } else {
      return true;
    }
  };

  // const additionalValidations = {
  //   ''
  // }

  function getFieldsData(flag = false) {
    // if (flag) {
    //   let temporary = {};
    //   unfilledFields.map((item, index) => {
    //     temporary[item.column_name] = item;
    //   });
    //   //let generationField = temporary.find(el => el.column_name === 'car_generation');
    //
    //   //temporary.car_generation.required = 0;
    //   setFieldArray(temporary);
    //   generateRadioData(unfilledFields);
    //   setLoaderVisible(false);
    // } else {
    //
    setLoaderVisible(true)
    global
      .getFields(reportTypeId, section.id, token)
      .then(res => {
        if (res) {
          if (res.data.data.length > 0) {
            let temporary = {};
            res.data.data.map((item, index) => {
              temporary[item.column_name] = item;
            });

            //let generationField = temporary.find(el => el.column_name === 'car_generation');
            //temporary.car_generation.required = 0;
            setFieldArray(temporary);
          }
          generateRadioData(res.data.data);
          console.log('#J5');
          setLoaderVisible(false);
        }
      })
      .catch(err => {
        // globalFunctions.catchGetFieldsErrorNavMain(setLoaderVisible, navigation);
        console.log('#J6');
        setLoaderVisible(false);
        console.log(
          '\n\n\nError GetFields in TechnicalCharacteristics',
          err,
          err?.response,
          err?.toJSON(),
          Object.keys(err)
        );
      });
  }

  /**
   * generate radio data for elements
   */

  function generateRadioData(data) {
    const fieldsSetArray = {
      car_type: setRadioButtonsTypeData,
      body_type: setRadioButtonsBodyTypeData,
      engine_type: setRadioButtonsEngineTypeData,
      drive_unit: setRadioButtonsUnitTypeData,
      gearbox_type: setRadioButtonsGearTypeData,
      color: setRadioButtonsCarColorData,
    };
    let currentValues = {
      car_type: carType,
      body_type: carBodyType,
      engine_type: carEngineType,
      drive_unit: carUnitType,
      gearbox_type: carGearType,
      color: carColor,
    };
    let temporary = {};
    data.map((item, index) => {
      if (item.sub_fields && item.sub_fields?.length > 0) {
        temporary[item.column_name] = item.sub_fields;
      }
    });
    Object.keys(fieldsSetArray).map((item, index) => {
      return generateRadioFields(
        temporary[item],
        fieldsSetArray[item],
        carTypeRadioStyles,
        currentValues[item]
      );
    });
  }

  /**
   * function for get brands list from server
   */
  function getBrandsList() {
    technicalCharacteristic
      .getBrandsListApi(token)
      .then(res => {
        if (res) {
          if (res.data.data.length > 0) {
            let temporary = [];
            //let temporaryId = [];
            res.data.data.map((item, index) => {
              //console.log('#J1', item);
              temporary.push([item.id, item.value, item.logo]);
              // temporaryId.push(item.id);
            });
            if (temporary && temporary.length > 0) {
              setNewBrandsList(temporary);
            }

            // setCarBrandsIdList(temporaryId);
          }
        }
      })
      .catch(err => {
        console.log('\n\n\nError GetBrands T/C', err);
      });

    technicalCharacteristic
      .getBrandsListApi(token, true)
      .then(res => {
        if (res) {
          if (res.data.data.length > 0) {
            let temporary = [];
            // let temporaryId = [];
            res.data.data.map((item, index) => {
              temporary.push([item.id, item.value, item.logo]);
              // temporaryId.push(item.id);
            });
            if (temporary && temporary.length > 0) {
              setNewPopularList(temporary);
            }
            //setCarBrandPopularList(temporary);

            //  setCarBrandPopularListId(temporaryId);
          }
        }
      })
      .catch(err => {
        console.log('\n\n\nError GetBrands T/C', err);
      });
  }

  /**
   * function for get model list based on brand
   */
  // function getModelsList(current = '') {

  function getModelsList(brands) {
    let modelsList = [];
    Promise.all(brands.map(brand => technicalCharacteristic.getModelsListApi(brand, token)))
      .then(res => {
        res.map(modelResponse => {
          if (modelResponse) {
            if (modelResponse?.data?.data) {
              modelsList = [...modelResponse?.data?.data, ...modelsList];
            }
          }
        });

        setModelListRaw(modelsList);

        generateRadioFields(modelsList, setRadioButtonsModelData, carTypeRadioStyles);
      })
      .catch(err => {
        console.log('\n\n\nError GetBrands T/C', err);
      });
  }

  useEffect(() => {
    generateRadioFields(modelListRaw, setRadioButtonsModelData, carTypeRadioStyles, chosenModels);
    if (chosenModels?.forSend.length > 0) {
      getGenerationList(chosenModels.forSend[0]);
    }

    if (!isFirstChangeModel) {
      setRadioButtonsGenerationData([]);
      setRadioButtonsProductionData([]);
      setCarProduction({ forSend: [], forInput: [] });
      setCarGeneration({ forSend: [], forInput: [] });
    }

    //setRadioButtonsProductionData([]);
  }, [modelListRaw, chooseCarModel]);

  useEffect(() => {
    generateRadioFields(
      generationListRaw,
      setRadioButtonsGenerationData,
      carTypeRadioStyles,
      carGeneration
    );
    if (!isFirstChangeGeneration) {
      setRadioButtonsProductionData([]);
      setCarProduction({ forSend: [], forInput: [] });
    }
  }, [generationListRaw, carGeneration]);
  /**
   * generate years range
   */
  function generateYearsRange(id) {
    let temporary = [];
    yearData.map((item, index) => {
      if (item.id === id) {
        for (let i = parseInt(item.year_from); i <= parseInt(item.year_to); i++) {
          temporary.push({ id: i, value: i });
        }
      }
    });
    generateRadioFields(temporary, setRadioButtonsProductionData, carTypeRadioStyles, carProduction);
  }

  /**
   * function for get generation and years list based on model
   */
  function getGenerationList() {
    if (chosenModels?.forSend.length > 0) {
      technicalCharacteristic
        .getGenerationListApi(chosenModels.forSend[0], token)
        .then(res => {
          if (res) {
            if (res.data.data.length > 0) {
              let resTemp = [...res.data.data];
              let reg = /^[0-9]{4}\s{0,}\-{1}\s{0,}[0-9]{4}$/gm;
              resTemp.map(generationItem => {
                if (!generationItem.value.match(reg)) {
                  generationItem.value = `${generationItem.value} (${generationItem.year_from} - ${generationItem.year_to})`;
                }
              });
              // generateRadioFields(
              //   resTemp,
              //   setRadioButtonsGenerationData,
              //   carTypeRadioStyles,
              //   carGeneration
              // );
              setGenerationListRaw(resTemp);
              setYearData(res.data.data);
            }
          }
        })
        .catch(err => {
          console.log('\n\n\nError GetGenerations&Years T/C', err?.response);
        });
    }
  }

  /**
   * finction for process saved report data
   */

  async function formSavedData(data, setLoaderVisible, unfilledFlag = false, temporaryDefault = {}) {
    if (data) {
      let temporary = temporaryDefault;
      let brand = [];
      let model = [];
      let generation = [];

      //const car_brand_id = data.find(item => item.column_name === 'car_brand_id');
      // if (car_brand_id?.val){
      //     const findBrand = brandsList.find(b => b.id === car_brand_id.val);
      //     brand = [findBrand.id, findBrand.value];
      // }
      // if (car_brand_id.val) {
      //   //const brandsList = JSON.parse(await AsyncStorage.getItem('@cars'));
      //   const findBrand = brandsList.find(b => b.id === car_brand_id.val);
      //   brand = [findBrand.id, findBrand.value];
      //
      //   const car_model_id = data.find(item => item.column_name === 'car_model_id');
      //   if (car_model_id.val) {
      //     const findModel = findBrand.models.find(b => b.id === car_model_id.val);
      //     model = [findModel.id, findModel.value];
      //
      //     const car_generation = data.find(item => item.column_name === 'car_generation');
      //     if (car_generation.val) {
      //       const findGeneration = findModel.generations.find(b => b.id === car_generation.val);
      //       generation = [findGeneration.id, findGeneration.value];
      //     }
      //   }
      // }

      data.map(async (item, index) => {
        temporary[item.column_name] = item;
        switch (item.column_name) {
          case 'vin':
            try {
              fieldsStates[item.column_name](item?.val || item.saved_fields[0]?.val);
            } catch (err) {
              console.log('err', err);
            }
            break;

          case 'vin_not_standard':
            try {
              fieldsStates[item.column_name](item?.val_text ? item?.val : item.saved_fields[0]?.val);
            } catch (err) {
              console.log('err', err);
            }
            break;

          case 'state_number':
            try {
              fieldsStates[item.column_name](item?.val || item?.saved_fields[0]?.val);
            } catch (err) {
              console.log('err', err);
            }
            break;

          case 'state_number_not_standard':
            try {
              fieldsStates[item.column_name](item?.val_text ? item?.val : item.saved_fields[0]?.val);
            } catch (err) {
              console.log('err', err);
            }
            break;

          case 'for_sale':
            try {
              fieldsStates[item.column_name](item?.val_text ? item?.val : item.saved_fields[0]?.val);
            } catch (err) {
              console.log('err', err);
            }
            break;

          case 'price':
            try {
              fieldsStates[item.column_name](item?.val || item?.saved_fields[0]?.val || '');
            } catch (err) {
              console.log('err', err);
            }
            break;

          case 'car_type':
            try {
              let forSend = item?.sub_field?.id || item.saved_fields[0]?.sub_field?.id;
              if (forSend !== undefined) {
                fieldsStates[item.column_name]({
                  forSend: [item?.sub_field?.id || item.saved_fields[0]?.sub_field?.id],
                  forInput: [item?.sub_field?.value || item.saved_fields[0]?.sub_field?.value],
                });

                generateRadioFields(item.sub_fields, setRadioButtonsTypeData, carTypeRadioStyles, {
                  forSend: [item?.sub_field?.id || item.saved_fields[0]?.sub_field?.id],
                  forInput: [item?.sub_field?.value || item.saved_fields[0]?.sub_field?.value],
                });
              }
            } catch (err) {
              console.log('err type', err);
            }
            break;

          case 'car_brand_id':
            try {
              let forSend = brand[0] || item?.car_brand?.id || item.saved_fields[0]?.car_brand?.id;
              let forInput =
                brand[1] || item?.car_brand?.value || item.saved_fields[0]?.car_brand?.value;
              if (forInput !== undefined && forInput !== null) {
                fieldsStates[item.column_name]({
                  forInput: [forInput],
                  forSend: [forSend],
                });
                getModelsList([forSend]);
                // fieldsStates[item.column_name][0](
                //   brand[0] || item?.car_brand?.id || item.saved_fields[0]?.car_brand?.id
                // );
                // fieldsStates[item.column_name][1](
                //   brand[1] || item?.car_brand?.value || item.saved_fields[0]?.car_brand?.value
                // );
              }

              // if (forInput) {
              //   getModelsList([forInput]);
              // }
            } catch (err) {
              console.log('err brand', err);
            }
            break;

          case 'car_model_id':
            try {
              fieldsStates[item.column_name][0](
                model[0] || item?.car_model?.id || item.saved_fields[0]?.car_model?.id
              );
              fieldsStates[item.column_name][1](
                model[1] || item?.car_model?.value || item.saved_fields[0]?.car_model?.value
              );
              let modelInputValue =
                model[1] || item?.car_model?.value || item.saved_fields[0]?.car_model?.value;
              setChosenModels({
                forInput: modelInputValue ? [modelInputValue] : [],
                forSend: modelInputValue
                  ? [item?.car_model?.id || item.saved_fields[0]?.car_model?.id]
                  : [],
              });
              // chooseCarModel(
              //   model[1] || item?.car_model?.value || item.saved_fields[0].car_model.value
              // );
              // getModelsList(
              //   model[1] || item?.car_model?.value || item.saved_fields[0].car_model.value
              // );
              //getGenerationList()
            } catch (err) {
              console.log('err model', fieldsStates[item.column_name]);
            }
            break;

          case 'model_year':
            try {
              let yearVal = item?.val || item.saved_fields[0]?.val;
              fieldsStates[item.column_name]({
                forSend: yearVal ? [yearVal] : [],
                forInput: yearVal ? [yearVal] : [],
              });
              generateRadioFields(item.sub_fields, setRadioButtonsProductionData, carTypeRadioStyles, {
                forSend: yearVal ? [yearVal] : [],
                forInput: yearVal ? [yearVal] : [],
              });
            } catch (err) {
              console.log('err model year', err);
            }
            break;

          case 'body_type':
            try {
              let forSend = item?.sub_field?.id || item.saved_fields[0]?.sub_field?.id;
              if (forSend !== undefined) {
                fieldsStates[item.column_name]({
                  forSend: [item?.sub_field?.id || item.saved_fields[0]?.sub_field?.id],
                  forInput: [item?.sub_field?.value || item.saved_fields[0]?.sub_field?.value],
                });
                generateRadioFields(item.sub_fields, setRadioButtonsBodyTypeData, carTypeRadioStyles, {
                  forSend: [item?.sub_field?.id || item.saved_fields[0]?.sub_field?.id],
                  forInput: [item?.sub_field?.value || item.saved_fields[0]?.sub_field?.value],
                });
              }
            } catch (err) {
              console.log('err body type', err);
            }
            break;

          case 'car_generation':
            try {
              let forSend =
                generation[0] ||
                item?.model_generation?.id ||
                item.saved_fields[0]?.model_generation?.id;
              if (forSend !== undefined) {
                fieldsStates[item.column_name]({
                  forSend: [
                    generation[0] ||
                      item?.model_generation?.id ||
                      item.saved_fields[0]?.model_generation?.id,
                  ],
                  forInput: [
                    generation[1] ||
                      item?.model_generation?.value ||
                      item.saved_fields[0]?.model_generation?.value,
                  ],
                });
              }

              //setCarGeneration()
              // setChooseCarModel({
              //   forSend: [
              //     generation[0] ||
              //       item?.model_generation?.id ||
              //       item.saved_fields[0].model_generation.id,
              //   ],
              //   forInput: [
              //     generation[1] ||
              //       item?.model_generation?.value ||
              //       item.saved_fields[0].model_generation.value,
              //   ],
              // });
              //getGenerationList();
            } catch (err) {
              console.log('err generation', err);
            }
            break;

          case 'engine_type':
            try {
              let forSend = item?.sub_field?.id || item.saved_fields[0]?.sub_field?.id;
              if (forSend !== undefined) {
                fieldsStates[item.column_name]({
                  forSend: [item?.sub_field?.id || item.saved_fields[0]?.sub_field?.id],
                  forInput: [item?.sub_field?.value || item.saved_fields[0]?.sub_field?.value],
                });
                generateRadioFields(item.sub_fields, setRadioButtonsEngineTypeData, carTypeRadioStyles, {
                  forSend: [item?.sub_field?.id || item.saved_fields[0]?.sub_field?.id],
                  forInput: [item?.sub_field?.value || item.saved_fields[0]?.sub_field?.value],
                });
              }
            } catch (err) {
              console.log('err engine type', err);
            }
            break;

          case 'drive_unit':
            try {
              let forSend = item?.sub_field?.id || item.saved_fields[0]?.sub_field?.id;
              if (forSend !== undefined) {
                fieldsStates[item.column_name]({
                  forSend: [item?.sub_field?.id || item.saved_fields[0]?.sub_field?.id],
                  forInput: [item?.sub_field?.value || item.saved_fields[0]?.sub_field?.value],
                });
                generateRadioFields(item.sub_fields, setRadioButtonsUnitTypeData, carTypeRadioStyles, {
                  forSend: [item?.sub_field?.id || item.saved_fields[0]?.sub_field?.id],
                  forInput: [item?.sub_field?.value || item.saved_fields[0]?.sub_field?.value],
                });
              }
            } catch (err) {
              console.log('err drive unit', err);
            }
            break;

          case 'gearbox_type':
            try {
              let forSend = item?.sub_field?.id || item.saved_fields[0]?.sub_field?.id;
              if (forSend !== undefined) {
                fieldsStates[item.column_name]({
                  forSend: [item?.sub_field?.id || item.saved_fields[0]?.sub_field?.id],
                  forInput: [item?.sub_field?.value || item.saved_fields[0]?.sub_field?.value],
                });
                generateRadioFields(item.sub_fields, setRadioButtonsGearTypeData, carTypeRadioStyles, {
                  forSend: [item?.sub_field?.id || item.saved_fields[0]?.sub_field?.id],
                  forInput: [item?.sub_field?.value || item.saved_fields[0]?.sub_field?.value],
                });
              }
            } catch (err) {
              console.log('err gearbox type', err);
            }
            break;

          case 'engine_volume':
            try {
              fieldsStates[item.column_name](item?.val || item.saved_fields[0]?.val);
            } catch (err) {
              console.log('err volume', err);
            }
            break;

          case 'power':
            try {
              fieldsStates[item.column_name](item?.val || item.saved_fields[0]?.val);
            } catch (err) {
              console.log('err power', err);
            }
            break;

          case 'color':
            try {
              let forSend = item?.sub_field?.id || item.saved_fields[0]?.sub_field?.id;
              let forInput = item?.sub_field?.value || item.saved_fields[0]?.sub_field?.value;
              fieldsStates[item.column_name]({
                forSend: forSend ? [forSend] : [],
                forInput: forInput ? [forInput] : [],
              });
              generateRadioFields(item.sub_fields, setRadioButtonsCarColorData, carTypeRadioStyles, {
                forSend: forSend ? [forSend] : [],
                forInput: forInput ? [forInput] : [],
              });
            } catch (err) {
              console.log('err color', err);
            }
            break;

          case 'mileage':
            try {
              fieldsStates[item.column_name](item?.val || item.saved_fields[0]?.val);
            } catch (err) {
              console.log('err', err);
            }
            break;

          case 'new_car':
            try {
              fieldsStates[item.column_name](item?.val_text ? item?.val : item.saved_fields[0]?.val);
            } catch (err) {
              console.log('err', err);
            }
            break;

          case 'emergency':
            try {
              fieldsStates[item.column_name](item?.val_text ? item?.val : item.saved_fields[0]?.val);
            } catch (err) {
              console.log('err', err);
            }
            break;

          case 'not_on_go':
            try {
              fieldsStates[item.column_name](item?.val_text ? item?.val : item?.saved_fields[0]?.val);
            } catch (err) {
              console.log('err', err);
            }
            break;

          case 'comment':
            try {
              fieldsStates[item.column_name](item?.val || item?.saved_fields[0]?.val);
            } catch (err) {
              console.log('err', err);
            }
            break;
        }
      });
      temporary.car_generation.required = 0;
      setFieldArray(temporary);
      //}
    }
    console.log('#J1');
    setLoaderVisible(false);
  }

  //#endregion -----------

  /**
   * useeffect for plate validate rerun
   */
  useEffect(() => {
    validatePlate(plateValue);
  }, [plateNonStandart]);

  /**
   * useeffect for year generate
   */
  useEffect(() => {
    // setCarProduction({
    //   forSend: [],
    //   forInput: [],
    // });
    return yearData && carGeneration.forSend.length > 0
      ? generateYearsRange(carGeneration.forSend[0])
      : '';
  }, [carGeneration, yearData]);

  /**
   * useeffect for generation and year request
   */

  useEffect(() => {
    if (chooseCarModelId && netInfo?.isConnected !== null && route.name === 'TechnicalCharacteristics') {
      if (!netInfo?.isConnected) {
        console.log('no connection');
        //getGenerationListFromStorage();
      } else {
        if (chosenModels?.forSend.length > 0) {
          getGenerationList(chosenModels.forSend[0]);
        }
      }
    }
  }, [chooseCarModelId, netInfo, route]);

  useEffect(() => {
    if (netInfo?.isConnected !== null && carIdBrand && route.name === 'TechnicalCharacteristics') {
      if (!netInfo?.isConnected) {
        console.log('no connection');
        //getModelsListFromStorage();
      } else {
        getModelsList([carIdBrand]);
      }
      if (!isFirstChangeBrand) {
        setCarProduction({ forSend: [], forInput: [] });
        setCarGeneration({ forSend: [], forInput: [] });
        setChosenModels({ forSend: [], forInput: [] });
        setChooseCarModel(null);
        setChooseCarModelId(null);
        setRadioButtonsModelData([]);
        setRadioButtonsProductionData([]);
        setRadioButtonsGenerationData([]);
      }
    }
  }, [carIdBrand, netInfo, route, carBrand]);

  useEffect(() => {
    if (carBrand !== null) {
      setModelOpenErrors([]);
      setGenerationsOpenErrors([]);
      setYearsOpenErrors([]);
    }
  }, [carBrand]);

  useEffect(() => {
    if (chosenModels.forInput.length > 0) {
      setGenerationsOpenErrors([]);
      setYearsOpenErrors([]);
    }
  }, [chosenModels]);

  useEffect(() => {
    if (carGeneration.forInput.length > 0) {
      setYearsOpenErrors([]);
    }
  }, [carGeneration]);

  useEffect(() => {
    if (netInfo?.isConnected !== null && route.name === 'TechnicalCharacteristics') {
      if (!netInfo?.isConnected) {
        console.log('no connection');
        // if (goToUnfilled) {
        //   // getFieldsDataFromStorage(true);
        //   // getSavedFieldsDataFromStorage(true);
        //   // getBrandsFromStorage();
        // } else {
        //   if (menusState['TechnicalCharacteristics'] !== 0) {
        //     setLoaderVisible(true);
        //     getFieldsDataFromStorage();
        //     getSavedFieldsDataFromStorage();
        //     getBrandsFromStorage();
        //   } else {
        //     getFieldsDataFromStorage();
        //     getBrandsFromStorage();
        //   }
        // }
      } else {
        // if (goToUnfilled) {
        //   getFieldsData(true);
        //   globalFunctions.globalGetSavedData(
        //     token,
        //     reportId,
        //     section.id,
        //     null,
        //     formSavedData,
        //     setLoaderVisible,
        //     true
        //   );
        //   getBrandsList();
        // } else {
        if (menusState.TechnicalCharacteristics !== 0) {
          setLoaderVisible(true);
          getFieldsData();
          globalFunctions.globalGetSavedData(
            token,
            reportId,
            section.id,
            null,
            formSavedData,
            setLoaderVisible
          );
          setLoaderVisible(false);
          getBrandsList();
        } else {
          getFieldsData();
          getBrandsList();
        }
      }
    }
    //}
  }, [netInfo.isConnected, route]);

  const setModalOpenCarModeWithValidation = value => {
    if (value) {
      if (carBrand !== null) {
        setModalOpenCarModel(value);
        setModelOpenErrors([]);
      } else {
        setModelOpenErrors(['Для выбора модели необходимо сначала выбрать марку']);
      }
    } else {
      setModalOpenCarModel(value);
    }
  };

  const setGenerationsOpenCarModeWithValidation = value => {
    let newErrors = [];
    if (value) {
      if (carBrand === null) {
        newErrors.push('Для выбора поколения необходимо сначала выбрать марку');
      }
      if (chosenModels.forSend.length === 0) {
        newErrors.push('Для выбора поколения необходимо сначала выбрать модель');
      }
      setGenerationsOpenErrors(newErrors);
      if (newErrors.length === 0) {
        setModalGenerationOpen(value);
      }
    } else {
      setModalOpenCarModel(value);
    }
  };

  const setYearsOpenCarModeWithValidation = value => {
    let newErrors = [];
    if (value) {
      if (carBrand === null) {
        newErrors.push('Для выбора года выпуска необходимо сначала выбрать марку');
      }
      if (chosenModels.forSend.length === 0) {
        newErrors.push('Для выбора года выпуска необходимо сначала выбрать модель');
      }
      if (carGeneration.forSend.length === 0) {
        newErrors.push('Для выбора года выпуска необходимо сначала выбрать поколение');
      }
      setYearsOpenErrors(newErrors);
      if (newErrors.length === 0) {
        setModalProductionOpen(value);
      }
    } else {
      setModalProductionOpen(value);
    }
  };

  const isReportEmpty = () => {
    //console.log('#MS1', menusState);
    return false;
  };
  const goBackFunc = () => {
    setModalExitVisible(true);
  };
  return (
    <SafeAreaView>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
      <HeaderBar
        title={section.title}
        menu={
          <ProgressMenu
            nav={navigation}
            validateFunc={() => validateRequiredFields()}
            formDataFunction={() => sendLocalData(fieldArray, dataForSend, token)}
            setLoaderVisible={setLoaderVisible}
            currentScreen={'TechnicalCharacteristics'}
          />
        }
        nextFunc={() =>
          globalFunctions.sendSection(
            setLoaderVisible,
            () => sendLocalData(fieldArray, dataForSend, token),
            nextSection.toScetion,
            navigation,
            dispatch
          )
        }
        nextButton={false}
        backFunc={() => {
          goBackFunc();
          //navigation.navigate('AllReportsScreen');
        }}
        //backButton={goToUnfilled ? true : false}
        backButton={true}
        endReport={goToUnfilled ? true : false}
        goBackFlag={false}
        menuFlag={true}
        nav={navigation}
        route={route}
        screenBack={'AllReportsScreen'}
      >
        <KeyboardAvoidingView
          style={{ width: '100%' }}
          keyboardVerticalOffset={0}
          enabled={Platform.OS === 'ios' ? true : false}
          behavior="padding"
        >
          <View style={styles.container}>
            <AnimatedLoader
              visible={loaderVisible}
              overlayColor={!fieldArray ? COLORS.none : COLORS.whiteTransparent}
              source={loader}
              animationStyle={styles.lottie}
              speed={1}
              loop={true}
            />
            {fieldArray !== null && fieldArray ? (
              <ScrollView
                //style={{ flex: 1 }}
                contentContainerStyle={{
                  paddingBottom: 0,
                  flexGrow: 1,
                  paddingLeft: 15,
                  paddingRight: 15,
                }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              >
                {
                  <>
                    <View>
                      <VinField
                        vinValue={vinValue}
                        validateVinFlag={validateVinFlag}
                        vinNonStandart={vinNonStandart}
                        field={fieldArray.vin}
                        setVinValue={setVinValue}
                        changeValidateVinFlag={() => {}} //changeValidateVinFlag}
                      />
                    </View>
                    <View>
                      <FieldCheckSwitch
                        field={fieldArray.vin_not_standard}
                        value={vinNonStandart}
                        setValue={setVinNonStandart}
                        type={'check'}
                      />
                    </View>
                  </>
                }

                <View>
                  <FieldInput
                    field={fieldArray.state_number}
                    value={plateValue}
                    setValue={setPlateValue}
                    validateFlag={validatePlateFlag}
                    setValidate={changeValidatePlateFlag}
                    //validateOnType={true}
                    validateFunc={validatePlate}
                    upperCased={true}
                    maxLength={9}
                  />
                </View>
                <View>
                  <FieldCheckSwitch
                    field={fieldArray.state_number_not_standard}
                    value={plateNonStandart}
                    setValue={setPlateNonStandart}
                    type={'check'}
                  />
                </View>
                <View>
                  {
                    <FieldModal
                      field={fieldArray.car_type}
                      value={carType}
                      showModal={setcarTypeModalOpen}
                      validateFlag={validateTypeFlag}
                      //setValidate={changeValidateTypeFlag}
                    />
                  }
                </View>
                {
                  <FieldModal
                    field={fieldArray.car_brand_id}
                    value={
                      carBrand !== null && carBrand !== ''
                        ? { forInput: [carBrand], forOutput: [carBrand] }
                        : { forInput: [], forOutput: [] }
                    }
                    showModal={() => {
                      //console.log('#N4', carBrand);
                      navigation.navigate('BrandChoose', {
                        currentBrands: carBrandsChosen ?? '',
                        changeCarBrand: v => {
                          setCarBrandsChosen(v);
                          setIsFirstChangeBrand(false);
                        },
                        //currentBrandId: carBrandsChosen, //carIdBrand ?? '',
                        //changeCarBrandId,
                        //brandList: carBrandsList,
                        //brandPopularList: carBrandPopularList,
                        singleChoice: true,
                      });
                    }}
                    validateFlag={validateBrandFlag}
                  />
                }
                {
                  <View>
                    <FieldModal
                      field={fieldArray.car_model_id}
                      value={chosenModels}
                      showModal={setModalOpenCarModeWithValidation}
                      validateFlag={validateModelFlag}
                      //setValidate={changeValidateModelFlag}
                    />
                    {modelOpenErrors.length > 0 ? (
                      <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
                        {modelOpenErrors.join('\n')}
                      </Text>
                    ) : (
                      <></>
                    )}
                  </View>
                }

                <View>
                  <FieldModal
                    field={fieldArray.car_generation}
                    value={carGeneration}
                    showModal={setGenerationsOpenCarModeWithValidation}
                    validateFlag={validateGenerationFlag}
                    //setValidate={changeValidateGenerationFlag}
                  />
                  {generationOpenErrors.length > 0 ? (
                    <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
                      {generationOpenErrors.join('\n')}
                    </Text>
                  ) : (
                    <></>
                  )}
                </View>
                <View>
                  <FieldModal
                    field={fieldArray.model_year}
                    value={carProduction}
                    showModal={setYearsOpenCarModeWithValidation}
                    validateFlag={validateYearFlag}
                    //setValidate={changeValidateYearFlag}
                  />
                  {yearsOpenErrors.length > 0 ? (
                    <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
                      {yearsOpenErrors.join('\n')}
                    </Text>
                  ) : (
                    <></>
                  )}
                </View>
                <View>
                  <FieldModal
                    field={fieldArray.body_type}
                    value={carBodyType}
                    showModal={setModalBodyTypeOpen}
                    validateFlag={validateBodyFlag}
                    //setValidate={changeValidateBodyFlag}
                  />
                </View>

                <View>
                  <FieldModal
                    field={fieldArray.engine_type}
                    value={carEngineType}
                    showModal={setModalCarEngineTypeOpen}
                    validateFlag={validateEngineTypeFlag}
                    //setValidate={changeValidateEngineTypeFlag}
                  />
                </View>
                <View>
                  <FieldModal
                    field={fieldArray.drive_unit}
                    value={carUnitType}
                    showModal={setModalUnitTypeOpen}
                    validateFlag={validateUnitFlag}
                    //setValidate={changeValidateUnitFlag}
                  />
                </View>
                <View>
                  <FieldModal
                    field={fieldArray.gearbox_type}
                    value={carGearType}
                    showModal={setModalGearTypeOpen}
                    validateFlag={validateGearFlag}
                    //setValidate={changeValidateGearFlag}
                  />
                </View>
                <View>
                  <FieldInput
                    field={fieldArray.engine_volume}
                    value={carEngineVolume}
                    setValue={setCarEngineVolume}
                    active={carEngineFieldActive}
                    setActive={setCarEngineFieldActive}
                    validateFlag={validateEngineVolumeFlag}
                    // validateOnType={true}
                    // validateFunc={text => text.length > 0}
                    //validateFlag={false}
                    setValidate={changeValidateEngineVolumeFlag}
                    fieldType={'numeric'}
                    //maxLength={4}
                  />
                </View>
                <View>
                  <FieldInput
                    field={fieldArray.power}
                    value={carEnginePower}
                    setValue={setCarEnginePower}
                    active={carEngineFieldPowerActive}
                    setActive={setCarEngineFieldPowerActive}
                    validateFlag={validateEnginePowerFlag}
                    //setValidate={changeValidateEnginePowerFlag}
                    fieldType={'numeric'}
                    maxLength={4}
                  />
                </View>
                <View>
                  <FieldModal
                    field={fieldArray.color}
                    value={carColor}
                    showModal={setModalCarColor}
                    validateFlag={validateColorFlag}
                    //setValidate={changeValidateColorFlag}
                  />
                </View>
                <View>
                  <FieldInput
                    field={fieldArray.mileage}
                    value={carMileage}
                    setValue={setCarMileage}
                    active={carMileageFieldActive}
                    setActive={setCarMileageFieldActive}
                    validateFlag={validateMileageFlag}
                    setValidate={changeValidateMileageFlag}
                    fieldType={'numeric'}
                    maxLength={7}
                    reg={/[^0-9]/g}
                  />
                </View>
                <View>
                  <FieldCheckSwitch
                    field={fieldArray.new_car}
                    value={carNewFlag}
                    setValue={setCarNewFlag}
                    type={'switch'}
                    //style={{ marginTop: 20 }}
                  />
                </View>
                <View>
                  <FieldCheckSwitch
                    field={fieldArray.emergency}
                    value={carCrashFlag}
                    setValue={setCarCrashFlag}
                    type={'switch'}
                    //style={{ marginTop: 20 }}
                  />
                </View>
                <View>
                  <FieldCheckSwitch
                    field={fieldArray.not_on_go}
                    value={carNotRunFlag}
                    setValue={setCarNotRunFlag}
                    type={'switch'}
                    //style={{ marginTop: 20 }}
                  />
                </View>
                <View>
                  <FieldCheckSwitch
                    field={fieldArray.for_sale}
                    value={carForSaleFlag}
                    setValue={serCarForSaleFlag}
                    type={'switch'}
                    //style={{ marginTop: 10, marginBottom: 20 }}
                  />
                </View>
                {carForSaleFlag ? (
                  <View>
                    <FieldInput
                      field={fieldArray.price}
                      value={carPrice}
                      setValue={setCarPrice}
                      active={carPriceFieldActive}
                      setActive={setCarPriceFieldActive}
                      validateFlag={validatePriceFlag}
                      // validateFlag={validatePriceFlag && !carForSaleFlag}
                      setValidate={changeValidatePriceFlag}
                      fieldType={'numeric'}
                      maxLength={20}
                      reg={/[^0-9]/g}
                      // required={carForSaleFlag}
                    />
                  </View>
                ) : (
                  <></>
                )}
                {(!goToUnfilled || 'comment' in fieldArray) && (
                  <View
                    style={[
                      styles.inputVinInner,
                      {
                        borderColor: validateCommentFlag ? COLORS.gray : COLORS.red,
                        backgroundColor: validateCommentFlag ? COLORS.primary : COLORS.ping,
                        marginTop: 5,
                      },
                    ]}
                  >
                    {commentsActive || comments ? (
                      <Text style={[theme.FONTS.body_SF_R_11, styles.inputTitle]}>
                        {/* {fieldArray['comment']?.name + (fieldArray['comment']?.required == 2 ? '*' : '')} */}
                        Комментарий
                      </Text>
                    ) : (
                      <></>
                    )}
                    <TextInput
                      style={[
                        theme.FONTS.body_SF_R_15,
                        styles.inputVin,
                        {
                          height: 90,
                          paddingTop:
                            commentsActive || comments
                              ? Platform.OS === 'ios'
                                ? 18
                                : 18
                              : Platform.OS === 'ios'
                              ? 0
                              : 8,
                        },
                      ]}
                      placeholderTextColor={COLORS.darkGray}
                      placeholder={
                        //fieldArray['comment']?.name + (fieldArray['comment']?.required == 2 ? '*' : '')
                        !commentsActive ? 'Комментарий' : ''
                      }
                      multiline={true}
                      textAlignVertical={'top'}
                      onFocus={() => setCommentsActive(true)}
                      onBlur={() => setCommentsActive(false)}
                      onChangeText={text => setComments(text)}
                      value={comments}
                    />
                  </View>
                )}
              </ScrollView>
            ) : (
              <></>
            )}
            {!loaderVisible ? (
              <TouchableOpacity onPress={() => goNext()}>
                <Text style={[theme.FONTS.body_SF_M_15, styles.nextBtn]}>Далее</Text>
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        </KeyboardAvoidingView>

        {/**
         * modal for type choose
         */}
        <ModalChoose
          title={'Выберите тип транспорта'}
          isOpen={carTypeModalOpen}
          closeModal={setcarTypeModalOpen}
          setValue={changeCarType}
          data={radioButtonsTypeData}
          type={'radiobuttonOneButton'}
          current={carType}
        />

        {/**
         * modal for model choose
         */}

        <ModalChoose
          title={'Выберите модель транспорта'}
          isOpen={modalOpenCarModel}
          closeModal={setModalOpenCarModel}
          setValue={v => {
            setChosenModels(v);
            if (v.forInput?.length > 0) {
              setChooseCarModel(v.forInput[0]);
              setChooseCarModelId(v.forSend[0]);
            }
            setIsFirstChangeModel(false);

            //onFormDataChange(v, 'car_model_id');
          }}
          data={radioButtonsModelData}
          type={'radiobuttonOneButton'}
          current={chosenModels}
        />

        {/**
         * modal for car production
         */}

        <ModalChoose
          title={'Выберите год выпуска транспорта'}
          isOpen={modalProductionOpen}
          closeModal={setModalProductionOpen}
          setValue={setCarProduction}
          data={radioButtonsProductionData}
          type={'radiobuttonOneButton'}
          current={carProduction}
        />

        {/**
         * modal for car body type
         */}

        <ModalChoose
          title={'Выберите тип кузова'}
          isOpen={modalBodyTypeOpen}
          closeModal={setModalBodyTypeOpen}
          setValue={setCarBodyType}
          data={radioButtonsBodyTypeData}
          type={'radiobuttonOneButton'}
          current={carBodyType}
        />

        {/**
         * modal for car body type
         */}

        <ModalChoose
          title={'Выберите поколение'}
          isOpen={modalGenerationOpen}
          closeModal={setModalGenerationOpen}
          setValue={v => {
            setCarGeneration(v);
            setIsFirstGeneration(false);
          }}
          data={radioButtonsGenerationData}
          type={'radiobuttonOneButton'}
          current={carGeneration}
        />

        {/**
         * modal for car engine type
         */}

        <ModalChoose
          title={'Выберите тип двигателя'}
          isOpen={modalCarEngineTypeOpen}
          closeModal={setModalCarEngineTypeOpen}
          setValue={setCarEngineType}
          data={radioButtonsEngineTypeData}
          type={'radiobuttonOneButton'}
          current={carEngineType}
        />

        {/**
         * modal for car unit type
         */}

        <ModalChoose
          title={'Выберите тип привода'}
          isOpen={modalUnitTypeOpen}
          closeModal={setModalUnitTypeOpen}
          setValue={setCarUnitType}
          data={radioButtonsUnitTypeData}
          type={'radiobuttonOneButton'}
          current={carUnitType}
        />

        {/**
         * modal for car gear type
         */}

        <ModalChoose
          title={'Выберите тип КПП'}
          isOpen={modalGearTypeOpen}
          closeModal={setModalGearTypeOpen}
          setValue={setCarGearType}
          data={radioButtonsGearTypeData}
          type={'radiobuttonOneButton'}
          current={carGearType}
        />

        {/**
         * modal for car color
         */}

        <ModalChoose
          title={'Выберите цвет автомобиля'}
          isOpen={modalCarColor}
          closeModal={setModalCarColor}
          setValue={setCarColor}
          data={radioButtonsCarColorData}
          type={'radiobuttonOneButton'}
          current={carColor}
        />

        <ModalClose
          modalVisible={modalExitVisible}
          dispatch={dispatch}
          setModalVisible={setModalExitVisible}
          nav={navigation}
          backScreen={'AllReportsScreen'}
          needToDelete={isReportEmpty()}
          screenName={route?.name}
        />
      </HeaderBar>
    </SafeAreaView>
  );
};
const mapStateToProps = state => {
  return {
    sectionList: state.appGlobal.sectionList,
    reportTypeId: state.appGlobal.reportType,
    token: state.appGlobal.loginToken,
    reportId: state.appGlobal.reportId,
    menusState: state.appGlobal.openScreen,
  };
};

const mapDispatchToProps = {
  setNewBrandsList: setBrandsList,
  setNewPopularList: setPopularBrandsList,
};
export default connect(mapStateToProps, mapDispatchToProps)(TechnicalCharacteristics);
