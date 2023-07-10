import React, { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, Text, View } from 'react-native';
import { TiresIcon } from '../../../../components/svg';
import { images, theme } from '../../../../сonstants';
const height = Dimensions.get('screen').height;
export const TiresBlock = ({ data }) => {
  const [imgWidth, setImgWidth] = useState(null);
  const [imgHeight, setImgHeight] = useState(null);
  const defaultTire = {
    mark: 'Марка не выбрана',
    model: 'Модель не выбрана',
    sizes: '?/?/R?',
    remainder: 'Остаток: ? мм',
  };
  const [tiresData, setTiresData] = useState({
    front_left: defaultTire,
    front_right: defaultTire,
    rear_left: defaultTire,
    rear_right: defaultTire,
  });
  const parseTires = () => {
    let newTiresData = {}
    Object.keys(tiresData).forEach(column_name => {
      let thisField = Object.values(data)?.find(item => item?.field?.column_name === column_name);

      if (thisField?.val) {
        let tireData = JSON.parse(thisField?.val);
        //console.log('#Y7', column_name, thisField);
        let tireValues = {};
        tireData.forEach(el => {
          //console.log('#Y8', el);
          tireValues[el?.column_name] = el?.val_text ?? el?.val;
        });
        //console.log('#L1', tireValues);
        let newTire = Object.assign({}, defaultTire);
        if (String(tireValues?.tyre_brand_id) !== 'null') {
          newTire.mark = tireValues?.tyre_brand_id;
        }
        if (String(tireValues?.tyre_model_id) !== 'null') {
          newTire.model = tireValues?.tyre_model_id;
        }
        newTire.sizes = ['width', 'profile', 'radius']
          .map(param => {
            let paramStr = '?';
            if (tireValues[param]) {
              //console.log('kk', param);
              paramStr = tireValues[param];
            }
            //console.log(param === 'radius');
            if (param === 'radius') {
              paramStr = 'R' + paramStr;
            }
            return paramStr;
          })
          .join('/');

        if (tireValues?.remainder !== null) {
          newTire.remainder = 'Остаток:' + tireValues?.remainder + ' мм';
        }
        newTiresData[column_name] = newTire;
        //console.log('#L1', newTire);
      }
    });
    setTiresData(newTiresData);
  };
  useEffect(() => {
    parseTires();
  }, []);
  return (
    <>
      <View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {<TiresIcon />}
          <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '500' }}>Шины</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            width: '30%',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ marginTop: imgHeight / 2 - 150 }}>
            <Text style={[theme.FONTS.body_R_L_10]}>
              {Object.values(tiresData?.front_left).join('\n')}
            </Text>
          </View>

          <View style={{ marginBottom: imgHeight / 2 - 110 }}>
            <Text style={[theme.FONTS.body_R_L_10]}>
              {Object.values(tiresData.rear_left).join('\n')}
            </Text>
          </View>
        </View>
        <ImageBackground
          source={images.carTires}
          style={{
            width: '40%',
            height: height / 2,
          }}
          imageStyle={{ width: '100%', resizeMode: 'contain' }}
          onLayout={evt => {
            setImgWidth(evt.nativeEvent.layout.width);
            setImgHeight(evt.nativeEvent.layout.height);
          }}
        />
        <View
          style={{
            width: '30%',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <View style={{ marginTop: imgHeight / 2 - 150 }}>
            <Text style={[theme.FONTS.body_R_L_10]}>
              {Object.values(tiresData?.front_right).join('\n')}
            </Text>
          </View>

          <View style={{ marginBottom: imgHeight / 2 - 110 }}>
            <Text style={[theme.FONTS.body_R_L_10]}>
              {Object.values(tiresData?.rear_right).join('\n')}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};
