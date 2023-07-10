import React, { Fragment } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../../сonstants';
import { styles } from './styles.js';

const BlockScreen = ({ navigation }) => {
  return (
    <Fragment>
      <SafeAreaView style={[{ flex: 1 }, styles.scrollContent]}>
        <View style={styles.mainView}>
          <View>
            <Text style={[theme.FONTS.h3SF, styles.title]}>Вы заблокированы</Text>
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
                  d="M40.0003 5.33333C29.7221 5.33333 21.3337 13.7218 21.3337 24V29.3333H16.0003C13.0537 29.3333 10.667 31.72 10.667 34.6667V66.6667C10.667 69.6133 13.0537 72 16.0003 72H64.0003C66.947 72 69.3337 69.6133 69.3337 66.6667V34.6667C69.3337 31.72 66.947 29.3333 64.0003 29.3333H58.667V24C58.667 14.0575 50.7645 6.0495 40.9482 5.52604C40.6467 5.40456 40.3254 5.33925 40.0003 5.33333ZM40.0003 10.6667C47.3968 10.6667 53.3337 16.6036 53.3337 24V29.3333H26.667V24C26.667 16.6036 32.6039 10.6667 40.0003 10.6667Z"
                  fill="#FF3B30"
                />
              </Svg>
            </View>
            <Text style={[theme.FONTS.h3SF, styles.title]}>Доступ в ваш аккаунт был заблокирован</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SignUpScreen');
            }}
          >
            <Text style={[theme.FONTS.body_SF_M_15, styles.regBtn]}>Вернуться к авторизации</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

export default BlockScreen;
