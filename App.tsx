import React, {useEffect} from 'react';
import {StatusBar, StyleSheet, Text, View, TextInput} from 'react-native';
import 'react-native-reanimated';
import Animated, {
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {labelImage} from './labelImage';

const AnimatedTextInput: any = Animated.createAnimatedComponent(TextInput);

const App = () => {
  const [hasPermission, setHasPermission] = React.useState(false);
  const label1 = useSharedValue('');
  const label2 = useSharedValue('');
  const label3 = useSharedValue('');

  const textProps = useAnimatedProps(
    () => ({text: label1.value}),
    [label1.value],
  );

  const textProps2 = useAnimatedProps(
    () => ({text: label2.value}),
    [label2.value],
  );

  const textProps3 = useAnimatedProps(
    () => ({text: label3.value}),
    [label3.value],
  );

  useEffect(() => {
    Camera.requestCameraPermission().then(status => {
      if (status === 'authorized') {
        setHasPermission(true);
      }
    });
  }, []);

  const devices = useCameraDevices();
  const device = devices.back;

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const imageLabels = labelImage(frame);
    label1.value = imageLabels[0]?.label;
    label2.value = imageLabels[1]?.label;
    label3.value = imageLabels[2]?.label;
  }, []);

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
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive
        frameProcessor={frameProcessor}
        frameProcessorFps={20}
      />
      <View style={styles.containerLabels}>
        <AnimatedTextInput
          underlineColorAndroid="transparent"
          editable={false}
          value={label1.value}
          style={styles.text}
          animatedProps={textProps}
        />
        <AnimatedTextInput
          underlineColorAndroid="transparent"
          editable={false}
          value={label2.value}
          style={styles.text}
          animatedProps={textProps2}
        />
        <AnimatedTextInput
          underlineColorAndroid="transparent"
          editable={false}
          value={label3.value}
          style={styles.text}
          animatedProps={textProps3}
        />
      </View>
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
  containerLabels: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.6)',
    top: 0,
    right: 0,
    width: 200,
  },
});

export default App;
