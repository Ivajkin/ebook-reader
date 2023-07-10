import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { AdvantagesAndDisadvantagesIcon } from '../../../../components/svg';
import Svg, { Circle, Path } from 'react-native-svg';
import { styles } from './style';

export const AdvantagesAndDisadvantagesBlock = ({ data }) => {
  const [advantages, setAdvantages] = useState([]);
  const [disadvantages, setDisadvantages] = useState([]);
  const parseData = () => {
    let advantagesNew = JSON.parse(data['253']?.val)
      ?.split('\n')
      .filter(el => el?.length > 0);
    if (advantagesNew) {
      setAdvantages(advantagesNew);
    }
    let disadvantagesNew = JSON.parse(data['254']?.val)
      .split('\n')
      .filter(el => el.length > 0);
    if (disadvantagesNew) {
      setDisadvantages(disadvantagesNew);
    }
    //console.log('#A&D', advantages);
    //console.log('#A&D2', disadvantages);
  };
  useEffect(() => {
    parseData();
  }, []);
  return (
    <View style={styles.mainContainer}>
      <View style={styles.pointView}>
        {<AdvantagesAndDisadvantagesIcon />}
        <Text style={styles.titleText}>Преимущества и недостатки</Text>
      </View>
      <Text style={styles.pointTitleText}>Недостатки:</Text>

      {disadvantages.map(item => {
        return (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 6,
            }}
          >
            <Svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                d="M6.99961 0.600006C3.46521 0.600006 0.599609 3.46561 0.599609 7.00001C0.599609 10.5344 3.46521 13.4 6.99961 13.4C10.534 13.4 13.3996 10.5344 13.3996 7.00001C13.3996 3.46561 10.534 0.600006 6.99961 0.600006ZM7.75374 7.00001C7.75374 7.00001 9.42788 8.67414 9.51001 8.75627C9.71854 8.96481 9.71854 9.30241 9.51001 9.51041C9.30148 9.71894 8.96387 9.71894 8.75588 9.51041C8.67374 9.42881 6.99961 7.75414 6.99961 7.75414C6.99961 7.75414 5.32548 9.42827 5.24334 9.51041C5.03481 9.71894 4.69721 9.71894 4.48921 9.51041C4.28068 9.30187 4.28068 8.96427 4.48921 8.75627C4.57081 8.67414 6.24548 7.00001 6.24548 7.00001C6.24548 7.00001 4.57134 5.32587 4.48921 5.24374C4.28068 5.03521 4.28068 4.69761 4.48921 4.48961C4.69774 4.28107 5.03534 4.28107 5.24334 4.48961C5.32548 4.57121 6.99961 6.24587 6.99961 6.24587C6.99961 6.24587 8.67374 4.57174 8.75588 4.48961C8.96441 4.28107 9.30201 4.28107 9.51001 4.48961C9.71854 4.69814 9.71854 5.03574 9.51001 5.24374C9.42841 5.32587 7.75374 7.00001 7.75374 7.00001Z"
                fill="#FF1E1E"
              />
            </Svg>

            <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '500' }}>{item}</Text>
          </View>
        );
      })}
      <Text style={styles.pointTitleText}>Преимущества:</Text>
      {advantages.map(item => {
        return (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 6,
            }}
          >
            <Svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                d="M6.99961 0.599998C3.46521 0.599998 0.599609 3.4656 0.599609 7C0.599609 10.5344 3.46521 13.4 6.99961 13.4C10.534 13.4 13.3996 10.5344 13.3996 7C13.3996 5.83766 13.0849 4.75101 12.5434 3.81146L6.5444 9.80937C6.44467 9.90911 6.30918 9.96562 6.16732 9.96562C6.02598 9.96562 5.88997 9.90964 5.79023 9.80937L3.41523 7.43437C3.2067 7.22584 3.2067 6.88874 3.41523 6.68021C3.62377 6.47167 3.96087 6.47167 4.1694 6.68021L6.16732 8.67812L11.9277 2.91771C10.7539 1.50171 8.98254 0.599998 6.99961 0.599998ZM11.9277 2.91771C12.1579 3.19535 12.3616 3.49603 12.5434 3.81042L13.7767 2.57708C13.9852 2.36802 13.9852 2.03145 13.7767 1.82292C13.5682 1.61438 13.2311 1.61438 13.0225 1.82292L11.9277 2.91771Z"
                fill="#2FCF2C"
              />
            </Svg>

            <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '500' }}>{item}</Text>
          </View>
        );
      })}
    </View>
  );
};
