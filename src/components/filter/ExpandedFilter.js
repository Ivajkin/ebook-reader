//#region react components
import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { connect, useSelector } from 'react-redux';
import { global, technicalCharacteristic } from '../../requests';
import { COLORS, icons, theme } from '../../сonstants';
import { ModalChoose, ModalChooseClear } from '../modal';
import FieldFilterModal from './FieldFilterModal';
import RangeSlider from 'rn-range-slider';
import { styles } from './styles';
import Thumb from '../Slider/Thumb';
import Rail from '../Slider/Rail';
import RailSelected from '../Slider/RailSelected';
import Label from '../Slider/Label';
import Notch from '../Slider/Notch';
import { useCallback } from 'react';
import FieldFilterInput from './FilterInput/FieldFilterInput';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native';
import FieldFilterCheckSwitch from './FieldFilterCheckSwitch';
import { FieldPage, FieldModal } from '../fields';

import { initRegions } from '../../redux/App/actions/regionAndCityActions';
import {
  useLazyGetRegionsLikeCitiesQuery,
  useLazyGetRegionsQuery,
} from '../../services/regionsAndCities';
import { setBrandsList, setPopularBrandsList } from "../../redux/App/actions/listsActions";

const defaultFormData = {
  vin: '',
  state_number: '',
  car_type_id: '',
  car_brand_id: '',
  car_model_id: '',
  car_generation_id: '',
  model_year_id: '',
  body_type_id: '',
  engine_type_id: '',
  drive_unit_id: '',
  gearbox_type_id: '',
  engine_volume__low: '',
  engine_volume__high: '',//9474,
  power__low: 1,
  power__high: 8943,
  color_id: '',
  mileage__low: 1000,
  mileage__high: 1500,
  new_car: false,
  emergency: false,
  not_on_go: false,
  for_sale: false,
  price__low: 100,
  price__high: 300000000,
  owner_count: '',
  user_id: '',
};

const carTypeRadioStyles = {
  borderWidth: 2,
  borderWidthActive: 7,
  borderColor: COLORS.lightGray,
  borderColorActive: COLORS.red,
  containerStyle: { width: '100%', paddingTop: 10, paddingBottom: 10 },
};

const ExpandedFilter = ({ route, navigation, regions, initRegionsFilter, setNewBrandsList, setNewPopularList }) => {
  //initRegionsFilter(loadedRegions);
  // const { data, error, isLoading } = useGetRegionsQuery();
  //initRegionsFilter(data);
  //nsole.log('results4', regionsLoaded, error, isLoading);
  const [getRegions] = useLazyGetRegionsQuery();
  const [getRegionsLikeCities] = useLazyGetRegionsLikeCitiesQuery();
  useEffect(() => {
    if (regions.length === 0) {
      getRegions()
        .unwrap()
        .then(data => {
          getRegionsLikeCities()
            .unwrap()
            .then(regionLikeCities => {
              let expandedRegionList = [...data.response.items, ...regionLikeCities.response.items];
              initRegionsFilter(expandedRegionList);
            });
        })
        .catch(err => {
          console.log('get regions error', err);
        });
    }
  }, []);

  const token = useSelector(state => state.appGlobal.loginToken);
  const [formData, setFormData] = useState({ ...defaultFormData });
  const [errors, setErrors] = useState({ ...defaultFormData });
  const onFormDataChange = (value, field) => {
    setFormData(data => {
      return {
        ...data,
        [field]: value,
      };
    });
  };
  const onFormErrorsChange = (value, field) => {
    console.log('ERROR', value);
    setErrors(data => {
      return {
        ...data,
        [field]: value,
      };
    });
  };

  const [ranges, setRanges] = useState({
    engine_volume: { min: 100, max: 1500 },
    mileage: { min: 100, max: 1500 },
    power: { min: 100, max: 1500 },
  });

  const [loaderVisible, setLoaderVisible] = useState(true);

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
  //const [carBrand, setCarBrand] = useState(null);
  //const [carIdBrand, changeCarBrandId] = useState(null);
  const [carBrandsChosen, setCarBrandsChosen] = useState({ forSend: [], forInput: [] });
  const [carBrandsList, setCarBrandsList] = useState(null);
  const [validateBrandFlag, changeValidateBrandFlag] = useState(true);
  const [carBrandPopularList, setCarBrandPopularList] = useState(null);
  const [generationOpenErrors, setGenerationsOpenErrors] = useState([]);

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

  const [isFirstChangeBrand, setIsFirstChangeBrand] = useState(true);
  const [isFirstChangeModel, setIsFirstChangeModel] = useState(true);
  const [isFirstChangeGeneration, setIsFirstGeneration] = useState(true);

  const [modalBodyTypeOpen, setModalBodyTypeOpen] = useState(false);
  const [radioButtonsBodyTypeData, setRadioButtonsBodyTypeData] = useState([]);
  const [carBodyType, setCarBodyType] = useState({ forSend: [], forInput: [] });

  const [carTypeModalOpen, setcarTypeModalOpen] = useState(false);
  const [radioButtonsTypeData, setRadioButtonsTypeData] = useState([]);
  const [carType, setCarType] = useState({ forSend: [], forInput: [] });

  const [modalCarEngineTypeOpen, setModalCarEngineTypeOpen] = useState(false);
  const [radioButtonsEngineTypeData, setRadioButtonsEngineTypeData] = useState([]);
  const [carEngineType, setCarEngineType] = useState({ forSend: [], forInput: [] });

  const [modalUnitTypeOpen, setModalUnitTypeOpen] = useState(false);
  const [radioButtonsUnitTypeData, setRadioButtonsUnitTypeData] = useState([]);
  const [carUnitType, setCarUnitType] = useState({ forSend: [], forInput: [] });

  const [modalGearTypeOpen, setModalGearTypeOpen] = useState(false);
  const [radioButtonsGearTypeData, setRadioButtonsGearTypeData] = useState([]);
  const [carGearType, setCarGearType] = useState({ forSend: [], forInput: [] });

  const [modalCarColor, setModalCarColor] = useState(false);
  const [radioButtonsCarColorData, setRadioButtonsCarColorData] = useState([]);
  const [carColor, setCarColor] = useState({ forSend: [], forInput: [] });

  const [modalUsersOpen, setModalUsersOpen] = useState(false);
  const [radioButtonsUsersData, setRadioButtonsUsersData] = useState([]);
  const [usersListRaw, setUsersListRaw] = useState([]);
  const [chosenUsers, setChosenUsers] = useState({ forSend: [], forInput: [] });

  const reset = () => {
    getFieldsData();
    setFormData({ ...defaultFormData });
    setErrors({ ...defaultFormData });
    //setRadioButtonsBrandData([]);
    setRadioButtonsModelData([]);
    setRadioButtonsGenerationData([]);
    setRadioButtonsProductionData([]);
    setRadioButtonsBodyTypeData([]);
    setRadioButtonsCarColorData([]);
    setRadioButtonsEngineTypeData([]);
    setRadioButtonsGearTypeData([]);
    setRadioButtonsTypeData([]);
    setRadioButtonsUnitTypeData([]);
    setRadioButtonsUsersData([]);

    //setCarBrand(null);
    //changeCarBrandId(null);
    setCarBrandsChosen({ forSend: [], forInput: [] });
    setChosenModels({ forSend: [], forInput: [] });
    setCarGeneration({ forSend: [], forInput: [] });
    setCarProduction({ forSend: [], forInput: [] });
    setCarBodyType({ forSend: [], forInput: [] });
    setCarColor({ forSend: [], forInput: [] });
    setCarEngineType({ forSend: [], forInput: [] });
    setCarGearType({ forSend: [], forInput: [] });
    setCarType({ forSend: [], forInput: [] });
    setCarUnitType({ forSend: [], forInput: [] });
    setChosenUsers({ forSend: [], forInput: [] });
    setFormData({ ...defaultFormData });
  };
  const generateRadioFields = (arr, setGeneratedRadio, assignArray, current) => {
    if (arr) {
      let temp = [];
      let curLabel = '';
      if (current?.forInput?.length > 0) {
        curLabel = current.forInput[0];
      }
      arr.map((item, index) => {
        temp.push(
          Object.assign(
            {
              id: item.id,
              label: item.value,
              value: item.value,
              title: item.value,
              checked: String(item.value) === String(curLabel),
            },
            assignArray
          )
        );
      });
      setGeneratedRadio(temp);
    }
  };

  const [fieldArray, setFieldArray] = useState({
    car_model_id: {
      column_name: 'car_model_id',
      id: 7,
      name: 'Модель',
      pivot: { field_id: 7, report_type_id: 1 },
      required: 2,
      section_id: 1,
    },
    car_brand_id: {
      column_name: 'car_brand_id',
      id: 6,
      name: 'Марка',
      required: 2,
      section_id: 1,
      sub_fields: [],
      tab: null,
      type: 'select-radiobutton',
    },
    car_generation: {
      column_name: 'car_generation',
      id: 10,
      name: 'Поколение',
      required: 2,
      section_id: 1,
      sub_fields: [],
      type: 'select-radiobutton',
    },
    model_year: {
      column_name: 'model_year',
      id: 8,
      name: 'Год выпуска',
      required: 2,
      section_id: 1,
      sub_fields: [],
      type: 'text',
    },
    body_type: {
      column_name: 'body_type',
      id: 9,
      name: 'Тип кузова',
      required: 1,
      section_id: 1,
      type: 'select-radiobutton',
    },
    car_type: {
      column_name: 'car_type',
      id: 5,
      name: 'Тип транспорты',
      required: 1,
      type: 'select-radiobutton',
    },
    engine_type: {
      column_name: 'engine_type',
      id: 11,
      name: 'Тип двигателя',
      required: 1,
      type: 'select-radiobutton',
    },
    drive_unit: {
      column_name: 'drive_unit',
      id: 12,
      name: 'Привод',
      required: 1,
      type: 'select-radiobutton',
    },
    gearbox_type: {
      column_name: 'gearbox_type',
      id: 13,
      name: 'Тип КПП',
      required: 1,
      type: 'select-radiobutton',
    },
    color: {
      column_name: 'color',
      id: 16,
      name: 'Цвет',
      required: 1,
      type: 'select-radiobutton',
    },
  });

  const chosen_users_pseudo_field = {
    column_name: 'chosen_users',
    id: '',
    name: 'Кто составил отчет',
    required: 1,
    type: 'select-radiobutton',
  };

  function getBrandsList() {
    technicalCharacteristic
      .getBrandsListApi(token)
      .then(res => {
        if (res) {
          if (res.data.data.length > 0) {
            let temporary = [];
            //let temporaryId = [];
            res.data.data.map((item, index) => {
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
        console.log('\n\n\nError GetBrands', err);
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
            //  setCarBrandPopularListId(temporaryId);
          }
        }
      })
      .catch(err => {
        console.log('\n\n\nError GetBrands', err);
      });
  }

  function getModelsList(brands) {
    Promise.all(brands.map(brand => technicalCharacteristic.getModelsListApi(brand, token)))
      .then(res => {
        let allModels = res.map(modalsListResponse => {
          if (modalsListResponse) {
            if (modalsListResponse?.data?.data?.length > 0) {
              return modalsListResponse.data.data;
            }
          }
        });
        allModels = allModels.flat();
        setModelListRaw(allModels);
      })
      .catch(e => console.log('Error GetModels', e.message, e?.response?.data));
  }

  useEffect(() => {
    generateRadioFields(modelListRaw, setRadioButtonsModelData, carTypeRadioStyles, {
      forInput: [chosenModels],
    });
    setRadioButtonsProductionData([]);
    setCarGeneration({ forSend: [], forInput: [] });
    setCarProduction({ forSend: [], forInput: [] });
    if (chosenModels.forInput.length > 0) {
      setGenerationsOpenErrors([]);
      setYearsOpenErrors([]);
    }
  }, [modelListRaw, chosenModels]);

  function getUsersList() {
    technicalCharacteristic
      .getUsersListApi(token)
      .then(res => {
        if (res) {
          if (res.data.length > 0) {
            let temp = [];
            res.data.map((item, index) => {
              temp.push({ id: item.id, value: item.name });
            });
            setUsersListRaw(temp);
          }
        }
      })
      .catch(err => {
        console.log('\n\n\nError GetUsersList', err);
      });
  }

  useEffect(() => {
    generateRadioFields(usersListRaw, setRadioButtonsUsersData, carTypeRadioStyles, {
      forInput: [chosenUsers],
    });
  }, [usersListRaw, chosenUsers]);

  function getGenerationList() {
    if (chosenModels?.forSend.length > 0) {
      Promise.all(
        chosenModels.forSend.map(model => technicalCharacteristic.getGenerationListApi(model, token))
      )
        .then(res => {
          let allGenerations = res.map(genListResponse => {
            if (genListResponse) {
              if (genListResponse?.data?.data?.length > 0) {
                let resTemp = [...genListResponse.data.data];
                let reg = /^[0-9]{4}\s{0,}\-{1}\s{0,}[0-9]{4}$/gm;
                resTemp.map(generationItem => {
                  if (!generationItem.value.match(reg)) {
                    generationItem.value = `${generationItem.value} (${generationItem.year_from} - ${generationItem.year_to})`;
                  }
                });
                return resTemp;
              }
            }
          });
          allGenerations = allGenerations.flat();
          setYearData(allGenerations);
          setGenerationListRaw(allGenerations);
        })
        .catch(e => console.log('Error GetGenerations&Years', e.message, e?.response?.data));
    }
  }

  useEffect(() => {
    generateRadioFields(
      generationListRaw,
      setRadioButtonsGenerationData,
      carTypeRadioStyles,
      carGeneration
    );
    if (carGeneration.forInput.length > 0) {
      setYearsOpenErrors([]);
    }
    setCarProduction({ forSend: [], forInput: [] });
  }, [generationListRaw, carGeneration]);

  function generateYearsRange() {
    let temporary = [];
    carGeneration.forSend.map(generationId => {
      yearData.forEach((item, index) => {
        if (item.id === generationId) {
          for (let i = parseInt(item.year_from); i <= parseInt(item.year_to); i++) {
            temporary.push({ id: i, value: i });
          }
        }
      });
    });
    generateRadioFields(temporary, setRadioButtonsProductionData, carTypeRadioStyles, carProduction);
  }

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
      item.sub_fields.length > 0 ? (temporary[item.column_name] = item.sub_fields) : '';
    });

    Object.keys(fieldsSetArray).map((item, index) => {
      generateRadioFields(
        temporary[item],
        fieldsSetArray[item],
        carTypeRadioStyles,
        currentValues[item]
      );
    });
  }

  function getFieldsData(flag = false) {
    global
      .getFields(1, 1, token)
      .then(res => {
        if (res) {
          generateRadioData(res.data.data);
          setLoaderVisible(false);
          if (res?.data?.data?.length > 0) {
            let temporary = {};
            res.data.data.map((item, index) => {
              temporary[item.column_name] = item;
            });

            setFieldArray(temporary);
          }
        }
      })
      .catch(err => {
        // globalFunctions.catchGetFieldsErrorNavMain(setLoaderVisible, navigation);
        console.log('\n\n\nError GetFields', err);
      });
    global
      .getFieldsRanges(token)
      .then(res => {
        if (res) {
          setRanges(res.data.data);
        }
      })
      .catch(err => {
        // globalFunctions.catchGetFieldsErrorNavMain(setLoaderVisible, navigation);
        console.log('\n\n\nError GetFieldsRanges, expanded filter', err);
      });
  }

  useEffect(() => {
    setFormData(data => {
      return {
        ...data,
        engine_volume__low: ranges?.engine_volume?.min,
        engine_volume__high: ranges?.engine_volume?.max,
        power__low: ranges?.power?.min,
        power__high: ranges?.power?.max,
        mileage__low: ranges?.mileage?.min,
        mileage__high: ranges?.mileage?.max,
      };
    });
  }, [ranges]);

  useEffect(() => {
    getFieldsData();
    getBrandsList();
    getUsersList();
  }, []);

  useEffect(()=>{
    getBrandsList();
    getUsersList();
  },[route])

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
  useEffect(() => {
    onFormDataChange('', 'car_model_id');
    onFormDataChange('', 'car_generation_id');
    onFormDataChange('', 'model_year_id');
    if (formData?.car_brand_id?.forSend?.length) {
      getModelsList(formData.car_brand_id.forSend);
    } else {
      setRadioButtonsModelData([]);
    }
  }, [formData.car_brand_id]);

  useEffect(() => {
    onFormDataChange('', 'car_generation_id');
    onFormDataChange('', 'model_year_id');
    if (formData?.car_model_id?.forSend?.length) {
      getGenerationList(formData?.car_model_id?.forSend);
    } else {
      setRadioButtonsGenerationData([]);
    }
  }, [formData.car_model_id]);

  useEffect(() => {
    onFormDataChange('', 'model_year_id');
    if (formData.car_generation_id?.forSend?.length && yearData) {
      generateYearsRange(formData.car_generation_id.forSend);
    } else {
      setRadioButtonsProductionData([]);
    }
  }, [formData.car_generation_id, yearData]);

  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback(value => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const handleValueChangeEngingVolume = useCallback((low, high) => {
    onFormDataChange(low, 'engine_volume__low');
    onFormDataChange(high, 'engine_volume__high');
  }, []);
  const handleValueChangePower = useCallback((low, high) => {
    onFormDataChange(low, 'power__low');
    onFormDataChange(high, 'power__high');
  }, []);
  const handleValueChangeMileage = useCallback((low, high) => {
    onFormDataChange(low, 'mileage__low');
    onFormDataChange(high, 'mileage__high');
  }, []);
  const handleValueChangePrice = useCallback((low, high) => {
    onFormDataChange(low, 'price__low');
    onFormDataChange(high, 'price__high');
  }, []);

  useEffect(() => {
    if (chooseCarModelId) {
      getGenerationList();
    }
  }, [chooseCarModelId, route]);

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

  useEffect(() => {
    if (carBrandsChosen.forSend.length > 0) {
      getModelsList(carBrandsChosen.forSend);
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
      if (carBrandsChosen.forSend.length > 0) {
        setModelOpenErrors([]);
        setGenerationsOpenErrors([]);
        setYearsOpenErrors([]);
      }
    }
  }, [carBrandsChosen]);

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

  const setModalOpenCarModeWithValidation = value => {
    if (value) {
      if (carBrandsChosen.forSend.length > 0) {
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
      if (carBrandsChosen.forSend.length === 0) {
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
      if (carBrandsChosen.forSend.length === 0) {
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
  return (
    <SafeAreaView style={{ width: '100%', height: '100%' }}>
      <View style={styles.headerBrandWrapper}>
        <TouchableOpacity style={styles.headerBrandBackWrapper} onPress={() => navigation.goBack()}>
          <Image source={icons.backImg} style={styles.headerBrandBackImage} />
        </TouchableOpacity>
        <Text style={{ fontWeight: '400', fontSize: 17, lineHeight: 28, color: '#333333' }}>
          Расширенный фильтр
        </Text>
        <TouchableOpacity
          style={styles.headerImageWrapper}
          onPress={() => {
            reset();
          }}
        >
          <Text style={{ fontWeight: '400', fontSize: 14, lineHeight: 20, color: '#FF3B30' }}>
            Сбросить
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ marginBottom: 55, paddingHorizontal: 15 }}>
        <View>
          <FieldFilterInput
            upperCased={true}
            field={'VIN'}
            value={formData.vin}
            setValue={v => onFormDataChange(v, 'vin')}
          />
        </View>
        <View>
          <FieldFilterInput
            field={'Гос. номер'}
            value={formData.state_number}
            setValue={v => onFormDataChange(v, 'state_number')}
          />
        </View>

        <View>
          <FieldModal
            field={fieldArray?.car_type}
            value={carType} //formData.car_type_id
            showModal={setcarTypeModalOpen}
          />
        </View>
        <View>
          <FieldModal
            field={fieldArray?.car_brand_id}
            value={carBrandsChosen}
            showModal={() => {
              navigation.navigate('BrandChoose', {
                currentBrands: carBrandsChosen ?? '',
                changeCarBrand: v => {
                  //setCarBrand(v);
                  setCarBrandsChosen(v);
                  setIsFirstChangeBrand(false);
                  onFormDataChange(v.forSend, 'car_brand_id');
                },
                //currentBrandId: carBrandsChosen, //carIdBrand ?? '',
                //changeCarBrandId,
                //brandList: carBrandsList,
                //brandPopularList: carBrandPopularList,
                singleChoice: false,
              });
            }}
            //validateFlag={validateGenerationFlag}
            //setValidate={changeValidateGenerationFlag}
          />
        </View>
        <View>
          <FieldModal
            field={fieldArray?.car_model_id}
            value={chosenModels}
            showModal={setModalOpenCarModeWithValidation}
            //validateFlag={validateGenerationFlag}
            //setValidate={changeValidateGenerationFlag}
          />
          {modelOpenErrors.length > 0 ? (
            <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
              {modelOpenErrors.join('\n')}
            </Text>
          ) : (
            <></>
          )}
        </View>
        <View>
          <FieldModal
            field={{ ...fieldArray?.car_generation, required: 0 }}
            value={carGeneration}
            showModal={setGenerationsOpenCarModeWithValidation}
            validateFlag={validateGenerationFlag}
            setValidate={changeValidateGenerationFlag}
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
            field={{ ...fieldArray?.model_year, required: 0 }}
            value={carProduction}
            showModal={setYearsOpenCarModeWithValidation}
            validateFlag={validateYearFlag}
            setValidate={changeValidateYearFlag}
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
            validateFlag={!errors.body_type_id}
            //setValidate={e => onFormErrorsChange(e, 'body_type_id')}
          />
        </View>

        <View>
          <FieldModal
            field={fieldArray?.engine_type}
            value={carEngineType}
            showModal={setModalCarEngineTypeOpen}
          />
        </View>

        <View>
          <FieldModal
            field={fieldArray?.drive_unit}
            value={carUnitType}
            showModal={setModalUnitTypeOpen}
          />
        </View>

        <View>
          <FieldModal
            field={fieldArray?.gearbox_type}
            value={carGearType}
            showModal={setModalGearTypeOpen}
          />
        </View>

        <View>
          <Text style={{ color: '#858585',}}>Объем двигателя, см3</Text>
          {/*<RangeSlider*/}
          {/*  style={styles.slider}*/}
          {/*  min={+ranges.engine_volume.min}*/}
          {/*  max={+ranges.engine_volume.max}*/}
          {/*  step={*/}
          {/*    +ranges.engine_volume.max - +ranges.engine_volume.min < 10000*/}
          {/*      ? 500*/}
          {/*      : +ranges.engine_volume.max - +ranges.engine_volume.min < 50000*/}
          {/*      ? 2000*/}
          {/*      : +ranges.engine_volume.max - +ranges.engine_volume.min < 100000*/}
          {/*      ? 5000*/}
          {/*      : 10000*/}
          {/*  }*/}
          {/*  low={formData.engine_volume__low}*/}
          {/*  high={formData.engine_volume__high}*/}
          {/*  floatingLabel*/}
          {/*  renderThumb={renderThumb}*/}
          {/*  renderRail={renderRail}*/}
          {/*  renderRailSelected={renderRailSelected}*/}
          {/*  renderLabel={renderLabel}*/}
          {/*  renderNotch={renderNotch}*/}
          {/*  onValueChanged={handleValueChangeEngingVolume}*/}
          {/*/>*/}

          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
            <View style={{ flex: 50 }}>
              <FieldFilterInput
                field={`От`}
                value={formData?.engine_volume__low?.toString()}
                setValue={v => onFormDataChange(v, 'engine_volume__low')}
                fieldType={'numeric'}
                maxLength={20}
              />
            </View>
            <Text style={{ width: 25, textAlign: 'center' }}>-</Text>
            <View style={{ flex: 50 }}>
              <FieldFilterInput
                field={`до`}
                //value={formData?.engine_volume__high?.toString()}
                setValue={v => onFormDataChange(v, 'engine_volume__high')}
                fieldType={'numeric'}
                maxLength={20}
              />
            </View>
          </View>
        </View>

        <View>
          <Text style={{ color: '#858585' }}>Мощность</Text>
          {/*<RangeSlider*/}
          {/*  style={styles.slider}*/}
          {/*  min={+ranges.power.min}*/}
          {/*  max={+ranges.power.max}*/}
          {/*  step={*/}
          {/*    +ranges.power.max - +ranges.power.min < 10000*/}
          {/*      ? 500*/}
          {/*      : +ranges.power.max - +ranges.power.min < 50000*/}
          {/*      ? 2000*/}
          {/*      : +ranges.power.max - +ranges.power.min < 100000*/}
          {/*      ? 5000*/}
          {/*      : 10000*/}
          {/*  }*/}
          {/*  low={formData.power__low}*/}
          {/*  high={formData.power__high}*/}
          {/*  floatingLabel*/}
          {/*  renderThumb={renderThumb}*/}
          {/*  renderRail={renderRail}*/}
          {/*  renderRailSelected={renderRailSelected}*/}
          {/*  renderLabel={renderLabel}*/}
          {/*  renderNotch={renderNotch}*/}
          {/*  onValueChanged={handleValueChangePower}*/}
          {/*/>*/}

          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
            <View style={{ flex: 50 }}>
              <FieldFilterInput
                field={`От`}
                //value={formData?.power__low?.toString()}
                setValue={v => onFormDataChange(v, 'power__low')}
                fieldType={'numeric'}
                maxLength={20}
              />
            </View>
            <Text style={{ width: 25, textAlign: 'center' }}>-</Text>
            <View style={{ flex: 50 }}>
              <FieldFilterInput
                field={`до`}
                //value={formData?.power__high?.toString()}
                setValue={v => onFormDataChange(v, 'power__high')}
                fieldType={'numeric'}
                maxLength={20}
              />
            </View>
          </View>
        </View>

        <View>
          <FieldModal field={fieldArray?.color} value={carColor} showModal={setModalCarColor} />
        </View>

        <View>
          <Text style={{ color: '#858585' }}>Пробег по одометру, км</Text>
          {/*<RangeSlider*/}
          {/*  style={styles.slider}*/}
          {/*  min={+ranges.mileage.min}*/}
          {/*  max={+ranges.mileage.max}*/}
          {/*  step={*/}
          {/*    +ranges.mileage.max - +ranges.mileage.min < 10000*/}
          {/*      ? 500*/}
          {/*      : +ranges.mileage.max - +ranges.mileage.min < 50000*/}
          {/*      ? 2000*/}
          {/*      : +ranges.mileage.max - +ranges.mileage.min < 100000*/}
          {/*      ? 5000*/}
          {/*      : 10000*/}
          {/*  }*/}
          {/*  low={formData.mileage__low}*/}
          {/*  high={formData.mileage__high}*/}
          {/*  floatingLabel*/}
          {/*  renderThumb={renderThumb}*/}
          {/*  renderRail={renderRail}*/}
          {/*  renderRailSelected={renderRailSelected}*/}
          {/*  renderLabel={renderLabel}*/}
          {/*  renderNotch={renderNotch}*/}
          {/*  onValueChanged={handleValueChangeMileage}*/}
          {/*/>*/}

          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <View style={{ flex: 50 }}>
              <FieldFilterInput
                field={`От `}
                //value={formData?.mileage__low?.toString()}
                setValue={v => onFormDataChange(v, 'mileage__low')}
                fieldType={'numeric'}
                maxLength={20}
              />
            </View>
            <Text style={{ width: 25, textAlign: 'center' }}>-</Text>
            <View style={{ flex: 50 }}>
              <FieldFilterInput
                field={`до`}
                //value={formData?.mileage__high?.toString()}
                setValue={v => onFormDataChange(v, 'mileage__high')}
                fieldType={'numeric'}
                maxLength={20}
              />
            </View>
          </View>
        </View>

        <View>
          <FieldFilterCheckSwitch
            field={'Новый а/м'}
            value={formData.new_car}
            setValue={v => onFormDataChange(v, 'new_car')}
            type={'switch'}
            style={{ marginTop: 10 }}
          />
        </View>

        <View>
          <FieldFilterCheckSwitch
            field={'Аварийный'}
            value={formData.emergency}
            setValue={v => onFormDataChange(v, 'emergency')}
            type={'switch'}
            style={{ marginTop: 10 }}
          />
        </View>

        <View>
          <FieldFilterCheckSwitch
            field={'Не на ходу'}
            value={formData.not_on_go}
            setValue={v => onFormDataChange(v, 'not_on_go')}
            type={'switch'}
            style={{ marginTop: 10 }}
          />
        </View>

        <View>
          <FieldFilterCheckSwitch
            field={'Продается'}
            value={formData.for_sale}
            setValue={v => onFormDataChange(v, 'for_sale')}
            type={'switch'}
            style={{ marginTop: 10 }}
          />
        </View>
        {formData.for_sale ? (
          <View >
            {/*<RangeSlider*/}
            {/*  style={styles.slider}*/}
            {/*  min={100}*/}
            {/*  max={300000000}*/}
            {/*  step={10000}*/}
            {/*  low={formData.price__low}*/}
            {/*  high={formData.price__high}*/}
            {/*  floatingLabel*/}
            {/*  renderThumb={renderThumb}*/}
            {/*  renderRail={renderRail}*/}
            {/*  renderRailSelected={renderRailSelected}*/}
            {/*  renderLabel={renderLabel}*/}
            {/*  renderNotch={renderNotch}*/}
            {/*  onValueChanged={handleValueChangePrice}*/}
            {/*/>*/}
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <View style={{ flex: 50 }}>
                <FieldFilterInput
                  field={'От'}
                  //value={formData.price__low.toString()}
                  setValue={v => onFormDataChange(v, 'price__low')}
                  fieldType={'numeric'}
                  maxLength={20}
                />
              </View>
              <Text style={{ width: 25, textAlign: 'center' }}>-</Text>
              <View style={{ flex: 50 }}>
                <FieldFilterInput
                  field={'до'}
                  //value={formData.price__high.toString()}
                  setValue={v => onFormDataChange(v, 'price__high')}
                  fieldType={'numeric'}
                  maxLength={20}
                />
              </View>
            </View>
          </View>
        ) : null}
        <View>
          <FieldFilterInput
            field={'Количество владельцев'}
            //value={formData?.owner_count?.toString()}
            setValue={v => onFormDataChange(v, 'owner_count')}
            fieldType={'numeric'}
            maxLength={20}
          />
        </View>
        <View>
          <FieldModal
            field={chosen_users_pseudo_field}
            value={chosenUsers}
            showModal={setModalUsersOpen}
          />
        </View>
        <View>
          <FieldPage
            //key={i}
            count={null}
            field={{ name: 'Город и регион', required: 0, count: 1 }}
            validateFlag={true}
            navigate={() => navigation.navigate('RegionAndCityFilter')}
            //validateFlag={fieldsArray[item].validateFlag}
          />
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
        <TouchableOpacity
          onPress={() => {
            let isError = true;
            if (carBrandsChosen.forSend.length > 0 && chosenModels.forInput.length > 0) {
              isError = false;
            }
            if (!isError) {
              navigation.navigate('SearchResult', {
                filter: formData,
              });
              reset();
            }
          }}
          style={styles.findBtnWrapper}
        >
          <Text style={styles.findBtnText}>Найти</Text>
        </TouchableOpacity>
      </View>

      <ModalChoose
        title={'Выберите модель транспорта'}
        isOpen={modalOpenCarModel}
        closeModal={setModalOpenCarModel}
        setValue={v => {
          setChosenModels(v);
          if (v.forInput?.length > 0) {
            setChooseCarModel(v.forInput[0]);
            onFormDataChange(v, 'car_model_id');
            setChooseCarModelId(v.forSend[0]);
          }
          setIsFirstChangeModel(false);

          //onFormDataChange(v, 'car_model_id');
        }}
        data={radioButtonsModelData}
        //type={'radiobuttonOneButton'}
        type={'select-checkbox'}
        current={chosenModels}
      />

      {/**
       * modal for car production
       */}

      <ModalChoose
        title={'Выберите год выпуска транспорта'}
        isOpen={modalProductionOpen}
        closeModal={setModalProductionOpen}
        setValue={v => {
          setCarProduction(v);
          onFormDataChange(v, 'model_year_id');
        }}
        data={radioButtonsProductionData}
        //type={'radiobuttonOneButton'}
        type={'select-checkbox'}
        current={carProduction}
      />

      {/**
       * modal for car generation
       */}

      <ModalChoose
        title={'Выберите поколение'}
        isOpen={modalGenerationOpen}
        closeModal={setModalGenerationOpen}
        setValue={v => {
          setCarGeneration(v);
          onFormDataChange(v, 'car_generation_id');
          setIsFirstGeneration(false);
        }}
        data={radioButtonsGenerationData}
        //type={'radiobuttonOneButton'}
        type={'select-checkbox'}
        current={carGeneration}
      />
      <ModalChoose
        title={'Выберите тип кузова'}
        isOpen={modalBodyTypeOpen}
        closeModal={setModalBodyTypeOpen}
        setValue={v => {
          setCarBodyType(v);
          onFormDataChange(v, 'body_type_id');
        }}
        data={radioButtonsBodyTypeData}
        type={'select-checkbox'}
        current={carBodyType}
      />

      <ModalChoose
        title={'Выберите тип транспорта'}
        isOpen={carTypeModalOpen}
        closeModal={setcarTypeModalOpen}
        setValue={v => {
          setCarType(v);
          onFormDataChange(v, 'car_type_id');
        }}
        data={radioButtonsTypeData}
        type={'select-checkbox'}
        current={carType}
      />

      <ModalChoose
        title={'Выберите тип двигателя'}
        isOpen={modalCarEngineTypeOpen}
        closeModal={setModalCarEngineTypeOpen}
        setValue={v => {
          setCarEngineType(v);
          onFormDataChange(v, 'engine_type_id');
        }}
        data={radioButtonsEngineTypeData}
        type={'select-checkbox'}
        current={carEngineType}
      />

      <ModalChoose
        title={'Выберите тип привода'}
        isOpen={modalUnitTypeOpen}
        closeModal={setModalUnitTypeOpen}
        setValue={v => {
          setCarUnitType(v);
          onFormDataChange(v, 'drive_unit_id');
        }}
        data={radioButtonsUnitTypeData}
        type={'select-checkbox'}
        current={carUnitType}
      />

      <ModalChoose
        title={'Выберите тип КПП'}
        isOpen={modalGearTypeOpen}
        closeModal={setModalGearTypeOpen}
        setValue={v => {
          setCarGearType(v);
          onFormDataChange(v, 'gearbox_type_id');
        }}
        data={radioButtonsGearTypeData}
        type={'select-checkbox'}
        current={carGearType}
      />

      <ModalChoose
        title={'Выберите цвет'}
        isOpen={modalCarColor}
        closeModal={setModalCarColor}
        setValue={v => {
          setCarColor(v);
          onFormDataChange(v, 'color_id');
        }}
        data={radioButtonsCarColorData}
        type={'select-checkbox'}
        current={carColor}
      />

      <ModalChoose
        title={'Выберите пользователя'}
        isOpen={modalUsersOpen}
        closeModal={setModalUsersOpen}
        setValue={v => {
          setChosenUsers(v);
          onFormDataChange(v, 'user_id');
        }}
        data={radioButtonsUsersData}
        type={'select-checkbox'}
        current={chosenUsers}
      />
    </SafeAreaView>
  );
};
const mapDispatchToProps = {
  initRegionsFilter: initRegions,
  setNewBrandsList: setBrandsList,
  setNewPopularList: setPopularBrandsList,
};

const mapStateToProps = state => {
  return {
    regions: state.regions.regions,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ExpandedFilter);
