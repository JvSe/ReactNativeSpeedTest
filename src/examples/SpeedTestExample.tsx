import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useNetworkMonitor, useSpeedTest } from '../index';

// Exemplo usando o hook completo
export const SpeedTestExample: React.FC = () => {
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
    <View style={styles.container}>
      <Text style={styles.title}>Speed Test Example</Text>

      {/* Informações da rede */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Network Information</Text>
        <Text>Type: {networkType?.type || 'Unknown'}</Text>
        <Button title="Refresh Network Type" onPress={getNetworkType} />
      </View>

      {/* Status do teste */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Status</Text>
        <Text>Running: {isRunning ? 'Yes' : 'No'}</Text>
        <Text>Type: {testType || 'None'}</Text>
        <Text>Current Speed: {currentSpeed.toFixed(2)} Mbps</Text>
        <Text>Progress: {progress.toFixed(1)}%</Text>
      </View>

      {/* Resultados */}
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

      {/* Botões de teste */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tests</Text>
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
        {isRunning && <Button title="Cancel Test" onPress={cancelTest} />}
        <Button title="Reset Results" onPress={resetResults} />
      </View>

      {/* Erro */}
      {error && (
        <View style={styles.errorSection}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}
    </View>
  );
};

// Exemplo usando o hook simplificado
export const SpeedTestSimpleExample: React.FC = () => {
  const {
    isRunning,
    currentSpeed,
    error,
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
      <Text style={styles.title}>Simple Speed Test</Text>

      <View style={styles.section}>
        <Text>Running: {isRunning ? 'Yes' : 'No'}</Text>
        <Text>Current Speed: {currentSpeed.toFixed(2)} Mbps</Text>
      </View>

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
        <Button title="Clear" onPress={resetResults} />
      </View>

      {error && (
        <View style={styles.errorSection}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}
    </View>
  );
};

// Exemplo usando o hook de monitoramento de rede
export const NetworkMonitorExample: React.FC = () => {
  const { networkType, isConnected, isLoading, error, refreshNetworkType } =
    useNetworkMonitor();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Network Monitor</Text>

      <View style={styles.section}>
        <Text>Connected: {isConnected ? 'Yes' : 'No'}</Text>
        <Text>Type: {networkType?.type || 'Unknown'}</Text>
        <Text>Loading: {isLoading ? 'Yes' : 'No'}</Text>
      </View>

      <View style={styles.section}>
        <Button
          title="Refresh"
          onPress={refreshNetworkType}
          disabled={isLoading}
        />
      </View>

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
