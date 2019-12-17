import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Keyboard
} from "react-native";
import LoginButton from "../components/login/LoginButton";
import CustomTextInput from "../components/login/CustomTextInput";
import IncorrectLogin from "../components/login/IncorrectLogin";
import { Images, Colors } from "../styles";
import { BACKGROUND, TERNARY } from "../styles/colors";
import Picker from 'react-native-picker';
import AsyncStorage from '@react-native-community/async-storage';

let data = ['-'];
for (var i = 0; i < 10; i++) {
  data.push(i);
}
data = [[...data], [...data], [...data], [...data]];

export default class RegisterScreen extends Component {

  state = {
    keyboardShown: false,
    pickerValue: ['-', '-', '-', '-'],
    loginCode: "----",
  };

  async authenticate(){
    fetch('localhost:3000/api/v1/auth/signin', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstParam: 'yourValue',
          secondParam: 'yourOtherValue',
        }),
      });
  }

  async signIn() {
      //TODO check if authentic
    if (true) {
      this.emailInput.handleWrong();
      this.loginCodeInput.handleWrong();
      this.passwordInput.handleWrong();
      this.incorrectMessage.show();
    } else {
      try {
        await AsyncStorage.setItem("state", "login");
      } catch (e) {
        console.error("Saving error");
      }
      this.props.navigation.navigate("login");
    }
  }

  showPicker() {
    this.setToNormal(false);
    Picker.init({
      pickerData: data,
      pickerTitleText: 'Select your login code for this device',
      selectedValue: this.state.pickerValue,
      onPickerConfirm: data => {
        this.setState({
          loginCode: data.reduce((a, b) => a + b),
          pickerValue: data
        })
      },
      onPickerCancel: (data) => {
        console.log(data);
      },
      onPickerSelect: data => {
        console.log(data);
      }
    });
    Picker.show();
  }

setToNormal() {
  this.emailInput.handleBlur();
  this.loginCodeInput.handleBlur();
  this.passwordInput.handleBlur();
  this.incorrectMessage.hide();
}

componentDidMount() {
  this.keyboardDidShowListener = Keyboard.addListener(
    'keyboardDidShow',
    this._keyboardDidShow.bind(this)
  );
  this.keyboardDidHideListener = Keyboard.addListener(
    'keyboardDidHide',
    this._keyboardDidHide.bind(this)
  );
}

_keyboardDidShow() {
  this.setState({ keyboardShown: true });
}

_keyboardDidHide() {
  this.setState({ keyboardShown: false });
}

componentWillUnmount() {
  this.keyboardDidShowListener.remove();
  this.keyboardDidHideListener.remove();
}

render() {
  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
    >
      {!this.state.keyboardShown && (
        <View>
          <Image
            source={Images.logoStandard}
            style={styles.logo}
          />
          <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 20 }}>
            <Text style={{ color: "blue" }} onPress={() => this.props.navigation.navigate("register")}>
              {"New user?"}</Text>
          </TouchableOpacity>
        </View>)}
      <View>
          <CustomTextInput
            ref={component => (this.emailInput = component)}
            placeholder="Email"
            onFocusInput={this.setToNormal.bind(this)}
          />
          <TouchableOpacity
            onPress={this.showPicker.bind(this)}>
            <CustomTextInput
              ref={component => (this.loginCodeInput = component)}
              placeholder={(this.state.loginCode.indexOf("-") != -1) ? "Login Code" : "\u2022".repeat(4)} //TODO2: change color when active
              notToEdit={true}
            />
          </TouchableOpacity>
          <CustomTextInput
            ref={component => (this.passwordInput = component)}
            placeholder="Password"
            onFocusInput={this.setToNormal.bind(this)}
          />
        <IncorrectLogin
          ref={component => (this.incorrectMessage = component)}
          label={"Incorrect credentials"}
        />
      </View>
      {!this.state.keyboardShown && (
        <View>
          <LoginButton label={"SignIn"}
            onPress={this.signIn.bind(this)} />
        </View>)}
    </ScrollView>
  );
}
}
const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row'
  },
  leftField: {
    flex: 1,
    marginRight: 5
  },
  rightField: {
    flex: 1,
    marginLeft: 5
  },
  logo: {
    alignSelf: "center",
    resizeMode: "contain",
    height: 80,
    width: 260,
  },
  scroll: {
    paddingHorizontal: 30,
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-around",
    backgroundColor: BACKGROUND,
    paddingVertical: 100
  },
  forgetButton: {
    justifyContent: "center",
    alignSelf: "flex-end"
  },
  controlBar: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 20
  },
  checkBoxView: {
    flexDirection: "row",
    alignSelf: "flex-start"
  },
  rememberText: {
    marginLeft: 5
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: TERNARY,
    borderRadius: 5,
  },
  label: {
    fontSize: 20,
    color: BACKGROUND
  }
});
