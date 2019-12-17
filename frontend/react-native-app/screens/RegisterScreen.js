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
import FilePickerManager from 'react-native-file-picker';
import Picker from 'react-native-picker';
import AsyncStorage from '@react-native-community/async-storage';

let data = ['-'];
for (var i = 0; i < 10; i++) {
  data.push(i);
}
data = [[...data], [...data], [...data], [...data]];

const WRONG_PASSWORD_INFO = "Password needs to be at least eight characters long and contain at least one digit."

const WRONG_PASSWORD_REPEAT_INFO = "Passwords don't match.";

const WRONG_ID_DATA = "Name or surname are incorrect";

const WRONG_LOGINCODE_INFO = "Incorrect login code";

const WRONG_EMAIL_INFO = "Incorrect email address";

export default class RegisterScreen extends Component {

  state = {
    keyboardShown: false,
    pickerValue: ['-', '-', '-', '-'],
    loginCode: "----",
    incorrectInfo: "",
  };

  checkPassword(password) {
    return (
      /\d/.test(password) &&
      password.length > 7
    );
  }

  checkPasswordRepeat(password, repeatPassword) {
    return (password == repeatPassword);
  }

  checkID(name, surname) {
    return (
      /^[A-Z][a-z\s-]*$/.test(name) &&
      /^[A-Z][a-z\s-]*$/.test(surname)
    );
  }

  checkLoginCode(loginCode) {
    return /^\d{4}$/.test(loginCode);
  }

  checkEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
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

  areThereErrors() {
    if (!this.checkID(this.nameInput.state.value, this.surnameInput.state.value)) {
      this.nameInput.handleWrong();
      this.surnameInput.handleWrong();
      this.setState({ incorrectInfo: WRONG_ID_DATA });
      return true;
    }
    if (!this.checkEmail(this.emailInput.state.value)) {
      this.emailInput.handleWrong();
      this.setState({ incorrectInfo: WRONG_EMAIL_INFO });
      return true;
    }
    if (!this.checkLoginCode(this.state.loginCode)) {
      this.loginCodeInput.handleWrong();
      this.setState({ incorrectInfo: WRONG_LOGINCODE_INFO });
      return true;
    }
    if (!this.checkPassword(this.passwordInput.state.value)) {
      this.passwordInput.handleWrong();
      this.setState({ incorrectInfo: WRONG_PASSWORD_INFO });
      return true;
    }
    if (!this.checkPasswordRepeat(this.passwordInput.state.value, this.repeatPasswordInput.state.value)) {
      this.repeatPasswordInput.handleWrong();
      this.setState({ incorrectInfo: WRONG_PASSWORD_REPEAT_INFO });
      return true;
    }
    return false;
  }

  async register() {
    if (this.areThereErrors()) {
      this.incorrectMessage.show();
    } else {
      try {
        await AsyncStorage.setItem("state", "login");
      } catch (e) {
        console.error("Saving error");
      }
      this.props.navigation.navigate("app");
    }
  }

setToNormal() {
  this.nameInput.handleBlur();
  this.surnameInput.handleBlur();
  this.emailInput.handleBlur();
  this.loginCodeInput.handleBlur();
  this.passwordInput.handleBlur();
  this.repeatPasswordInput.handleBlur();
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
            <Text style={{ color: "blue" }} onPress={() => this.props.navigation.navigate("signIn")}>
              {"Already existing user?"}</Text>
          </TouchableOpacity>
        </View>)}
      <View>
        <View style={styles.row}>
          <CustomTextInput
            ref={component => (this.nameInput = component)}
            placeholder="Name"
            customStyle={{ marginTop: 70, ...styles.leftField }}
            onFocusInput={this.setToNormal.bind(this)}
          />
          <CustomTextInput
            ref={component => (this.surnameInput = component)}
            placeholder="Surname"
            customStyle={{ marginTop: 70, ...styles.rightField }}
            onFocusInput={this.setToNormal.bind(this)}
          />
        </View>
        <View style={styles.row}>
          <CustomTextInput
            ref={component => (this.emailInput = component)}
            placeholder="Email"
            customStyle={{ ...styles.leftField }}
            onFocusInput={this.setToNormal.bind(this)}
          />
          <TouchableOpacity
            onPress={this.showPicker.bind(this)}
            style={{ ...styles.rightField }}>
            <CustomTextInput
              ref={component => (this.loginCodeInput = component)}
              customStyle={{ flex: 1 }}
              placeholder={(this.state.loginCode.indexOf("-") != -1) ? "Login Code" : "\u2022".repeat(4)} //TODO2: change color when active
              notToEdit={true}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <CustomTextInput
            ref={component => (this.passwordInput = component)}
            placeholder="Password"
            customStyle={styles.leftField}
            onFocusInput={this.setToNormal.bind(this)}
          />

          <CustomTextInput
            ref={component => (this.repeatPasswordInput = component)}
            placeholder="Repeat password"
            customStyle={styles.rightField}
            onFocusInput={this.setToNormal.bind(this)}
          />
        </View>
        <IncorrectLogin
          ref={component => (this.incorrectMessage = component)}
          label={this.state.incorrectInfo}
        />
      </View>
      {!this.state.keyboardShown && (
        <View>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                FilePickerManager.showFilePicker(null, (response) => {
                  console.log('Response = ', response);

                  if (response.didCancel) {
                    console.log('User cancelled file picker');
                  }
                  else if (response.error) {
                    console.log('FilePickerManager Error: ', response.error);
                  }
                  else {
                    this.setState({
                      file: response
                    });
                  }
                })}>
              <Text style={styles.label}>Upload certificate</Text>
            </TouchableOpacity>
          <View style={{ height: 15 }}></View>
          <LoginButton label={"Register"}
            onPress={this.register.bind(this)} />
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
