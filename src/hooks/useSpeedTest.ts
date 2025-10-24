import { useCallback, useEffect, useRef, useState } from 'react';
import SpeedTest, {
  NetworkType,
  SpeedTestProgress,
  SpeedTestResult,
} from '../index';

export interface UseSpeedTestReturn {
  // Estados principais
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

  // Função para definir erro manualmente
  setError: (error: string | null) => void;
}

export const useSpeedTest = (): UseSpeedTestReturn => {
  // Estados principais
  const [isRunning, setIsRunning] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [networkType, setNetworkType] = useState<NetworkType | null>(null);

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

    // Configurar listeners de eventos - CORRIGIDO: usar os nomes corretos dos eventos
    const progressListener = SpeedTest.addListener(
      'onCompleteEpoch', // CORRIGIDO: era 'onProgressTest'
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
  const testDownload = useCallback((): Promise<number> => {
    return new Promise((resolve, reject) => {
      try {
        setError(null);
        setIsRunning(true);
        setTestType('download');
        setCurrentSpeed(0);
        setProgress(0);

        let isResolved = false;

        const listener = SpeedTest.addListener(
          'onCompleteTest',
          (data: SpeedTestResult) => {
            if (!isResolved) {
              isResolved = true;
              setIsRunning(false);
              setTestType(null);
              setProgress(100);
              listener.remove();
              errorListener.remove();
              resolve(data.speed);
            }
          }
        );

        const errorListener = SpeedTest.addListener(
          'onErrorTest',
          (data: { message: string }) => {
            if (!isResolved) {
              isResolved = true;
              setIsRunning(false);
              setTestType(null);
              setError(data.message);
              listener.remove();
              errorListener.remove();
              reject(new Error(data.message));
            }
          }
        );

        SpeedTest.testDownloadSpeed({
          timeout: 30000,
          reportInterval: 1000,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to start download test'
        );
        setIsRunning(false);
        setTestType(null);
        reject(err);
      }
    });
  }, []);

  // Função para iniciar teste de upload
  const testUpload = useCallback((): Promise<number> => {
    return new Promise((resolve, reject) => {
      try {
        setError(null);
        setIsRunning(true);
        setTestType('upload');
        setCurrentSpeed(0);
        setProgress(0);

        let isResolved = false;

        const listener = SpeedTest.addListener(
          'onCompleteTest',
          (data: SpeedTestResult) => {
            if (!isResolved) {
              isResolved = true;
              setIsRunning(false);
              setTestType(null);
              setProgress(100);
              listener.remove();
              errorListener.remove();
              resolve(data.speed);
            }
          }
        );

        const errorListener = SpeedTest.addListener(
          'onErrorTest',
          (data: { message: string }) => {
            if (!isResolved) {
              isResolved = true;
              setIsRunning(false);
              setTestType(null);
              setError(data.message);
              listener.remove();
              errorListener.remove();
              reject(new Error(data.message));
            }
          }
        );

        SpeedTest.testUploadSpeed({
          timeout: 30000,
          reportInterval: 1000,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to start upload test'
        );
        setIsRunning(false);
        setTestType(null);
        reject(err);
      }
    });
  }, []);

  // Função para iniciar teste de ping
  const testPing = useCallback((): Promise<number> => {
    return new Promise((resolve, reject) => {
      try {
        setError(null);
        setIsRunning(true);
        setTestType('ping');
        setCurrentSpeed(0);
        setProgress(0);

        let isResolved = false;

        const listener = SpeedTest.addListener(
          'onCompleteTest',
          (data: SpeedTestResult) => {
            if (!isResolved) {
              isResolved = true;
              setIsRunning(false);
              setTestType(null);
              setProgress(100);
              listener.remove();
              errorListener.remove();
              resolve(data.latency || data.speed);
            }
          }
        );

        const errorListener = SpeedTest.addListener(
          'onErrorTest',
          (data: { message: string }) => {
            if (!isResolved) {
              isResolved = true;
              setIsRunning(false);
              setTestType(null);
              setError(data.message);
              listener.remove();
              errorListener.remove();
              reject(new Error(data.message));
            }
          }
        );

        SpeedTest.testPing({
          timeout: 5000,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to start ping test'
        );
        setIsRunning(false);
        setTestType(null);
        reject(err);
      }
    });
  }, []);

  // Função única para executar todos os testes
  const runAllTests = useCallback(async () => {
    try {
      setError(null);
      setIsRunning(true);
      setCurrentSpeed(0);
      setProgress(0);

      // Executar teste de download
      const downloadSpeed = await testDownload();

      // Executar teste de upload
      const uploadSpeed = await testUpload();

      // Executar teste de ping
      const pingLatency = await testPing();

      return {
        downloadSpeed,
        uploadSpeed,
        pingLatency,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run tests');
      setIsRunning(false);
      setTestType(null);
      throw err;
    } finally {
      setIsRunning(false);
      setTestType(null);
      setError(null);
    }
  }, [testDownload, testUpload, testPing]);

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
    setCurrentSpeed(0);
    setProgress(0);
    setError(null);
    setTestType(null);
  }, []);

  // Função para definir erro manualmente
  const setErrorManual = useCallback((error: string | null) => {
    setError(error);
  }, []);

  return {
    // Estados
    isRunning,
    currentSpeed,
    progress,
    networkType,

    // Estados de erro e tipo
    error,
    testType,

    // Função única
    runAllTests,

    // Funções individuais
    testDownload,
    testUpload,
    testPing,

    // Funções de controle
    cancelTest,
    resetResults,
    getNetworkType,

    // Funções de configuração
    setError: setErrorManual,
  };
};
