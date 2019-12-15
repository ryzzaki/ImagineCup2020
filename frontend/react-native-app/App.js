'use strict';

import React, {Component} from 'react';
import MainNavigator from './navigation/SwitchNavigator';
import AsyncStorage from '@react-native-community/async-storage';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.disableYellowBox = true; //for development time to disable yellow warnings inside the simulators
    return (
      < MainNavigator />
    );
  }
}
