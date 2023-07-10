import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';
import { CompletenessIcon1 } from '../../../../components/svg';
export const CompletenessBlock = ({ data }) => {
  const [completenessData, setCompletenessData] = useState({
    keys_count: '',
    completeness_tools: '',
    spare_wheel: '',
    motorist_set: '',
    usage_instruction: '',
  });

  const parseData = () => {
    setCompletenessData(prev => {
      let newData = {};
      Object.keys(prev).forEach(column_name => {
        let value = '';
        if (column_name !== 'usage_instruction') {
          let thisField = Object.values(data)?.find(item => item?.field?.column_name === column_name);
          if (thisField) {
            value = thisField?.sub_field?.value;
          }
        } else {
          value = data.usage_instruction?.val ? 'Есть' : 'Нет';
        }
        newData[column_name] = value;
      });

      return newData;
    });
  };

  useEffect(() => {
    parseData();
  }, []);
  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerView}>
        {<CompletenessIcon1 />}
        <Text style={styles.headerText}>Комплектность</Text>
      </View>
      <View style={styles.pointView}>
        <Text style={styles.pointNameText}>Кол-в ключей:</Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 13 }}>{completenessData?.keys_count}</Text>
        </View>
      </View>
      <View style={styles.pointView}>
        <Text style={styles.pointNameText}>Инструмент:</Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 13 }}>{completenessData?.completeness_tools}</Text>
        </View>
      </View>
      <View style={styles.pointView}>
        <Text style={styles.pointNameText}>Запас. колесо:</Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 13 }}>{completenessData?.spare_wheel}</Text>
        </View>
      </View>
      <View style={styles.pointView}>
        <Text style={styles.pointNameText}>Набор автом.:</Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 13 }}>{completenessData?.motorist_set}</Text>
        </View>
      </View>
      <View style={styles.pointView}>
        <Text style={styles.pointNameText}>Инструкция:</Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 13 }}>{completenessData?.usage_instruction}</Text>
        </View>
      </View>
    </View>
  );
};
