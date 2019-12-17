import React from 'react';
import {
    Dimensions,
    Keyboard,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => resolve(position),
            e => reject(e)
        );
    });
};

const { height, width } = Dimensions.get('screen');

const defaultRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0122,
    longitudeDelta: 0.0121,
};
const Icon = ({ name, size, color }) => (
    <Ionicons
        name={`${Platform.OS === 'ios' ? 'ios' : 'md'}-${name}`}
        size={size}
        color={color}
    />
);

export default class MapScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            region: defaultRegion,
            descriptionText: '',
            image: null,
        };
    }

    componentDidMount() {
        this.keyboardDidShowSub = Keyboard.addListener(
            'keyboardDidShow',
            this.handleKeyboardDidShow
        );
        this.goToInitialLocation();
    }

    goToInitialLocation() {
        return getCurrentLocation().then(position => {
            if (position) {
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.002,
                        longitudeDelta: 0.002,
                    },
                });
            }
        });
    }
    // Renders hovering box with buttons for reporting
    renderReporting() {
        return (
            <View style={[styles.reporting, styles.shadow]}>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Modal')}
                >
                    <View style={[styles.reportingButton, { paddingHorizontal: 25 }]}>
                        <Icon name={'trash'} size={30} color='grey' />
                        <Text>Junk</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Modal')}
                >
                    <View style={styles.reportingButton}>
                        <Icon name={'alert'} size={30} color='grey' />
                        <Text>Vandalized</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Modal')}
                >
                    <View style={[styles.reportingButton, { paddingHorizontal: 10 }]}>
                        <Icon name={'create'} size={30} color='grey' />
                        <Text>Improve</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    region={this.state.region}
                    showsUserLocation={true}
                    zoomEnabled={true}
                    mapType={'satellite'}
                />
                {this.renderReporting()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    reporting: {
        flex: 0.5,
        backgroundColor: 'white',
        flexDirection: 'row',
        position: 'absolute',
        right: 0,
        left: 0,
        bottom: height * 0.05,
        height: 75,
        borderRadius: 6,
        justifyContent: 'center',
        marginHorizontal: 24,
        padding: 12,
        width: width - 24 * 2,
        alignItems: 'center',
    },
    shadow: {
        shadowColor: '#3D4448',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 6,
        backgroundColor: 'white',
    },
    reportingButton: {
        alignItems: 'center',
        marginHorizontal: 20,
    },
});

