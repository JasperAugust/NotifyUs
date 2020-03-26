import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Font,
  ScrollView,
} from 'react-native';
import { DataTable } from 'react-native-paper';
import FontAwesome from '../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/FontAwesome.js';
import MaterialIcons from '../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/MaterialIcons.js';

import { formatRelative, subDays } from 'date-fns';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'uuid';
import { firebaseApp } from '../../services/config';

import { Ionicons } from '@expo/vector-icons';

import { actionCreators } from '../redux/actions.js';

// import axios from '../services/axios'; Change!
import axios from 'axios';

type State = {
  page: number,
  sortAscending: boolean,
  items: Array<{ key: number, name: string, calories: number, fat: number }>,
};

export default class HistoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updated: false,
      reports: [],
      image: null,
      data: [],
      loading: false,
      error: '',
      page: 0,
      sortAscending: true,
      fontLoaded: false,
    };
  }

  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ loading: true, error: null }, this.fetchReports);
  }

  componentDidUpdate() {
    if (this.state.updated) {
      this.setState(
        { loading: true, error: null, updated: false },
        this.fetchReports
      );
    }
  }

  userReport = () => {
    console.log(this.props.userInfo);
  };

  fetchReports = () => {
    // todo instead of manually replacing the ip, implement middleware
    axios
      .get('http://192.168.0.46:3000/reports')
      .then(({ data: reports }) => {
        console.log(reports);
        this.setState({ reports });
        console.log('Report fetching was successful!');
      })
      .catch(error => this.setState({ error }))
      .finally(() => this.setState({ loading: false }));
  };
  render() {
    const { image } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.table}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Dessert</DataTable.Title>
              <DataTable.Title numeric>Calories</DataTable.Title>
              <DataTable.Title numeric>Fat</DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
              <DataTable.Cell>Frozen yogurt</DataTable.Cell>
              <DataTable.Cell numeric>159</DataTable.Cell>
              <DataTable.Cell numeric>6.0</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>Ice cream sandwich</DataTable.Cell>
              <DataTable.Cell numeric>237</DataTable.Cell>
              <DataTable.Cell numeric>8.0</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Pagination
              page={1}
              numberOfPages={3}
              onPageChange={page => {
                console.log(page);
              }}
              label='1-2 of 6'
            />
          </DataTable>
          <View
            style={{
              // flex: 0.5,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 400, height: 300 }}
              />
            )}
            <TouchableOpacity>
              <Button
                title='Pick an image from camera roll'
                onPress={this._pickImage}
              />
              <Button title='UserInfo' onPress={this.userReport} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  submitReport = () => {
    try {
      fetch('http://192.168.0.46:3000/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photo: 'www.postimees.ee',
          username: 'potato',
          description: 'Best trashcan in history would fit fine here.',
          category: 'Suggestion',
        }),
      })
        .then(response => {
          console.log(response.status);
          this.setState({ updated: true });
          console.log('Post request was successful!');
        })
        .catch(error => {
          console.log('Post request error: Network error!');
          console.log(error);
        });
    } catch (error) {
      console.log('Post request failed');
      console.log(error);
    }
  };

  // Take a photo with a camera
  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this.handleImagePicked(pickerResult);
  };
  // Take a photo from the gallery
  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this.handleImagePicked(pickerResult);
  };

  handleImagePicked = async pickerResult => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        uploadUrl = await uploadImageAsync(pickerResult.uri);
        this.setState({ image: uploadUrl });
      }
    } catch (e) {
      console.log(e);
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
    }
  };
}
async function uploadImageAsync(uri) {
  // Why using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
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

  // done with the blob, close and release it
  blob.close();

  return await snapshot.ref.getDownloadURL();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  table: {
    paddingTop: 40,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
  reportsHeading: {
    flex: 1,
    paddingTop: 40,
    alignContent: 'center',
    justifyContent: 'space-between',
  },
});
