/**
 * @format
 */

import { AppRegistry, StatusBar, Platform } from 'react-native';
import React from 'react';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
//import configureStore from './src/redux/store/configureStore';
import configuredStore from './src/redux/store/configureStore';
import 'react-native-gesture-handler';

//const store = configuredStore(//)
const RNRedux = () => (
  <Provider store={configuredStore}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => RNRedux);
