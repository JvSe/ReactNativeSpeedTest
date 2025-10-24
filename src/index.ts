import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

const { RNSpeedTest } = NativeModules;

const RNSpeedTestEvt = new NativeEventEmitter(RNSpeedTest);

export interface SpeedTestResult {
  speed: number; // in Mbps
  latency?: number; // in ms for ping tests
}

export interface SpeedTestProgress {
  speed: number; // current speed in Mbps
  progress?: number; // progress percentage (0-100)
}

export interface NetworkType {
  type: 'WIFI' | '2G' | '3G' | 'LTE' | '5G' | 'NONE' | 'UNKNOWN';
}

export interface SpeedTestConfig {
  url?: string;
  epochSize?: number;
  timeout?: number;
  reportInterval?: number;
}

export interface PingConfig {
  url?: string;
  timeout: number;
  count?: number;
}

export class SpeedTestError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'SpeedTestError';
  }
}

export class SpeedTest {
  private static listeners: { [key: string]: any } = {};

  // URLs padrão que funcionam para testes de velocidade
  private static readonly DEFAULT_URLS = {
    download: 'https://httpbin.org/bytes/10485760', // 10MB
    upload: 'https://httpbin.org/post',
    ping: 'https://www.google.com',
  };

  /**
   * Add event listener for speed test events
   */
  static addListener(eventName: string, listener: (data: any) => void) {
    if (!RNSpeedTestEvt) {
      throw new SpeedTestError('Native module not available');
    }

    const subscription = RNSpeedTestEvt.addListener(eventName, listener);
    this.listeners[eventName] = subscription;
    return subscription;
  }

  /**
   * Remove all listeners
   */
  static removeAllListeners(eventName?: string) {
    if (eventName) {
      if (this.listeners[eventName]) {
        this.listeners[eventName].remove();
        delete this.listeners[eventName];
      }
    } else {
      Object.values(this.listeners).forEach((listener: any) =>
        listener.remove()
      );
      this.listeners = {};
    }
  }

  /**
   * Cancel current speed test
   */
  static cancelTest(): void {
    if (!RNSpeedTest) {
      throw new SpeedTestError('Native module not available');
    }

    try {
      if (Platform.OS === 'ios') {
        RNSpeedTest.cancelTest();
      } else if (Platform.OS === 'android') {
        RNSpeedTest.cancelTest();
      } else {
        throw new SpeedTestError(`Platform ${Platform.OS} not supported`);
      }
    } catch (error) {
      throw new SpeedTestError(`Failed to cancel test: ${error}`);
    }
  }

  /**
   * Test download speed with timeout
   */
  static testDownloadSpeed(config: SpeedTestConfig = {}): void {
    if (!RNSpeedTest) {
      throw new SpeedTestError('Native module not available');
    }

    const {
      url = this.DEFAULT_URLS.download,
      timeout = 30000,
      reportInterval = 1000,
    } = config;

    try {
      if (Platform.OS === 'ios') {
        RNSpeedTest.testDownloadSpeedWithTimeout(url, 1, timeout);
      } else if (Platform.OS === 'android') {
        RNSpeedTest.testDownloadSpeed(url, timeout, reportInterval);
      } else {
        throw new SpeedTestError(`Platform ${Platform.OS} not supported`);
      }
    } catch (error) {
      throw new SpeedTestError(`Failed to start download test: ${error}`);
    }
  }

  /**
   * Test upload speed with timeout
   */
  static testUploadSpeed(config: SpeedTestConfig = {}): void {
    if (!RNSpeedTest) {
      throw new SpeedTestError('Native module not available');
    }

    const {
      url = this.DEFAULT_URLS.upload,
      timeout = 30000,
      reportInterval = 1000,
    } = config;

    try {
      if (Platform.OS === 'ios') {
        RNSpeedTest.testUploadSpeedWithTimeout(url, 1, timeout);
      } else if (Platform.OS === 'android') {
        RNSpeedTest.testUploadSpeed(url, timeout, reportInterval);
      } else {
        throw new SpeedTestError(`Platform ${Platform.OS} not supported`);
      }
    } catch (error) {
      throw new SpeedTestError(`Failed to start upload test: ${error}`);
    }
  }

  /**
   * Test ping latency
   */
  static testPing(config: PingConfig): void {
    if (!RNSpeedTest) {
      throw new SpeedTestError('Native module not available');
    }

    const { url = this.DEFAULT_URLS.ping, timeout } = config;

    try {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        RNSpeedTest.pingTest(url, timeout);
      } else {
        throw new SpeedTestError(`Platform ${Platform.OS} not supported`);
      }
    } catch (error) {
      throw new SpeedTestError(`Failed to start ping test: ${error}`);
    }
  }

  /**
   * Get current network type
   */
  static async getNetworkType(): Promise<NetworkType> {
    if (!RNSpeedTest) {
      throw new SpeedTestError('Native module not available');
    }

    try {
      if (Platform.OS === 'ios') {
        const networkType = await RNSpeedTest.getNetworkType();
        return { type: networkType };
      } else if (Platform.OS === 'android') {
        const networkType = await RNSpeedTest.getNetworkType();
        return { type: networkType };
      } else {
        throw new SpeedTestError(`Platform ${Platform.OS} not supported`);
      }
    } catch (error) {
      throw new SpeedTestError(`Failed to get network type: ${error}`);
    }
  }

  /**
   * Check if the native module is available
   */
  static isAvailable(): boolean {
    return RNSpeedTest != null;
  }
}

export default SpeedTest;

// Export hooks
export { useNetworkMonitor } from './hooks/useNetworkMonitor';
export { useSpeedTest } from './hooks/useSpeedTest';
