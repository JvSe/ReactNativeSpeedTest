import React, { useState } from 'react';
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
import { useSpeedTest } from 'rn-speed-test';

export default function TestPromise() {
  const { isRunning, error } = useSpeedTest();
  const [results, setResults] = useState<{
    downloadSpeed?: number;
    uploadSpeed?: number;
    pingLatency?: number;
  }>({});

  const handleDownloadTest = async () => {
    try {
      console.log('Starting download test...');
      const { testDownload } = useSpeedTest();
      const speed = await testDownload();
      console.log('Download test completed:', speed);
      setResults((prev) => ({ ...prev, downloadSpeed: speed }));
      Alert.alert('Download Test', `Speed: ${speed.toFixed(2)} Mbps`);
    } catch (err) {
      console.error('Download test failed:', err);
      Alert.alert(
        'Download Test Failed',
        err instanceof Error ? err.message : 'Unknown error'
      );
    }
  };

  const handleUploadTest = async () => {
    try {
      console.log('Starting upload test...');
      const { testUpload } = useSpeedTest();
      const speed = await testUpload();
      console.log('Upload test completed:', speed);
      setResults((prev) => ({ ...prev, uploadSpeed: speed }));
      Alert.alert('Upload Test', `Speed: ${speed.toFixed(2)} Mbps`);
    } catch (err) {
      console.error('Upload test failed:', err);
      Alert.alert(
        'Upload Test Failed',
        err instanceof Error ? err.message : 'Unknown error'
      );
    }
  };

  const handlePingTest = async () => {
    try {
      console.log('Starting ping test...');
      const { testPing } = useSpeedTest();
      const latency = await testPing();
      console.log('Ping test completed:', latency);
      setResults((prev) => ({ ...prev, pingLatency: latency }));
      Alert.alert('Ping Test', `Latency: ${latency.toFixed(0)} ms`);
    } catch (err) {
      console.error('Ping test failed:', err);
      Alert.alert(
        'Ping Test Failed',
        err instanceof Error ? err.message : 'Unknown error'
      );
    }
  };

  const handleRunAllTests = async () => {
    try {
      console.log('Starting all tests...');
      const { runAllTests } = useSpeedTest();
      const testResults = await runAllTests();
      console.log('All tests completed:', testResults);
      setResults(testResults);
      Alert.alert(
        'All Tests Completed',
        `Download: ${testResults.downloadSpeed.toFixed(2)} Mbps\n` +
          `Upload: ${testResults.uploadSpeed.toFixed(2)} Mbps\n` +
          `Ping: ${testResults.pingLatency.toFixed(0)} ms`
      );
    } catch (err) {
      console.error('All tests failed:', err);
      Alert.alert(
        'Tests Failed',
        err instanceof Error ? err.message : 'Unknown error'
      );
    }
  };

  const handleResetResults = () => {
    setResults({});
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.content}>
          <Text style={styles.title}>Promise Test</Text>

          {/* Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status</Text>
            <Text style={styles.infoText}>
              Running: {isRunning ? 'Yes' : 'No'}
            </Text>
            {error && <Text style={styles.errorText}>Error: {error}</Text>}
          </View>

          {/* Results */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Results</Text>
            <Text style={styles.infoText}>
              Download:{' '}
              {results.downloadSpeed
                ? `${results.downloadSpeed.toFixed(2)} Mbps`
                : 'Not tested'}
            </Text>
            <Text style={styles.infoText}>
              Upload:{' '}
              {results.uploadSpeed
                ? `${results.uploadSpeed.toFixed(2)} Mbps`
                : 'Not tested'}
            </Text>
            <Text style={styles.infoText}>
              Ping:{' '}
              {results.pingLatency
                ? `${results.pingLatency.toFixed(0)} ms`
                : 'Not tested'}
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.button, isRunning && styles.buttonDisabled]}
              onPress={handleDownloadTest}
              disabled={isRunning}
            >
              <Text style={styles.buttonText}>Test Download</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, isRunning && styles.buttonDisabled]}
              onPress={handleUploadTest}
              disabled={isRunning}
            >
              <Text style={styles.buttonText}>Test Upload</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, isRunning && styles.buttonDisabled]}
              onPress={handlePingTest}
              disabled={isRunning}
            >
              <Text style={styles.buttonText}>Test Ping</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, isRunning && styles.buttonDisabled]}
              onPress={handleRunAllTests}
              disabled={isRunning}
            >
              <Text style={styles.buttonText}>Run All Tests</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleResetResults}
            >
              <Text style={styles.buttonText}>Reset Results</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  resetButton: {
    backgroundColor: '#8E8E93',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
