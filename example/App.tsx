import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function App() {
  const [networkType, setNetworkType] = useState<NetworkType | null>(null);
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testType, setTestType] = useState<string>('');

  useEffect(() => {
    // Get initial network type
    getNetworkType();

    // Set up event listeners
    const progressListener = SpeedTest.addListener(
      'onCompleteEpoch',
      (data) => {
        setCurrentSpeed(data.speed);
      }
    );

    const completeListener = SpeedTest.addListener(
      'onCompleteTest',
      (data: SpeedTestResult) => {
        setCurrentSpeed(data.speed);
        setIsRunning(false);
        setTestType('');
        Alert.alert(
          'Test Complete',
          `${testType} speed: ${data.speed.toFixed(2)} Mbps`
        );
      }
    );

    const errorListener = SpeedTest.addListener('onErrorTest', (error) => {
      setIsRunning(false);
      setTestType('');
      Alert.alert('Error', error.message || 'Speed test failed');
    });

    const cancelListener = SpeedTest.addListener('onTestCanceled', () => {
      setIsRunning(false);
      setTestType('');
      Alert.alert('Test Cancelled', 'The speed test has been cancelled');
    });

    return () => {
      progressListener.remove();
      completeListener.remove();
      errorListener.remove();
      cancelListener.remove();
    };
  }, [testType]);

  const getNetworkType = async () => {
    try {
      const type = await SpeedTest.getNetworkType();
      setNetworkType(type);
    } catch (error) {
      console.error('Failed to get network type:', error);
    }
  };

  const startDownloadTest = () => {
    setIsRunning(true);
    setTestType('Download');
    setCurrentSpeed(0);
    SpeedTest.testDownloadSpeed({
      url: 'https://httpbin.org/bytes/10485760',
      timeout: 30000,
      reportInterval: 1000,
    });
  };

  const startUploadTest = () => {
    setIsRunning(true);
    setTestType('Upload');
    setCurrentSpeed(0);
    SpeedTest.testUploadSpeed({
      url: 'https://httpbin.org/post',
      timeout: 30000,
      reportInterval: 1000,
    });
  };

  const startPingTest = () => {
    setIsRunning(true);
    setTestType('Ping');
    setCurrentSpeed(0);
    SpeedTest.testPing({
      url: 'https://www.google.com',
      timeout: 5000,
    });
  };

  const cancelTest = () => {
    try {
      SpeedTest.cancelTest();
    } catch (error) {
      console.error('Failed to cancel test:', error);
    }
  };

  const refreshNetworkType = () => {
    getNetworkType();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Speed Test</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Network Information</Text>
          {networkType && (
            <Text style={styles.infoText}>Type: {networkType.type}</Text>
          )}
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={refreshNetworkType}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.speedContainer}>
          <Text style={styles.speedTitle}>Current Speed</Text>
          <Text style={styles.speedValue}>
            {testType === 'Ping'
              ? `${currentSpeed.toFixed(0)} ms`
              : `${currentSpeed.toFixed(2)} Mbps`}
          </Text>
          {isRunning && (
            <Text style={styles.testTypeText}>Testing {testType}...</Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.downloadButton]}
            onPress={startDownloadTest}
            disabled={isRunning}
          >
            <Text style={styles.buttonText}>Test Download Speed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.uploadButton]}
            onPress={startUploadTest}
            disabled={isRunning}
          >
            <Text style={styles.buttonText}>Test Upload Speed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.pingButton]}
            onPress={startPingTest}
            disabled={isRunning}
          >
            <Text style={styles.buttonText}>Test Ping Latency</Text>
          </TouchableOpacity>

          {isRunning && (
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={cancelTest}
            >
              <Text style={styles.buttonText}>Cancel Test</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Instructions</Text>
          <Text style={styles.instructionsText}>
            • Make sure you have a stable internet connection{'\n'}• Download
            test measures how fast you can receive data{'\n'}• Upload test
            measures how fast you can send data{'\n'}• Ping test measures
            network latency{'\n'}• Results may vary based on your network
            conditions
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#2c3e50',
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2c3e50',
  },
  infoText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  refreshButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  refreshButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  speedContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  speedTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2c3e50',
  },
  speedValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#27ae60',
    textAlign: 'center',
    marginBottom: 10,
  },
  testTypeText: {
    fontSize: 16,
    color: '#f39c12',
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  downloadButton: {
    backgroundColor: '#27ae60',
  },
  uploadButton: {
    backgroundColor: '#3498db',
  },
  pingButton: {
    backgroundColor: '#9b59b6',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  instructionsContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#2c3e50',
  },
  instructionsText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
});
