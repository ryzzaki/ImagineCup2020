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
  + " Moreover repeated password has to be the same as the original one.";

const WRONG_DATA_INFO = "Name, surname or login code are incorrect.";

export default class RegisterScreen extends Component {

  state = {
    keyboardShown: false,
    pickerValue: ['-', '-', '-', '-'],
    loginCode: "----"
  };

  checkPassword(password, repeatPassword) {
    return (
      /\d/.test(password) &&
      (password == repeatPassword) &&
      password.length > 7
    );
  }

  check(name, surname, loginCode) {
    return (
      /^[A-Z][a-z\s-]*$/.test(name) &&
      /^[A-Z][a-z\s-]*$/.test(surname) &&
      /^\d{4}$/.test(loginCode)
    );
  }

  showPicker() {
    this.setToNormal(false);
    Picker.init({
      pickerData: data,
      pickerTitleText: 'Select your login code',
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
  // printUserData() {
  //   console.log("Login:", this.loginInput.state.value);
  //   console.log("Password:", this.passwordInput.state.value);
  //   console.log("Remember me status:", this.remember.state.set);
  // }

  handleWrong(passwordWrong) {
    if (!passwordWrong) {
      this.nameInput.handleWrong();
      this.surnameInput.handleWrong();
      this.loginCodeInput.handleWrong();
    } else {
      this.passwordInput.handleWrong();
      this.repeatPasswordInput.handleWrong();
    }
    this.setState({ passwordWrong });
    this.incorrectMessage.show();
  }

  async register() {
    if (
      this.nameInput.state && this.surnameInput.state &&
      this.check(this.nameInput.state.value, this.surnameInput.state.value, this.state.loginCode)
    ) {
      if (this.checkPassword(this.passwordInput.state.value, this.repeatPasswordInput.state.value)) {
        console.log("Register request sent"); //TODO: send to backend
        try{
          await AsyncStorage.setItem("@state", "app");
        }catch(e){
          console.error("Saving error");
        }
        this.props.navigation.navigate("app"); 
      }
      else {
        console.log("Incorrect password");
        this.handleWrong(true);
      }
    } else {
      console.log("Incorrect name, surname or login code");
      this.handleWrong(false);
    }
  }

  setToNormal(isPasswordWrong) {
    if (!isPasswordWrong) {
      this.nameInput.handleBlur();
      this.surnameInput.handleBlur();
      this.loginCodeInput.handleBlur();
    } else {
      this.passwordInput.handleBlur();
      this.repeatPasswordInput.handleBlur();
    }
    this.incorrectMessage.hide();
  }

  componentDidUpdate() {
    if ((Picker.isPickerShow() || this.state.keyboardShown) && (this.incorrectMessage && this.incorrectMessage.state.visible)) {
      console.log("keyboard shown ", this.state.keyboardShown, " incorrect message visible ", this.incorrectMessage.state.visible);
      this.setToNormal();
    }
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
        {!this.state.keyboardShown && (<Image
          source={Images.logoStandard}
          style={styles.logo}
        />)}
        <View>
          <CustomTextInput
            ref={component => (this.nameInput = component)}
            placeholder="Name"
            customStyle={{ marginTop: 70 }}
            onFocusInput={this.setToNormal.bind(this, false)}
          />
          <CustomTextInput
            ref={component => (this.surnameInput = component)}
            placeholder="Surname"
            onFocusInput={this.setToNormal.bind(this, false)}
          />
          <TouchableOpacity
            onPress={this.showPicker.bind(this)}>
            <CustomTextInput
              ref={component => (this.loginCodeInput = component)}
              placeholder={(this.state.loginCode.indexOf("-") != -1) ? "Login Code" : "\u2022".repeat(4)} //TODO2: change color when active
              notToEdit = {true}
            />
          </TouchableOpacity>
          <CustomTextInput
            ref={component => (this.passwordInput = component)}
            placeholder="Password"
            onFocusInput={this.setToNormal.bind(this, true)}
          />
          <CustomTextInput
            ref={component => (this.repeatPasswordInput = component)}
            placeholder="Repeat password"
            onFocusInput={this.setToNormal.bind(this, true)}
          />
          <IncorrectLogin
            ref={component => (this.incorrectMessage = component)}
            label={this.state.passwordWrong ? WRONG_PASSWORD_INFO : WRONG_DATA_INFO}
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
            <LoginButton label="Register"
              onPress={this.register.bind(this)} />
          </View>)}
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  logo: {
    alignSelf: "center",
    resizeMode: "contain",
    height: 100,
    width: 260,
    marginBottom: 40
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
