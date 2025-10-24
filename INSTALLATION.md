# Instalação do React Native Speed Test

## Para Projetos Expo

### 1. Instalar o pacote

```bash
npx expo install react-native-speed-test
```

### 2. Configurar o plugin no app.config.js

```javascript
export default {
  expo: {
    plugins: ['react-native-speed-test'],
  },
};
```

### 3. Usar no seu código

```typescript
import SpeedTest from 'react-native-speed-test';

// Testar velocidade de download
SpeedTest.testDownloadSpeed({
  url: 'https://httpbin.org/bytes/10485760', // 10MB
  timeout: 30000,
});

// Escutar eventos
SpeedTest.addListener('onCompleteTest', (data) => {
  console.log('Velocidade:', data.speed, 'Mbps');
});
```

## Para Projetos React Native CLI

### 1. Instalar o pacote

```bash
npm install react-native-speed-test
# ou
yarn add react-native-speed-test
```

### 2. Para iOS - Executar pod install

```bash
cd ios && pod install
```

### 3. Para Android - Não é necessário configuração adicional

### 4. Usar no seu código

```typescript
import SpeedTest from 'react-native-speed-test';

// Testar velocidade de download
SpeedTest.testDownloadSpeed({
  url: 'https://httpbin.org/bytes/10485760', // 10MB
  timeout: 30000,
});

// Escutar eventos
SpeedTest.addListener('onCompleteTest', (data) => {
  console.log('Velocidade:', data.speed, 'Mbps');
});
```

## Eventos Disponíveis

- `onCompleteEpoch` - Progresso durante o teste
- `onCompleteTest` - Teste finalizado
- `onErrorTest` - Erro durante o teste
- `onTestCanceled` - Teste cancelado

## Métodos Disponíveis

- `testDownloadSpeed(config)` - Testar velocidade de download
- `testUploadSpeed(config)` - Testar velocidade de upload
- `testPing(config)` - Testar latência de ping
- `getNetworkType()` - Obter tipo de rede
- `cancelTest()` - Cancelar teste em andamento
- `addListener(event, callback)` - Adicionar listener de evento
- `removeAllListeners()` - Remover todos os listeners

## Configuração

### SpeedTestConfig

```typescript
{
  url?: string;           // URL do teste (padrão: speedtest.net)
  epochSize?: number;     // Número de épocas (padrão: 1)
  timeout?: number;       // Timeout em ms (padrão: 30000)
  reportInterval?: number; // Intervalo de relatório em ms (padrão: 1000)
}
```

### PingConfig

```typescript
{
  url: string;           // URL de destino
  timeout: number;       // Timeout em ms
  count?: number;        // Número de tentativas
}
```

## Troubleshooting

### Erro "Native module not available"

- Certifique-se de que o plugin está configurado no app.config.js
- Para projetos React Native CLI, execute `pod install` no iOS

### Teste não funciona

- Verifique se há conexão com a internet
- Certifique-se de que as permissões de rede estão configuradas
- Verifique se a URL do teste está acessível

### Problemas de TypeScript

- Certifique-se de que o TypeScript está configurado no projeto
- O pacote inclui definições de tipos automáticas
