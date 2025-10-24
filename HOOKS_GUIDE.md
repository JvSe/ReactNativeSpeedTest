# Hooks Guide - rn-speed-test

Este guia explica como usar os hooks personalizados do `rn-speed-test` para facilitar o desenvolvimento de aplicações React Native.

## Hooks Disponíveis

### 1. useSpeedTest

Hook principal que fornece todas as funcionalidades de teste de velocidade com estado completo e interface simplificada.

#### Características:

- ✅ Estado completo de testes
- ✅ Resultados de todos os tipos de teste
- ✅ Controle de progresso em tempo real
- ✅ Gerenciamento de erros
- ✅ Funções de controle completas
- ✅ Interface simplificada para casos básicos
- ✅ Funções avançadas para casos complexos

#### Uso:

```typescript
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useSpeedTest } from 'rn-speed-test';

export default function SpeedTestScreen() {
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

  return (
    <View>
      <Text>Running: {isRunning ? 'Yes' : 'No'}</Text>
      <Text>Current Speed: {currentSpeed.toFixed(2)} Mbps</Text>
      <Text>Progress: {progress.toFixed(1)}%</Text>

      {downloadResult && (
        <Text>Download: {downloadResult.speed.toFixed(2)} Mbps</Text>
      )}

      <Button
        title="Test Download"
        onPress={() => startDownloadTest()}
        disabled={isRunning}
      />

      <Button title="Cancel Test" onPress={cancelTest} disabled={!isRunning} />
    </View>
  );
}
```

### 2. useNetworkMonitor

Hook para monitorar informações de rede em tempo real.

#### Características:

- ✅ Monitoramento de tipo de rede
- ✅ Status de conexão
- ✅ Atualização automática
- ✅ Função de refresh manual

#### Uso:

```typescript
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNetworkMonitor } from 'rn-speed-test';

export default function NetworkInfo() {
  const { networkType, isConnected, isLoading, error, refreshNetworkType } =
    useNetworkMonitor();

  return (
    <View>
      <Text>Connected: {isConnected ? 'Yes' : 'No'}</Text>
      <Text>Type: {networkType?.type || 'Unknown'}</Text>
      <Text>Loading: {isLoading ? 'Yes' : 'No'}</Text>

      <Button
        title="Refresh Network Info"
        onPress={refreshNetworkType}
        disabled={isLoading}
      />

      {error && <Text style={{ color: 'red' }}>Error: {error}</Text>}
    </View>
  );
}
```

## Comparação dos Hooks

| Funcionalidade          | useSpeedTest | useNetworkMonitor |
| ----------------------- | ------------ | ----------------- |
| Estado completo         | ✅           | ❌                |
| Resultados finais       | ✅           | ❌                |
| Progresso em tempo real | ✅           | ❌                |
| Controle de erros       | ✅           | ✅                |
| Monitoramento de rede   | ✅           | ✅                |
| Funções de controle     | ✅           | ❌                |
| Interface simplificada  | ✅           | ✅                |

## Exemplos Avançados

### Teste Automático com useSpeedTest

```typescript
import React, { useEffect } from 'react';
import { useSpeedTest } from 'rn-speed-test';

export default function AutoSpeedTest() {
  const {
    isRunning,
    downloadResult,
    uploadResult,
    pingResult,
    startDownloadTest,
    startUploadTest,
    startPingTest,
  } = useSpeedTest();

  useEffect(() => {
    // Executar testes automaticamente
    const runTests = async () => {
      // Teste de download
      startDownloadTest();

      // Aguardar resultado e executar upload
      // (implementar lógica de espera baseada no estado)
    };

    runTests();
  }, []);

  return <View>{/* Renderizar resultados */}</View>;
}
```

### Monitoramento de Rede com useNetworkMonitor

```typescript
import React, { useEffect } from 'react';
import { useNetworkMonitor } from 'rn-speed-test';

export default function NetworkStatus() {
  const { networkType, isConnected, refreshNetworkType } = useNetworkMonitor();

  useEffect(() => {
    // Atualizar informações de rede a cada 30 segundos
    const interval = setInterval(refreshNetworkType, 30000);

    return () => clearInterval(interval);
  }, [refreshNetworkType]);

  return (
    <View>
      <Text>Network: {networkType?.type}</Text>
      <Text>Status: {isConnected ? 'Connected' : 'Disconnected'}</Text>
    </View>
  );
}
```

## Dicas de Uso

### 1. Escolha o Hook Correto

- Use `useSpeedTest` para todas as funcionalidades de teste de velocidade
- Use `useNetworkMonitor` apenas para monitoramento de rede

### 2. Gerenciamento de Estado

- Os hooks gerenciam o estado automaticamente
- Não é necessário usar `useState` para os valores retornados
- Use `resetResults()` para limpar resultados

### 3. Tratamento de Erros

- Sempre verifique o estado `error`
- Use `setError(null)` para limpar erros
- Implemente fallbacks para casos de erro

### 4. Performance

- Os hooks são otimizados para performance
- Use `useCallback` para funções personalizadas
- Evite re-renders desnecessários

## Troubleshooting

### Problema: Hook não funciona

**Solução**: Verifique se o módulo nativo está disponível e se as dependências estão instaladas corretamente.

### Problema: Estado não atualiza

**Solução**: Verifique se os listeners estão configurados corretamente e se o componente está montado.

### Problema: Erros de TypeScript

**Solução**: Certifique-se de que as tipagens estão importadas corretamente e que o TypeScript está configurado.

## Conclusão

Os hooks do `rn-speed-test` fornecem uma interface moderna e conveniente para trabalhar com testes de velocidade em React Native. Escolha o hook apropriado para seu caso de uso e aproveite a simplicidade e poder que eles oferecem.
