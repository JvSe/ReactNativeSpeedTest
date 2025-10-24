import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSpeedTest } from 'rn-speed-test';

export default function App() {
  const {
    isRunning,
    currentSpeed,
    progress,
    networkType,
    downloadResult,
    uploadResult,
    pingResult,
    error,
    testType,
    startDownloadTest,
    startUploadTest,
    startPingTest,
    cancelTest,
    resetResults,
    getNetworkType,
  } = useSpeedTest();

  const handleDownloadTest = () => {
    startDownloadTest({
      timeout: 30000,
      reportInterval: 1000,
    });
  };

  const handleUploadTest = () => {
    startUploadTest({
      timeout: 30000,
      reportInterval: 1000,
    });
  };

  const handlePingTest = () => {
    startPingTest({
      timeout: 5000,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.content}>
          <Text style={styles.title}>Speed Test App</Text>

          {/* Network Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Network Information</Text>
            <Text style={styles.infoText}>
              Type: {networkType?.type || 'Unknown'}
            </Text>
            <TouchableOpacity style={styles.button} onPress={getNetworkType}>
              <Text style={styles.buttonText}>Refresh Network</Text>
            </TouchableOpacity>
          </View>

          {/* Test Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Test Status</Text>
            <Text style={styles.infoText}>
              Running: {isRunning ? 'Yes' : 'No'}
            </Text>
            <Text style={styles.infoText}>Type: {testType || 'None'}</Text>
            <Text style={styles.infoText}>
              Current Speed: {currentSpeed.toFixed(2)} Mbps
            </Text>
            <Text style={styles.infoText}>
              Progress: {progress.toFixed(1)}%
            </Text>
          </View>

          {/* Results */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Results</Text>
            {downloadResult && (
              <Text style={styles.resultText}>
                Download: {downloadResult.speed.toFixed(2)} Mbps
              </Text>
            )}
            {uploadResult && (
              <Text style={styles.resultText}>
                Upload: {uploadResult.speed.toFixed(2)} Mbps
              </Text>
            )}
            {pingResult && (
              <Text style={styles.resultText}>
                Ping: {pingResult.latency?.toFixed(0)} ms
              </Text>
            )}
          </View>

          {/* Test Buttons */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tests</Text>
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

            {isRunning && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={cancelTest}
              >
                <Text style={styles.buttonText}>Cancel Test</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={resetResults}
            >
              <Text style={styles.buttonText}>Reset Results</Text>
            </TouchableOpacity>
          </View>

          {/* Error Display */}
          {error && (
            <View style={styles.errorSection}>
              <Text style={styles.errorText}>Error: {error}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  resultText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#2e7d32',
    fontWeight: '500',
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
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  resetButton: {
    backgroundColor: '#8E8E93',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorSection: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: '500',
  },
});
