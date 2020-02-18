import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { DataTable } from 'react-native-paper';
import { formatRelative, subDays } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'uuid';
import { firebaseApp } from '../../services/config';

import { actionCreators } from '../redux/actions.js';

// import axios from '../services/axios'; Change!
import axios from 'axios';


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
        this.setState({ reports });
        console.log('Report fetching was successful!');
      })
      .catch(error => this.setState({ error }))
      .finally(() => this.setState({ loading: false }));
  };
  render() {
    let { image } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.reportsHeading}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Category</DataTable.Title>
              <DataTable.Title right>description</DataTable.Title>
              <DataTable.Title right>Time</DataTable.Title>
            </DataTable.Header>
            {this.state.reports &&
              this.state.reports.map(report => {
                return (
                  <DataTable.Row
                    key={report._id} // you need a unique key per item
                    onPress={() => {
                      console.log(`Selected report of: ${report.username}`);
                    }}
                  >
                    <DataTable.Cell>{report.category}</DataTable.Cell>
                    <DataTable.Cell>{report.description}</DataTable.Cell>
                    <DataTable.Cell>
                      {formatRelative(subDays(new Date(), 3), new Date())}
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              })}
            <DataTable.Pagination
              page={1}
              numberOfPages={3}
              onPageChange={page => {
                console.log(page);
              }}
              label='1 of 6'
            />
          </DataTable>
          <View
            style={{
              flex: 0.5,
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
