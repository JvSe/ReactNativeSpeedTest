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

export default function SimpleApp() {
  const {
    isRunning,
    downloadSpeed,
    uploadSpeed,
    pingLatency,
    error,
    runAllTests,
    resetResults,
  } = useSpeedTest();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.content}>
          <Text style={styles.title}>Speed Test App</Text>

          {/* Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status</Text>
            <Text style={styles.infoText}>
              Running: {isRunning ? 'Yes' : 'No'}
            </Text>
          </View>

          {/* Results */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Results</Text>
            <Text style={styles.infoText}>
              Download:{' '}
              {downloadSpeed
                ? `${downloadSpeed.toFixed(2)} Mbps`
                : 'Not tested'}
            </Text>
            <Text style={styles.infoText}>
              Upload:{' '}
              {uploadSpeed ? `${uploadSpeed.toFixed(2)} Mbps` : 'Not tested'}
            </Text>
            <Text style={styles.infoText}>
              Ping:{' '}
              {pingLatency ? `${pingLatency.toFixed(0)} ms` : 'Not tested'}
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.button, isRunning && styles.buttonDisabled]}
              onPress={runAllTests}
              disabled={isRunning}
            >
              <Text style={styles.buttonText}>Run All Tests</Text>
            </TouchableOpacity>

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
