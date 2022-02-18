import React, {useEffect} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import 'react-native-reanimated';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

const App = () => {
  const [hasPermission, setHasPermission] = React.useState(false);

  useEffect(() => {
    Camera.requestCameraPermission().then(status => {
      if (status === 'authorized') {
        setHasPermission(true);
      }
    });
  }, []);

  const devices = useCameraDevices();
  const device = devices.back;

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No permission</Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Waiting</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Camera style={StyleSheet.absoluteFill} device={device} isActive />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: 'white',
    textAlign: 'right',
  },
});

export default App;
