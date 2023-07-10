const styles = {
  borderWidth: 2,
  borderWidthActive: 7,
  borderColor: '#C8C8C8',
  borderColorActive: '#FF3B30',
  containerStyle: { width: '100%', paddingTop: 10, paddingBottom: 10 },
};

const generateRadioData = (sub_fields, checkedID = []) => {
  let temp = [];
  sub_fields.map(item => {
    if (checkedID[0] === item.id) {
      temp.push(
        Object.assign({ id: item.id, label: item.value, value: item.value, selected: true }, styles)
      );
    } else {
      temp.push(Object.assign({ id: item.id, label: item.value, value: item.value }, styles));
    }
  });
  return temp;
};

const generateCheckBoxData = (sub_fields, checkedID) => {
  let temp = [];
  sub_fields.map((item, i) => {
    if (checkedID.includes(item.id)) {
      temp.push({ id: item.id, title: item.value, checked: true });
    } else {
      temp.push({ id: item.id, title: item.value, checked: false });
    }
  });
  return temp;
};

function getDataFuncForSetModalChooseData(data, setValue, checkedID = []) {
  let tempArray = {};
  if (data.type === 'select-radiobutton') {
    tempArray = {
      data: generateRadioData(data.sub_fields, checkedID),
      setValue: setValue,
      title: data.name,
      type: data.type,
    };
  } else {
    tempArray = {
      data: generateCheckBoxData(data.sub_fields, checkedID),
      setValue: setValue,
      title: data.name,
      type: data.type,
    };
  }
  return tempArray;
}

export default {
  generateRadioData,
  generateCheckBoxData,
  getDataFuncForSetModalChooseData,
};
