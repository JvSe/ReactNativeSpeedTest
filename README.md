# rn-speed-test

A React Native library for testing network speed (download, upload) and ping latency, compatible with Expo and bare React Native projects.

## Features

- ✅ **Expo Compatible** - Works with Expo managed workflow
- ✅ **TypeScript Support** - Full TypeScript definitions included
- ✅ **Cross Platform** - iOS and Android support
- ✅ **Network Type Detection** - Detect WiFi, 2G, 3G, LTE connections
- ✅ **Real-time Progress** - Get real-time speed test progress
- ✅ **Modern APIs** - Uses latest React Native and native APIs

## Installation

### Expo (Recommended)

```bash
npx expo install rn-speed-test
```

Then add the plugin to your `app.config.js`:

```javascript
export default {
  expo: {
    plugins: [
      [
        'rn-speed-test',
        {
          customProperty: 'optional-custom-value',
          enableFeature: true,
        },
      ],
    ],
  },
};
```

### React Native CLI

```bash
npm install rn-speed-test
# or
yarn add rn-speed-test
```

#### iOS

For iOS, you need to run `pod install`:

```bash
cd ios && pod install
```

#### Android

No additional setup required for Android.

## Usage

### Using Hooks (Recommended)

```typescript
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useSpeedTest } from 'rn-speed-test';

export default function SpeedTestComponent() {
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

  const handleRunAllTests = async () => {
    try {
      const results = await runAllTests();
      setDownloadSpeed(results.downloadSpeed);
      setUploadSpeed(results.uploadSpeed);
      setPingLatency(results.pingLatency);
    } catch (err) {
      console.error('Tests failed:', err);
    }
  };

  return (
    <View>
      <Text>Running: {isRunning ? 'Yes' : 'No'}</Text>

      <Text>
        Download:{' '}
        {downloadSpeed ? `${downloadSpeed.toFixed(2)} Mbps` : 'Not tested'}
      </Text>
      <Text>
        Upload: {uploadSpeed ? `${uploadSpeed.toFixed(2)} Mbps` : 'Not tested'}
      </Text>
      <Text>
        Ping: {pingLatency ? `${pingLatency.toFixed(0)} ms` : 'Not tested'}
      </Text>

      <Button
        title="Run All Tests"
        onPress={handleRunAllTests}
        disabled={isRunning}
      />

      <Button title="Reset Results" onPress={resetResults} />
    </View>
  );
}
```

### Using Simplified Interface

```typescript
import React from 'react';
import { useSpeedTest } from 'rn-speed-test';

export default function SimpleSpeedTest() {
  const {
    isRunning,
    downloadSpeed,
    uploadSpeed,
    pingLatency,
    testDownload,
    testUpload,
    testPing,
  } = useSpeedTest();

  return (
    <View>
      <Text>
        Download:{' '}
        {downloadSpeed ? `${downloadSpeed.toFixed(2)} Mbps` : 'Not tested'}
      </Text>
      <Text>
        Upload: {uploadSpeed ? `${uploadSpeed.toFixed(2)} Mbps` : 'Not tested'}
      </Text>
      <Text>
        Ping: {pingLatency ? `${pingLatency.toFixed(0)} ms` : 'Not tested'}
      </Text>

      <Button title="Test Download" onPress={testDownload} />
      <Button title="Test Upload" onPress={testUpload} />
      <Button title="Test Ping" onPress={testPing} />
    </View>
  );
}
```

### Using Network Monitor Hook

```typescript
import React from 'react';
import { useNetworkMonitor } from 'rn-speed-test';

export default function NetworkInfo() {
  const { networkType, isConnected, isLoading, refreshNetworkType } =
    useNetworkMonitor();

  return (
    <View>
      <Text>Connected: {isConnected ? 'Yes' : 'No'}</Text>
      <Text>Type: {networkType?.type || 'Unknown'}</Text>
      <Button
        title="Refresh"
        onPress={refreshNetworkType}
        disabled={isLoading}
      />
    </View>
  );
}
```

### Basic Usage (Class-based)

```typescript
import SpeedTest from 'rn-speed-test';

// Test download speed
SpeedTest.testDownloadSpeed({
  url: 'https://httpbin.org/bytes/10485760', // 10MB file
  timeout: 30000,
  reportInterval: 1000,
});

// Test upload speed
SpeedTest.testUploadSpeed({
  url: 'https://httpbin.org/post',
  timeout: 30000,
  reportInterval: 1000,
});

// Test ping latency
SpeedTest.testPing({
  url: 'https://www.google.com',
  timeout: 5000,
});

// Get network type
const networkType = await SpeedTest.getNetworkType();
console.log('Network type:', networkType.type); // 'WIFI', '2G', '3G', 'LTE', etc.
```

### With Event Listeners

```typescript
import { useEffect } from 'react';
import SpeedTest, { SpeedTestProgress, SpeedTestResult } from 'rn-speed-test';

export default function SpeedTestScreen() {
  useEffect(() => {
    // Listen for progress updates
    const progressListener = SpeedTest.addListener('onCompleteEpoch', (data: SpeedTestProgress) => {
      console.log('Current speed:', data.speed, 'Mbps');
      console.log('Progress:', data.progress, '%');
    });

    // Listen for test completion
    const completeListener = SpeedTest.addListener('onCompleteTest', (data: SpeedTestResult) => {
      console.log('Final speed:', data.speed, 'Mbps');
    });

    // Listen for errors
    const errorListener = SpeedTest.addListener('onErrorTest', (error) => {
      console.error('Speed test error:', error);
    });

    return () => {
      // Clean up listeners
      progressListener.remove();
      completeListener.remove();
      errorListener.remove();
    };
  }, []);

  const startDownloadTest = () => {
    SpeedTest.testDownloadSpeed({
      url: 'https://httpbin.org/bytes/10485760',
      timeout: 30000,
      reportInterval: 1000
    });
  };

  const cancelTest = () => {
    try {
      SpeedTest.cancelTest();
      console.log('Test cancelled');
    } catch (error) {
      console.error('Failed to cancel test:', error);
    }
  };

  return (
    // Your UI components here
  );
}
```

### Complete Example

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import SpeedTest, { NetworkType, SpeedTestResult } from 'rn-speed-test';

export default function SpeedTestApp() {
  const [networkType, setNetworkType] = useState<NetworkType | null>(null);
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

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
        Alert.alert(
          'Test Complete',
          `Final speed: ${data.speed.toFixed(2)} Mbps`
        );
      }
    );

    const errorListener = SpeedTest.addListener('onErrorTest', (error) => {
      setIsRunning(false);
      Alert.alert('Error', error.message || 'Speed test failed');
    });

    return () => {
      progressListener.remove();
      completeListener.remove();
      errorListener.remove();
    };
  }, []);

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
    SpeedTest.testDownloadSpeed({
      url: 'https://httpbin.org/bytes/10485760',
      timeout: 30000,
      reportInterval: 1000,
    });
  };

  const startUploadTest = () => {
    setIsRunning(true);
    SpeedTest.testUploadSpeed({
      url: 'https://httpbin.org/post',
      timeout: 30000,
      reportInterval: 1000,
    });
  };

  const startPingTest = () => {
    setIsRunning(true);
    SpeedTest.testPing({
      url: 'https://www.google.com',
      timeout: 5000,
    });
  };

  const cancelTest = () => {
    try {
      SpeedTest.cancelTest();
      setIsRunning(false);
    } catch (error) {
      console.error('Failed to cancel test:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Speed Test</Text>

      {networkType && (
        <Text style={{ marginBottom: 20 }}>Network: {networkType.type}</Text>
      )}

      <Text style={{ marginBottom: 20 }}>
        Current Speed: {currentSpeed.toFixed(2)} Mbps
      </Text>

      <Button
        title="Test Download Speed"
        onPress={startDownloadTest}
        disabled={isRunning}
      />

      <Button
        title="Test Upload Speed"
        onPress={startUploadTest}
        disabled={isRunning}
      />

      <Button title="Test Ping" onPress={startPingTest} disabled={isRunning} />

      {isRunning && <Button title="Cancel Test" onPress={cancelTest} />}
    </View>
  );
}
```

## Plugin Configuration

The Expo plugin supports the following configuration options:

```typescript
interface RNSpeedTestPluginProps {
  customProperty?: string; // Custom property for configuration
  enableFeature?: boolean; // Enable additional features
}
```

### Plugin Options

- **customProperty** (optional): A custom string value that can be used for configuration
- **enableFeature** (optional): A boolean flag to enable additional features

## URLs de Teste

O pacote usa URLs reais e funcionais para testes de velocidade:

- **Download**: `https://httpbin.org/bytes/10485760` (arquivo de 10MB)
- **Upload**: `https://httpbin.org/post` (endpoint para POST requests)
- **Ping**: `https://www.google.com` (servidor confiável para ping)

Você pode usar suas próprias URLs se necessário, mas as URLs padrão são otimizadas para testes de velocidade.

## Hooks API Reference

### useSpeedTest

Hook principal para testes de velocidade com interface simplificada.

```typescript
const {
  // Estados
  isRunning: boolean;
  currentSpeed: number;
  progress: number;
  networkType: NetworkType | null;

  // Estados de erro
  error: string | null;
  testType: 'download' | 'upload' | 'ping' | null;

  // Função única para executar todos os testes
  runAllTests: () => Promise<{
    downloadSpeed: number;
    uploadSpeed: number;
    pingLatency: number;
  }>;

  // Funções individuais (retornam valores)
  testDownload: () => Promise<number>;
  testUpload: () => Promise<number>;
  testPing: () => Promise<number>;

  // Funções de controle
  cancelTest: () => void;
  resetResults: () => void;
  getNetworkType: () => Promise<void>;
  setError: (error: string | null) => void;
} = useSpeedTest();
```

### useNetworkMonitor

Hook para monitorar informações de rede.

```typescript
const {
  networkType: NetworkType | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  refreshNetworkType: () => Promise<void>;
} = useNetworkMonitor();
```

## API Reference

### Methods

#### `testDownloadSpeed(config?: SpeedTestConfig): void`

Test download speed with the given configuration.

#### `testUploadSpeed(config?: SpeedTestConfig): void`

Test upload speed with the given configuration.

#### `testPing(config: PingConfig): void`

Test ping latency to the given URL.

#### `getNetworkType(): Promise<NetworkType>`

Get the current network type.

#### `cancelTest(): void`

Cancel the currently running speed test.

#### `addListener(eventName: string, listener: (data: any) => void): EmitterSubscription`

Add an event listener for speed test events.

#### `removeAllListeners(eventName?: string): void`

Remove all event listeners.

#### `isAvailable(): boolean`

Check if the native module is available.

### Types

```typescript
interface SpeedTestConfig {
  url?: string; // Test URL (default: httpbin.org/bytes/10485760 for download, httpbin.org/post for upload)
  epochSize?: number; // Number of epochs (default: 1)
  timeout?: number; // Timeout in milliseconds (default: 30000)
  reportInterval?: number; // Report interval in milliseconds (default: 1000)
}

interface PingConfig {
  url?: string; // Target URL (default: https://www.google.com)
  timeout: number; // Timeout in milliseconds
  count?: number; // Number of ping attempts
}

interface SpeedTestResult {
  speed: number; // Speed in Mbps
  latency?: number; // Latency in ms (for ping tests)
}

interface SpeedTestProgress {
  speed: number; // Current speed in Mbps
  progress?: number; // Progress percentage (0-100)
}

interface NetworkType {
  type: 'WIFI' | '2G' | '3G' | 'LTE' | '5G' | 'NONE' | 'UNKNOWN';
}
```

### Events

- `onCompleteEpoch` - Fired during the test with progress updates
- `onCompleteTest` - Fired when the test completes
- `onErrorTest` - Fired when an error occurs
- `onTestCanceled` - Fired when the test is cancelled

## Requirements

- React Native >= 0.60.0
- iOS >= 11.0
- Android API Level >= 21

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our GitHub repository.

## Support

If you encounter any issues or have questions, please file an issue on our GitHub repository.
