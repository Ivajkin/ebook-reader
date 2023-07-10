import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';
export const DocumentsBlock = ({ data }) => {
  const [docsData, setDocsData] = useState({
    pts: '',
    sts: '',
    comment: '',
  });

  const parseData = () => {
    let ptsData = JSON.parse(data['101']?.val);
    console.log(ptsData);
    let stsData = JSON.parse(data['102']?.val);
    let absentPTS = ptsData?.find(el => el?.column_name === 'without_PTS')?.val ?? false;
    let ptsString = '';
    if (absentPTS) {
      ptsString = 'Отсутствует';
    } else {
      let ptsSeria = ptsData?.find(el => el?.column_name === 'pts_seria')?.val ?? '';
      let ptsNumber = ptsData?.find(el => el?.column_name === 'pts_number')?.val ?? '';
      let ptsOriginal = !ptsData?.find(el => el?.column_name === 'pts_duplicate')?.val ?? true;

      ptsString = `${ptsSeria} №${ptsNumber} ${ptsOriginal ? '(оригинал)' : ''}`;
    }

    let absentSTS = ptsData?.find(el => el?.column_name === 'without_STS')?.val ?? false;
    let stsString = '';
    if (absentSTS) {
      stsString = 'Отсутствует';
    } else {
      let stsSeria = stsData?.find(el => el?.column_name === 'sts_seria')?.val ?? '';
      let stsNumber = stsData?.find(el => el?.column_name === 'sts_number')?.val ?? '';
      let stsOriginal = !stsData?.find(el => el?.column_name === 'sts_duplicate')?.val ?? true;

      stsString = `${stsSeria} №${stsNumber} ${stsOriginal ? '(оригинал)' : ''}`;
    }

    let comments = JSON.parse(data['104'].val).find(el => !!el.val).val ?? '';

    setDocsData({
      pts: ptsString,
      sts: stsString,
      comment: comments,
    });
  };

  useEffect(() => {
    parseData();
  }, []);
  return (
    <View style={styles.mainContainer}>
      <View style={styles.singleDocView}>
        <Text style={styles.docNameText}>ПТС:</Text>
        <View style={styles.singleDocDataView}>
          <Text style={{ fontSize: 13 }}>{docsData.pts}</Text>
        </View>
      </View>
      <View style={styles.singleDocView}>
        <Text style={styles.docNameText}>СТС:</Text>
        <View style={styles.singleDocDataView}>
          <Text style={{ fontSize: 13 }}>{docsData.sts}</Text>
        </View>
      </View>
      <View style={styles.singleDocView}>
        <Text style={styles.docNameText}>Комментар. :</Text>
        <View style={styles.singleDocDataView}>
          <Text style={{ fontSize: 13 }}>{docsData.comment}</Text>
        </View>
      </View>
    </View>
  );
};
