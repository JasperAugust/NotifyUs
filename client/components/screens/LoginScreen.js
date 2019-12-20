import React from 'react';

import * as Constants from "expo-constants";
import * as Facebook from "expo-facebook";
import * as Google from "expo-google-app-auth";
import Amplify, {  Auth,   API,  Cache,  Credentials, } from "aws-amplify";

export default class Login extends React.Component {
  async fbsignIn() {
    const {
      type,
      token,
      expires,
      permissions
    } = await Facebook.logInWithReadPermissionsAsync("123123123123123123123", {
      permissions: ["public_profile", "email"]
    });
    if (type === "success") {
        const credentials = await Auth.federatedSignIn(
          "facebook",
          {
            token: token,
            expires_at: expires
          },
          { name: "USER_NAME" }
        );
    }
  }

  async GoogleSignin() {
       const tokenResponse = await Google.logInAsync({
      androidClientId:        "XXX.apps.googleusercontent.com",
      iosClientId:        "YYY.apps.googleusercontent.com",
      androidStandaloneAppClientId:        "XXX.apps.googleusercontent.com",
      iosStandaloneAppClientId:        "YYY.apps.googleusercontent.com",
      scopes: ["profile", "email"]
    });
    const {      user,      accessToken,     idToken,      accessTokenExpirationDate    } = TokenResponse;
    if (tokenResponse.type == "success") {
        const credentials = await Auth.federatedSignIn(
          "accounts.google.com",
          {
            token: idToken,
            expires_at: accessTokenExpirationDate * 1000 + new Date().getTime()
          },
          user
        );

  }