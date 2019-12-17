import React from "react";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import Amplify, { Auth } from "aws-amplify";


export default class ProfileScreen extends React.Component {
  state = {
    authCode: "",
  };
  onChangeText(authCode) {
    this.setState({ authCode });
  }
  signUp() {
    Auth.signUp({
      username: "yourcoolioemail@gmail.com",
      password: "MyCoolP@ssword213!",
      attributes: {
        email: "yourcoolioemail@gmail.com"
      }
    })
      .then(res => {
        console.log("Successful signup: ", res);
      })
      .catch(err => {
        console.log("Error signing up: ", err);
      });
  }
  confirmUser() {
    const { authCode } = this.state;
    Auth.confirmSignUp("MyCoolUsername", authCode)
      .then(res => {
        console.log("Successful confirmation: ", res);
      })
      .catch(err => {
        console.log("error confirming user: ", err);
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Confirmation code"
          onChangeText={value => this.onChangeText(value)}
          style={styles.input}
        />
        <Button title="Sign Up" onPress={this.signUp.bind(this)} />
        <Button title="Log In" onPress={this.confirmUser.bind(this)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    backgroundColor: "#ededed",
    marginVertical: 10
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F5FCFF"
  }
});
