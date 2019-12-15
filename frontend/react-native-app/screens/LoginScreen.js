import React, { Component } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
} from "react-native";
import CustomTextInput from "../components/login/CustomTextInput";
import { Images } from "../styles";
import { BACKGROUND } from "../styles/colors";
import Picker from 'react-native-picker';
import LoginButton from "../components/login/LoginButton";

let data = ['-'];
for (var i = 0; i < 10; i++) {
    data.push(i);
}
data = [[...data], [...data], [...data], [...data]];

export default class RegisterScreen extends Component {

    state = {
        pickerValue: ['-', '-', '-', '-'],
        loginCode: "----"
    };

    check(loginCode) {
        return true; //TODO: ask backend for the correct loginCode to compare
    }

    showPicker() {
        Picker.init({
            pickerData: data,
            pickerTitleText: 'Enter your login code',
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

    handleWrong(){
        this.loginCodeInput.handleWrong();
    }

    login() {
        if (
            this.check(this.state.loginCode)
        ) {
            console.log("Log in request approved");
            this.props.navigation.navigate("app");
        } else {
            console.log("Log in request failed");
            this.handleWrong();
        }
    }



    render() {
        return (
            <ScrollView
                contentContainerStyle={styles.scroll}>
                <Image
                    source={Images.logoStandard}
                    style={styles.logo}
                />
                <TouchableOpacity
                    onPress={this.showPicker.bind(this)}>
                    <CustomTextInput
                        ref={component => (this.loginCodeInput = component)}
                        placeholder={(this.state.loginCode.indexOf("-") != -1) ? "Login Code" : "\u2022".repeat(4)}
                        notToEdit={true}
                        onFocusInput={() => console.log("Focused on login code")}
                    />
                </TouchableOpacity>
                <LoginButton label="Log In"
                    onPress={this.login.bind(this)} />
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
    }
});
