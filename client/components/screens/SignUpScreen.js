import React from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  View,
  Alert,
  Modal,
  FlatList,
  Animated,
} from 'react-native';

import { Container, Item, Input } from 'native-base';

import { Ionicons } from '@expo/vector-icons';

import { Auth } from 'aws-amplify';

// TODO: Jasper: Logo HERE

export default class SingUpScreen extends React.Component {
  state = {
    username: '',
    password: '',
    email: '',
    isHidden: false,
    flag: defaultFlag,
    modalVisible: false,
    authCode: '',
  };

  onChangeText(key, value) {
    this.setState({ [key]: value });
  }

  toggleModal() {
    this.setState({ modalVisible: !modalVisible });
  }

  async signUp() {
    const { username, passoword, email } = this.state;

    await Auth.signUp({
      username,
      passoword,
      attributes: { email },
    })
      .then(() => {
        console.log('Sign up successful!');
        Alert.alert('Enter the confirmation code you received');
      })
      .catch(() => {
        if (!err.message) {
          console.log('Error when signing up: ', err);
          Alert.alert('Error when signing up: ', err);
        } else {
          console.log('Error when signing up: ', err.message);
          Alert.alert('Error when signing up: ', err.message);
        }
      });
  }

  //   Confirm users and redirect to SignIn page
  async confirmSignUp() {
    const { username, authCode } = this.state;
    await Auth.confirmSingUp(username, authCode)
      .then(() => {
        this.props.navigation.navigate('SignIn');
        console.log('Confirm sign up successful');
      })
      .catch(err => {
        if (!err.message) {
          console.log('Error when entering confirmation code: ', err);
          Alert.alert('Error when entering confirmation code: ', err);
        } else {
          console.log('Error when entering confirmation code: ', err.message);
          Alert.alert('Error when entering confirmation code: ', err.message);
        }
      });
  }

  async resendSignUp() {
    const { username } = this.state;
    await Auth.resendSignUp(username)
      .then(() => {
        console.log('Confirmation code resent successfully');
      })
      .catch(err => {
        if (!err.message) {
          console.log('Error requesting new confirmation code: ', err);
          Alert.alert('Error requesting new confirmation code: ', err);
        } else {
          console.log('Error requesting new confirmation code: ', err.message);
          Alert.alert('Error requesting new confirmation code: ', err.message);
        }
      });
  }

  render() {
    let { isHidden, flag } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <KeyboardAvoidingView
          style={styles.container}
          behavior='padding'
          enabled
        >
          <TouchableWithoutFeedback
            style={styles.container}
            onPress={Keyboard.dismiss}
          >
            <View style={styles.container}>
              {/* App Logo */}
              <View style={styles.logoContainer}>
                {isHidden ? (
                  <Animated.Image
                    source={logo}
                    style={{ opacity: fadeIn, width: 110.46, height: 117 }}
                  />
                ) : (
                  <Animated.Image
                    source={logo}
                    style={{ opacity: fadeOut, width: 110.46, height: 117 }}
                  />
                )}
              </View>
              <Container style={styles.infoContainer}>
                <View style={styles.container}>
                  {/* username section  */}
                  <Item style={styles.itemStyle}>
                    <Ionicons name='ios-person' style={styles.iconStyle} />
                    <Input
                      style={styles.input}
                      placeholder='Username'
                      placeholderTextColor='#adb4bc'
                      keyboardType={'email-address'}
                      returnKeyType='next'
                      autoCapitalize='none'
                      autoCorrect={false}
                      onSubmitEditing={event => {
                        this.refs.SecondInput._root.focus();
                      }}
                      onChangeText={value =>
                        this.onChangeText('username', value)
                      }
                      onFocus={() => this.fadeOut()}
                      onEndEditing={() => this.fadeIn()}
                    />
                  </Item>
                  {/*  password section  */}
                  <Item style={styles.itemStyle}>
                    <Ionicons name='ios-lock' style={styles.iconStyle} />
                    <Input
                      style={styles.input}
                      placeholder='Password'
                      placeholderTextColor='#adb4bc'
                      returnKeyType='next'
                      autoCapitalize='none'
                      autoCorrect={false}
                      secureTextEntry={true}
                      // ref={c => this.SecondInput = c}
                      ref='SecondInput'
                      onSubmitEditing={event => {
                        this.refs.ThirdInput._root.focus();
                      }}
                      onChangeText={value =>
                        this.onChangeText('password', value)
                      }
                      onFocus={() => this.fadeOut()}
                      onEndEditing={() => this.fadeIn()}
                    />
                  </Item>
                  {/* email section */}
                  <Item style={styles.itemStyle}>
                    <Ionicons name='ios-mail' style={styles.iconStyle} />
                    <Input
                      style={styles.input}
                      placeholder='Email'
                      placeholderTextColor='#adb4bc'
                      keyboardType={'email-address'}
                      returnKeyType='next'
                      autoCapitalize='none'
                      autoCorrect={false}
                      secureTextEntry={false}
                      ref='ThirdInput'
                      onSubmitEditing={event => {
                        this.refs.FourthInput._root.focus();
                      }}
                      onChangeText={value => this.onChangeText('email', value)}
                      onFocus={() => this.fadeOut()}
                      onEndEditing={() => this.fadeIn()}
                    />
                  </Item>
                  {/* phone section  */}
                  <Item style={styles.itemStyle}>
                    <Ionicons name='ios-call' style={styles.iconStyle} />
                    {/* country flag */}
                    <View>
                      <Text style={{ fontSize: 40 }}>{flag}</Text>
                    </View>
                    {/* open modal */}
                    <Ionicons
                      name='md-arrow-dropdown'
                      style={[styles.iconStyle, { marginLeft: 5 }]}
                      onPress={() => this.showModal()}
                    />
                    <Input
                      style={styles.input}
                      placeholder='+44766554433'
                      placeholderTextColor='#adb4bc'
                      keyboardType={'phone-pad'}
                      returnKeyType='done'
                      autoCapitalize='none'
                      autoCorrect={false}
                      secureTextEntry={false}
                      ref='FourthInput'
                      value={this.state.phoneNumber}
                      onChangeText={val => {
                        if (this.state.phoneNumber === '') {
                          // render UK phone code by default when Modal is not open
                          this.onChangeText('phoneNumber', defaultCode + val);
                        } else {
                          // render country code based on users choice with Modal
                          this.onChangeText('phoneNumber', val);
                        }
                      }}
                      onFocus={() => this.fadeOut()}
                      onEndEditing={() => this.fadeIn()}
                    />
                    {/* Modal for country code and flag */}
                    <Modal
                      animationType='slide' // fade
                      transparent={false}
                      visible={this.state.modalVisible}
                    >
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flex: 10,
                            paddingTop: 80,
                            backgroundColor: '#5059ae',
                          }}
                        >
                          <FlatList
                            data={countryData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                              <TouchableWithoutFeedback
                                onPress={() => this.getCountry(item.name)}
                              >
                                <View
                                  style={[
                                    styles.countryStyle,
                                    {
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                    },
                                  ]}
                                >
                                  <Text style={{ fontSize: 45 }}>
                                    {item.flag}
                                  </Text>
                                  <Text style={{ fontSize: 20, color: '#fff' }}>
                                    {item.name} ({item.dial_code})
                                  </Text>
                                </View>
                              </TouchableWithoutFeedback>
                            )}
                          />
                        </View>
                        <TouchableOpacity
                          onPress={() => this.hideModal()}
                          style={styles.closeButtonStyle}
                        >
                          <Text style={styles.textStyle}>Close</Text>
                        </TouchableOpacity>
                      </View>
                    </Modal>
                  </Item>
                  {/* End of phone input */}
                  <TouchableOpacity
                    onPress={() => this.signUp()}
                    style={styles.buttonStyle}
                  >
                    <Text style={styles.buttonText}>Sign Up</Text>
                  </TouchableOpacity>
                  {/* code confirmation section  */}
                  <Item style={styles.itemStyle}>
                    <Ionicons name='md-apps' style={styles.iconStyle} />
                    <Input
                      style={styles.input}
                      placeholder='Confirmation code'
                      placeholderTextColor='#adb4bc'
                      keyboardType={'numeric'}
                      returnKeyType='done'
                      autoCapitalize='none'
                      autoCorrect={false}
                      secureTextEntry={false}
                      onChangeText={value =>
                        this.onChangeText('authCode', value)
                      }
                      onFocus={() => this.fadeOut()}
                      onEndEditing={() => this.fadeIn()}
                    />
                  </Item>
                  <TouchableOpacity
                    onPress={() => this.confirmSignUp()}
                    style={styles.buttonStyle}
                  >
                    <Text style={styles.buttonText}>Confirm Sign Up</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.resendSignUp()}
                    style={styles.buttonStyle}
                  >
                    <Text style={styles.buttonText}>Resend code</Text>
                  </TouchableOpacity>
                </View>
              </Container>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5059ae',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 370,
    bottom: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#5059ae',
  },
  itemStyle: {
    marginBottom: 10,
  },
  iconStyle: {
    color: '#fff',
    fontSize: 28,
    marginRight: 15,
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#b44666',
    padding: 14,
    marginBottom: 10,
    borderRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 600,
    bottom: 270,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  textStyle: {
    padding: 5,
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  countryStyle: {
    flex: 1,
    backgroundColor: '#5059ae',
    borderTopColor: '#211f',
    borderTopWidth: 1,
    padding: 12,
  },
  closeButtonStyle: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#b44666',
  },
});
