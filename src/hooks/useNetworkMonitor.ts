import { useCallback, useEffect, useState } from 'react';
import SpeedTest, { NetworkType } from '../index';

export interface UseNetworkMonitorReturn {
  networkType: NetworkType | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  refreshNetworkType: () => Promise<void>;
}

/**
 * Hook para monitorar o tipo de rede atual
 */
export const useNetworkMonitor = (): UseNetworkMonitorReturn => {
  const [networkType, setNetworkType] = useState<NetworkType | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshNetworkType = useCallback(async () => {
    if (!SpeedTest.isAvailable()) {
      setError('SpeedTest module not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const type = await SpeedTest.getNetworkType();
      setNetworkType(type);
      setIsConnected(type.type !== 'NONE');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to get network type'
      );
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshNetworkType();
  }, [refreshNetworkType]);

  return {
    networkType,
    isConnected,
    isLoading,
    error,
    refreshNetworkType,
  };
};
