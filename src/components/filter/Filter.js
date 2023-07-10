//#region react components
import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { connect, useSelector } from 'react-redux';
import { global, technicalCharacteristic } from '../../requests';
import { globalFunctions } from '../../utils';
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
import { ScrollView } from 'react-native-gesture-handler';
import { FieldModal } from '../fields';
import { setBrandsList, setPopularBrandsList } from '../../redux/App/actions/listsActions';

const defaultFormData = {
  car_brand_id: '',
  car_model_id: '',
  car_generation_id: '',
  model_year_id: '',
  body_type_id: '',
  price__low: 100000,
  price__high: 300000000,
};

const carTypeRadioStyles = {
  borderWidth: 2,
  borderWidthActive: 7,
  borderColor: COLORS.lightGray,
  borderColorActive: COLORS.red,
  containerStyle: { width: '100%', paddingTop: 10, paddingBottom: 10 },
};

const Filter = ({ route, navigation, setNewBrandsList, setNewPopularList}) => {
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
    setErrors(data => {
      return {
        ...data,
        [field]: value,
      };
    });
  };

  const [loaderVisible, setLoaderVisible] = useState(true);

  /**
   * constants for car body type
   */
  const [carBodyType, setCarBodyType] = useState({ forSend: [], forInput: [] });
  const [modalBodyTypeOpen, setModalBodyTypeOpen] = useState(false);
  const [radioButtonsBodyTypeData, setRadioButtonsBodyTypeData] = useState([]);
  const [validateBodyFlag, changeValidateBodyFlag] = useState(true);

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
  const [carBrandsChosen, setCarBrandsChosen] = useState({ forSend: [], forInput: [] });
  //const [carIdBrand, changeCarBrandId] = useState(null);
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

  const reset = () => {
    setFormData({ ...defaultFormData });
    setErrors({ ...defaultFormData });

    setRadioButtonsModelData([]);
    setRadioButtonsGenerationData([]);
    setRadioButtonsProductionData([]);
    setRadioButtonsBodyTypeData([]);

    //setCarBrand(null);
    //changeCarBrandId(null);
    setCarBrandsChosen({ forSend: [], forInput: [] });
    //setIsFirstChangeBrand(false);
    setChosenModels({ forSend: [], forInput: [] });
    setCarGeneration({ forSend: [], forInput: [] });
    setCarProduction({ forSend: [], forInput: [] });
    setCarBodyType({ forSend: [], forInput: [] });
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
  });

  /**
   * generate redio data for elements
   */

  function generateRadioData(data) {
    const fieldsSetArray = {
      body_type: setRadioButtonsBodyTypeData,
    };
    let currentValues = {
      body_type: carBodyType,
    };
    let temporary = {};
    data.map((item, index) => {
      item.sub_fields.length > 0 ? (temporary[item.column_name] = item.sub_fields) : '';
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
        setLoaderVisible(false);
        console.log('\n\n\nError GetFieldsData, filter', err);
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
              temporary.push([item.id, item.value, item.logo]);
              // temporaryId.push(item.id);
            });
            //console.log('#F2', temporary.length);
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
            //setCarBrandPopularList(temporary);
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

    // technicalCharacteristic
    //   .getModelsListApi(brands[0], token)
    //   .then(res => {
    //     console.log('res', res);
    //     if (res) {
    //       if (res.data.data.length > 0) {
    //         console.log('#A15', res.data.data);
    //         let temp = [];
    //         res.data.data.map((item, index) => {
    //           if (item?.models?.length) {
    //             temp = [...temp, ...item.models];
    //           }
    //         });
    //         setModelListRaw(temp);
    //         // generateRadioFields(temp, setRadioButtonsModelData, carTypeRadioStyles);
    //       }
    //     }
    //   })
    //   .catch(err => {
    //     //console.log('\n\n\nError GetBrands', err);
    //   });
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

  useEffect(() => {
    reset();
    getFieldsData();
    getBrandsList();
  }, []);

  useEffect(()=>{
    getBrandsList()
  },[route])

  function generateYearsRange() {
    let temporary = [];
    carGeneration.forSend.map(generationId => {
      yearData.forEach((item, index) => {
        if (item.id === generationId) {
          for (let i = parseInt(item.year_from); i <= parseInt(item.year_to); i++) {
            temporary.push({ id: i, value: i });
          }
        }
        //return temporary;
      });
    });

    generateRadioFields(temporary, setRadioButtonsProductionData, carTypeRadioStyles, carProduction);
  }

  /**
   * function for get generation and years list based on model
   */
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
    if (chooseCarModelId) {
      getGenerationList();
    }
  }, [chooseCarModelId, route]);

  /**
   * useeffect for year generate
   */
  useEffect(() => {
    return yearData && carGeneration.forSend.length > 0 ? generateYearsRange() : '';
  }, [carGeneration, yearData]);

  // useEffect(() => {
  //   if (carIdBrand) {
  //     getModelsList([carIdBrand]);

  //     if (!isFirstChangeBrand) {
  //       // console.log('#22');
  //       setCarProduction({ forSend: [], forInput: [] });
  //       setCarGeneration({ forSend: [], forInput: [] });
  //       setChosenModels({ forSend: [], forInput: [] });
  //       setChooseCarModel(null);
  //       setChooseCarModelId(null);
  //       setRadioButtonsModelData([]);
  //       setRadioButtonsProductionData([]);
  //       setRadioButtonsGenerationData([]);
  //     }
  //     if (carBrand !== null) {
  //       setModelOpenErrors([]);
  //       setGenerationsOpenErrors([]);
  //       setYearsOpenErrors([]);
  //     }
  //   }
  // }, [carIdBrand]);

  // useEffect(() => {
  //   if (carIdBrand) {
  //     getModelsList([carIdBrand]);
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
  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback(value => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const handleValueChange = useCallback((low, high) => {
    formData.price__high;
    onFormDataChange(low, 'price__low');
    onFormDataChange(high, 'price__high');
  }, []);

  return (
    <View style={{ width: '100%', height: '100%', paddingHorizontal: 15 }}>
      <ScrollView>
        <View>
          {fieldArray?.car_brand_id && fieldArray?.car_brand_id !== null && (
            <FieldModal
              field={fieldArray?.car_brand_id}
              value={carBrandsChosen}
              showModal={() => {
                navigation.navigate('BrandChoose', {
                  currentBrands: carBrandsChosen ?? '',
                  changeCarBrand: v => {
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
          )}
          {fieldArray?.car_model_id && fieldArray?.car_model_id !== null && (
            <View>
              <FieldModal
                field={{ ...fieldArray?.car_model_id, required: 2 }}
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
          )}
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
              field={{ ...fieldArray?.model_year, required: 2 }}
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
              field={fieldArray?.body_type}
              value={carBodyType}
              showModal={setModalBodyTypeOpen}
              validateFlag={validateBodyFlag}
              setValidate={changeValidateBodyFlag}
            />
          </View>
        </View>
        <View>
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
          {/*  onValueChanged={handleValueChange}*/}
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
                //value={"200"}
                setValue={v => onFormDataChange(v, 'price__high')}
                fieldType={'numeric'}
                maxLength={20}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ExpandedFilter', {
              formData: formData,
              errors: errors,
            });
          }}
          style={{ marginBottom: 70 }}
        >
          <View>
            <Text
              style={{
                textAlign: 'center',
                color: '#FF3B30',
                marginTop: 30,
                fontWeight: '500',
                fontSize: 15,
                lineHeight: 36,
              }}
            >
              Расширенный фильтр
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
        <TouchableOpacity
          onPress={() => {
            let isError = true;
            if (
              carBrandsChosen.forSend.length > 0 &&
              chosenModels.forInput.length > 0 &&
              carGeneration.forSend.length > 0 &&
              carProduction.forSend.length > 0
            ) {
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

      {/* <ModalChoose
        title={'Выберите бренд транспорта'}
        isOpen={modalBrandOpen}
        closeModal={setModalBrandOpen}
        setValue={v => {
          setChosenBrands(v);
          onFormDataChange(v, 'car_brand_id');
        }}
        data={radioButtonsBrandData}
        type={'select-checkbox'}
        current={chosenBrands}
      /> */}

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
            setChooseCarModel(v.forInput);
            onFormDataChange(v, 'car_model_id');
            setChooseCarModelId(v.forSend);
          }
          setIsFirstChangeModel(false);
        }}
        data={radioButtonsModelData}
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
       * modal for car body type
       */}

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
    </View>
  );
};
const mapDispatchToProps = {
  setNewBrandsList: setBrandsList,
  setNewPopularList: setPopularBrandsList,
};
export default connect(null, mapDispatchToProps)(Filter);
