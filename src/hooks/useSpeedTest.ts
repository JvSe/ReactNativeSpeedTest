import { useCallback, useEffect, useRef, useState } from 'react';
import SpeedTest, {
  NetworkType,
  PingConfig,
  SpeedTestConfig,
  SpeedTestProgress,
  SpeedTestResult,
} from '../index';

export interface UseSpeedTestReturn {
  // Estado dos testes
  isRunning: boolean;
  currentSpeed: number;
  progress: number;
  networkType: NetworkType | null;

  // Resultados dos testes (valores simples)
  downloadSpeed: number | null;
  uploadSpeed: number | null;
  pingLatency: number | null;

  // Resultados completos (opcional)
  downloadResult: SpeedTestResult | null;
  uploadResult: SpeedTestResult | null;
  pingResult: SpeedTestResult | null;

  // Estados de erro
  error: string | null;
  testType: 'download' | 'upload' | 'ping' | null;

  // Funções de teste simplificadas
  testDownload: () => void;
  testUpload: () => void;
  testPing: () => void;

  // Funções de teste avançadas
  startDownloadTest: (config?: SpeedTestConfig) => void;
  startUploadTest: (config?: SpeedTestConfig) => void;
  startPingTest: (config: PingConfig) => void;

  // Funções de controle
  cancelTest: () => void;
  resetResults: () => void;
  getNetworkType: () => Promise<void>;

  // Funções de configuração
  setError: (error: string | null) => void;
}

export const useSpeedTest = (): UseSpeedTestReturn => {
  // Estados principais
  const [isRunning, setIsRunning] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [networkType, setNetworkType] = useState<NetworkType | null>(null);

  // Resultados dos testes
  const [downloadResult, setDownloadResult] = useState<SpeedTestResult | null>(
    null
  );
  const [uploadResult, setUploadResult] = useState<SpeedTestResult | null>(
    null
  );
  const [pingResult, setPingResult] = useState<SpeedTestResult | null>(null);

  // Estados de erro e tipo de teste
  const [error, setError] = useState<string | null>(null);
  const [testType, setTestType] = useState<
    'download' | 'upload' | 'ping' | null
  >(null);

  // Ref para controlar se o componente está montado
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    // Verificar se o módulo nativo está disponível
    if (!SpeedTest.isAvailable()) {
      setError('SpeedTest module not available');
      return;
    }

    // Configurar listeners de eventos
    const progressListener = SpeedTest.addListener(
      'onProgressTest',
      (data: SpeedTestProgress) => {
        if (isMountedRef.current) {
          setCurrentSpeed(data.speed);
          if (data.progress !== undefined) {
            setProgress(data.progress);
          }
        }
      }
    );

    const completeListener = SpeedTest.addListener(
      'onCompleteTest',
      (data: SpeedTestResult) => {
        if (isMountedRef.current) {
          setIsRunning(false);
          setProgress(100);

          // Definir resultado baseado no tipo de teste atual
          switch (testType) {
            case 'download':
              setDownloadResult(data);
              break;
            case 'upload':
              setUploadResult(data);
              break;
            case 'ping':
              setPingResult(data);
              break;
          }

          setTestType(null);
          setError(null);
        }
      }
    );

    const errorListener = SpeedTest.addListener(
      'onErrorTest',
      (data: { message: string }) => {
        if (isMountedRef.current) {
          setIsRunning(false);
          setError(data.message);
          setTestType(null);
          setProgress(0);
          setCurrentSpeed(0);
        }
      }
    );

    const cancelListener = SpeedTest.addListener('onTestCanceled', () => {
      if (isMountedRef.current) {
        setIsRunning(false);
        setTestType(null);
        setProgress(0);
        setCurrentSpeed(0);
        setError(null);
      }
    });

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      progressListener.remove();
      completeListener.remove();
      errorListener.remove();
      cancelListener.remove();
    };
  }, [testType]);

  // Função para iniciar teste de download
  const startDownloadTest = useCallback((config: SpeedTestConfig = {}) => {
    try {
      setError(null);
      setIsRunning(true);
      setTestType('download');
      setCurrentSpeed(0);
      setProgress(0);
      setDownloadResult(null);

      SpeedTest.testDownloadSpeed(config);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to start download test'
      );
      setIsRunning(false);
      setTestType(null);
    }
  }, []);

  // Função para iniciar teste de upload
  const startUploadTest = useCallback((config: SpeedTestConfig = {}) => {
    try {
      setError(null);
      setIsRunning(true);
      setTestType('upload');
      setCurrentSpeed(0);
      setProgress(0);
      setUploadResult(null);

      SpeedTest.testUploadSpeed(config);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to start upload test'
      );
      setIsRunning(false);
      setTestType(null);
    }
  }, []);

  // Função para iniciar teste de ping
  const startPingTest = useCallback((config: PingConfig) => {
    try {
      setError(null);
      setIsRunning(true);
      setTestType('ping');
      setCurrentSpeed(0);
      setProgress(0);
      setPingResult(null);

      SpeedTest.testPing(config);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to start ping test'
      );
      setIsRunning(false);
      setTestType(null);
    }
  }, []);

  // Função para cancelar teste
  const cancelTest = useCallback(() => {
    try {
      SpeedTest.cancelTest();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel test');
    }
  }, []);

  // Função para obter tipo de rede
  const getNetworkType = useCallback(async () => {
    try {
      const type = await SpeedTest.getNetworkType();
      setNetworkType(type);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to get network type'
      );
    }
  }, []);

  // Função para resetar resultados
  const resetResults = useCallback(() => {
    setDownloadResult(null);
    setUploadResult(null);
    setPingResult(null);
    setCurrentSpeed(0);
    setProgress(0);
    setError(null);
    setTestType(null);
  }, []);

  // Função para definir erro manualmente
  const setErrorManual = useCallback((error: string | null) => {
    setError(error);
  }, []);

  // Funções simplificadas
  const testDownload = useCallback(() => {
    startDownloadTest();
  }, [startDownloadTest]);

  const testUpload = useCallback(() => {
    startUploadTest();
  }, [startUploadTest]);

  const testPing = useCallback(() => {
    startPingTest({ timeout: 5000 });
  }, [startPingTest]);

  return {
    // Estados
    isRunning,
    currentSpeed,
    progress,
    networkType,

    // Resultados simples
    downloadSpeed: downloadResult?.speed || null,
    uploadSpeed: uploadResult?.speed || null,
    pingLatency: pingResult?.latency || null,

    // Resultados completos
    downloadResult,
    uploadResult,
    pingResult,

    // Estados de erro e tipo
    error,
    testType,

    // Funções simplificadas
    testDownload,
    testUpload,
    testPing,

    // Funções de teste avançadas
    startDownloadTest,
    startUploadTest,
    startPingTest,

    // Funções de controle
    cancelTest,
    resetResults,
    getNetworkType,

    // Funções de configuração
    setError: setErrorManual,
  };
};
