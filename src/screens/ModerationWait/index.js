import React, { Fragment } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../../сonstants';
import { styles } from './styles.js';

const ModerationWaitScreen = ({ navigation }) => {
  return (
    <Fragment>
      <SafeAreaView style={[{ flex: 1 }, styles.scrollContent]}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text style={[theme.FONTS.h3SF, styles.title]}>Ожидайте модерации</Text>
          </View>
          <View>
            <View
              style={{
                width: '100%',
                height: '30%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M40 8C22.328 8 8 22.328 8 40C8 57.672 22.328 72 40 72C57.672 72 72 57.672 72 40C72 22.328 57.672 8 40 8ZM57.8853 33.8853L37.7253 54.0453C37.224 54.5467 36.5467 54.8267 35.84 54.8267C35.1333 54.8267 34.4533 54.5467 33.9547 54.0453L24.7467 44.8373C23.704 43.7947 23.704 42.1093 24.7467 41.0667C25.7893 40.024 27.4747 40.024 28.5173 41.0667L35.84 48.3893L54.1147 30.1147C55.1573 29.072 56.8427 29.072 57.8853 30.1147C58.928 31.1573 58.928 32.8427 57.8853 33.8853Z"
                  fill="#FF3B30"
                />
              </Svg>
            </View>
            <Text style={[theme.FONTS.h3SF, styles.title]}>
              {'Спасибо за регистрацию\n Ожидайте модерации и подтверждения что вы специалист DSS group'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('LogInScreen');
            }}
          >
            <Text style={[theme.FONTS.body_SF_M_15, styles.regBtn]}>Вернуться к авторизации</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

export default ModerationWaitScreen;
