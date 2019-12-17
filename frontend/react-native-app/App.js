'use strict';

import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import AppSwitchNavigator from './navigation/AppSwitchNavigator';
import RegisterSwitchNavigator from './navigation/RegisterSwitchNavigator';
import LoginSwitchNavigator from './navigation/LoginSwitchNavigator';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: 'register'
    };
    AsyncStorage.getItem('state').then((value) => {
      if(value){
        this.setState({ appState: value });
      }
    });
  }

  render() {
    console.disableYellowBox = true; //for development time to disable yellow warnings inside the simulators
      // return (
      // < AppSwitchNavigator />
      // );
    if(this.state.appState == 'register'){
      return (
      < RegisterSwitchNavigator />
      );
    }
    if(this.state.appState == 'app'){
      return (
      < AppSwitchNavigator />
      );
    }
    if(this.state.appState == 'login'){
      return (
      < LoginSwitchNavigator />
      );
    }
  }
}
