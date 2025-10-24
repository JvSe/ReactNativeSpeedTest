import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useSpeedTest } from '../index';

export const ReturnValueExample: React.FC = () => {
  const {
    isRunning,
    error,
    testDownload,
    testUpload,
    testPing,
    runAllTests,
    resetResults,
  } = useSpeedTest();

  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [pingLatency, setPingLatency] = useState<number | null>(null);

  const handleDownloadTest = async () => {
    try {
      const speed = await testDownload();
      setDownloadSpeed(speed);
    } catch (err) {
      console.error('Download test failed:', err);
    }
  };

  const handleUploadTest = async () => {
    try {
      const speed = await testUpload();
      setUploadSpeed(speed);
    } catch (err) {
      console.error('Upload test failed:', err);
    }
  };

  const handlePingTest = async () => {
    try {
      const latency = await testPing();
      setPingLatency(latency);
    } catch (err) {
      console.error('Ping test failed:', err);
    }
  };

  const handleRunAllTests = async () => {
    try {
      const results = await runAllTests();
      setDownloadSpeed(results.downloadSpeed);
      setUploadSpeed(results.uploadSpeed);
      setPingLatency(results.pingLatency);
    } catch (err) {
      console.error('All tests failed:', err);
    }
  };

  const handleResetResults = () => {
    resetResults();
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setPingLatency(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Return Value Example</Text>

      {/* Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status</Text>
        <Text>Running: {isRunning ? 'Yes' : 'No'}</Text>
      </View>

      {/* Results */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Results</Text>
        <Text>
          Download:{' '}
          {downloadSpeed ? `${downloadSpeed.toFixed(2)} Mbps` : 'Not tested'}
        </Text>
        <Text>
          Upload:{' '}
          {uploadSpeed ? `${uploadSpeed.toFixed(2)} Mbps` : 'Not tested'}
        </Text>
        <Text>
          Ping: {pingLatency ? `${pingLatency.toFixed(0)} ms` : 'Not tested'}
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.section}>
        <Button
          title="Test Download"
          onPress={handleDownloadTest}
          disabled={isRunning}
        />
        <Button
          title="Test Upload"
          onPress={handleUploadTest}
          disabled={isRunning}
        />
        <Button
          title="Test Ping"
          onPress={handlePingTest}
          disabled={isRunning}
        />
        <Button
          title="Run All Tests"
          onPress={handleRunAllTests}
          disabled={isRunning}
        />
        <Button title="Reset Results" onPress={handleResetResults} />
      </View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorSection}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
});
