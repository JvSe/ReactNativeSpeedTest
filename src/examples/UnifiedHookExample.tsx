import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useSpeedTest } from '../index';

// Exemplo usando interface simplificada
export const SimpleUsageExample: React.FC = () => {
  const {
    isRunning,
    downloadSpeed,
    uploadSpeed,
    pingLatency,
    testDownload,
    testUpload,
    testPing,
    cancelTest,
    resetResults,
  } = useSpeedTest();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simple Usage</Text>

      <View style={styles.section}>
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

      <View style={styles.section}>
        <Button
          title="Test Download"
          onPress={testDownload}
          disabled={isRunning}
        />
        <Button title="Test Upload" onPress={testUpload} disabled={isRunning} />
        <Button title="Test Ping" onPress={testPing} disabled={isRunning} />
        {isRunning && <Button title="Cancel" onPress={cancelTest} />}
        <Button title="Clear Results" onPress={resetResults} />
      </View>
    </View>
  );
};

// Exemplo usando interface avançada
export const AdvancedUsageExample: React.FC = () => {
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

  const handleAdvancedDownloadTest = () => {
    startDownloadTest({
      timeout: 60000,
      reportInterval: 500,
    });
  };

  const handleAdvancedUploadTest = () => {
    startUploadTest({
      timeout: 60000,
      reportInterval: 500,
    });
  };

  const handleAdvancedPingTest = () => {
    startPingTest({
      timeout: 10000,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Advanced Usage</Text>

      {/* Network Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Network Information</Text>
        <Text>Type: {networkType?.type || 'Unknown'}</Text>
        <Button title="Refresh Network Type" onPress={getNetworkType} />
      </View>

      {/* Test Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Status</Text>
        <Text>Running: {isRunning ? 'Yes' : 'No'}</Text>
        <Text>Type: {testType || 'None'}</Text>
        <Text>Current Speed: {currentSpeed.toFixed(2)} Mbps</Text>
        <Text>Progress: {progress.toFixed(1)}%</Text>
      </View>

      {/* Results */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Results</Text>
        {downloadResult && (
          <Text>Download: {downloadResult.speed.toFixed(2)} Mbps</Text>
        )}
        {uploadResult && (
          <Text>Upload: {uploadResult.speed.toFixed(2)} Mbps</Text>
        )}
        {pingResult && <Text>Ping: {pingResult.latency?.toFixed(0)} ms</Text>}
      </View>

      {/* Test Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advanced Tests</Text>
        <Button
          title="Advanced Download Test"
          onPress={handleAdvancedDownloadTest}
          disabled={isRunning}
        />
        <Button
          title="Advanced Upload Test"
          onPress={handleAdvancedUploadTest}
          disabled={isRunning}
        />
        <Button
          title="Advanced Ping Test"
          onPress={handleAdvancedPingTest}
          disabled={isRunning}
        />
        {isRunning && <Button title="Cancel Test" onPress={cancelTest} />}
        <Button title="Reset Results" onPress={resetResults} />
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

// Exemplo mostrando como usar ambos os estilos
export const UnifiedHookExample: React.FC = () => {
  const {
    // Estados básicos
    isRunning,
    currentSpeed,
    progress,

    // Resultados simples
    downloadSpeed,
    uploadSpeed,
    pingLatency,

    // Resultados completos
    downloadResult,
    uploadResult,
    pingResult,

    // Estados de erro
    error,
    testType,

    // Funções simplificadas
    testDownload,
    testUpload,
    testPing,

    // Funções avançadas
    startDownloadTest,
    startUploadTest,
    startPingTest,

    // Funções de controle
    cancelTest,
    resetResults,
    getNetworkType,
  } = useSpeedTest();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unified Hook Example</Text>

      {/* Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status</Text>
        <Text>Running: {isRunning ? 'Yes' : 'No'}</Text>
        <Text>Type: {testType || 'None'}</Text>
        <Text>Current Speed: {currentSpeed.toFixed(2)} Mbps</Text>
        <Text>Progress: {progress.toFixed(1)}%</Text>
      </View>

      {/* Simple Results */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Simple Results</Text>
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

      {/* Detailed Results */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detailed Results</Text>
        {downloadResult && (
          <Text>Download: {downloadResult.speed.toFixed(2)} Mbps</Text>
        )}
        {uploadResult && (
          <Text>Upload: {uploadResult.speed.toFixed(2)} Mbps</Text>
        )}
        {pingResult && <Text>Ping: {pingResult.latency?.toFixed(0)} ms</Text>}
      </View>

      {/* Simple Functions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Simple Functions</Text>
        <Button
          title="Test Download"
          onPress={testDownload}
          disabled={isRunning}
        />
        <Button title="Test Upload" onPress={testUpload} disabled={isRunning} />
        <Button title="Test Ping" onPress={testPing} disabled={isRunning} />
      </View>

      {/* Advanced Functions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advanced Functions</Text>
        <Button
          title="Advanced Download"
          onPress={() => startDownloadTest({ timeout: 30000 })}
          disabled={isRunning}
        />
        <Button
          title="Advanced Upload"
          onPress={() => startUploadTest({ timeout: 30000 })}
          disabled={isRunning}
        />
        <Button
          title="Advanced Ping"
          onPress={() => startPingTest({ timeout: 5000 })}
          disabled={isRunning}
        />
      </View>

      {/* Control Functions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Control</Text>
        {isRunning && <Button title="Cancel Test" onPress={cancelTest} />}
        <Button title="Reset Results" onPress={resetResults} />
        <Button title="Get Network Type" onPress={getNetworkType} />
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
