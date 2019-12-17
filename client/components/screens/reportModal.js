import React, { Component } from 'react';
import {
    Dimensions,
    Keyboard,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import uuid from 'uuid';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import * as ImagePicker from 'expo-image-picker';
import { firebaseApp } from '../../services/config';
import axios from 'axios';

const { height, width } = Dimensions.get('screen');

const Icon = ({ name, size, color }) => (
    <Ionicons
        name={`${Platform.OS === 'ios' ? 'ios' : 'md'}-${name}`}
        size={size}
        color={color}
    />
);

export default class reportModal extends Component {
    state = {
        image: null,
        uploading: false,
        user: "potato",
    };
    async componentDidMount() {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        await Permissions.askAsync(Permissions.CAMERA);
    }

    // Take a photo with a camera
    _takePhoto = async () => {
        let pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        this._handleImagePicked(pickerResult);
    };
    // Take a photo from the gallery
    _pickImage = async () => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        this._handleImagePicked(pickerResult);
    };

    submitReport = () => {
        try {
            axios.post('http://10.40.159.36:3000/reports', {
                username: this.state.user,
                description: "This is a test description for an elephant.",
                category: 'Trash',
                photo: "https://www.postimees.ee/kartul",

            })
                .then((response) => {
                    console.log(response);
                    console.log("success!");
                })
                .catch((error) => {
                    console.log("Network poop");
                    console.log(error);
                })
        } catch (error) {
            console.log("Potato");
            console.log(error, "Something is bad!")
        }

    };

    _handleImagePicked = async pickerResult => {
        try {
            this.setState({ uploading: true });

            if (!pickerResult.cancelled) {
                uploadUrl = await uploadImageAsync(pickerResult.uri);
                this.setState({ image: uploadUrl });
            }
        } catch (e) {
            console.log(e);
            //todo error handling
            alert('Upload failed, sorry :(');
        } finally {
            this.setState({ uploading: false });
        }
    };

    render() {
        let { image } = this.state;
        let { height, width } = Dimensions.get('window');
        return (
            <View style={styles.modalContainer}>
                <KeyboardAvoidingView
                    behavior='padding'
                    keyboardVerticalOffset={-60}
                    enabled
                >
                    <View style={styles.descriptionBox}>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                fontSize: 16,
                                paddingBottom: 10,
                            }}
                        >
                            What's wrong?
            </Text>
                        <View
                            style={{
                                borderColor: 'grey',
                                borderWidth: 0.5,
                            }}
                        >
                            <TextInput
                                {...this.props}
                                onChangeText={descriptionText =>
                                    this.setState({ descriptionText })
                                }
                                style={[styles.descriptionInput]}
                                value={this.state.descriptionText}
                                placeholder={
                                    'The better you describe it, the faster we move!😜'
                                }
                                multiline={true}
                                blurOnSubmit={true}
                                onSubmitEditing={() => {
                                    Keyboard.dismiss();
                                }}
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'space-between',
                            marginBottom: 30,
                        }}
                    >
                        <TouchableOpacity>
                            <View style={styles.sendReports}>
                                <Icon name={'camera'} size={45} color='grey' />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.sendReports}>
                                <Icon
                                    onPress={this.submitReport}
                                    name={'send'}
                                    size={45}
                                    color='grey'
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        );
    }
}

// tries to upload image to firebase
async function uploadImageAsync(uri) {
    // Why XMLHttpRequest?
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });

    const ref = firebaseApp
        .storage()
        .ref()
        .child('images/' + uuid.v4());
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    return await snapshot.ref.getDownloadURL();
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderRadius: 6,
    },
    descriptionBox: {
        paddingBottom: 75,
        width: width * 0.75,
        alignSelf: 'center',
        justifyContent: 'flex-end',
        marginBottom: 30,
    },
    descriptionInput: {
        height: 150,
        padding: 5,
        textAlign: 'left',
        alignItems: 'flex-start',
    },
    sendReports: {
        marginHorizontal: 60,
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
});
