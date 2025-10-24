# URLs de Teste - rn-speed-test

## URLs Padrão Funcionais

O pacote usa URLs reais e funcionais para testes de velocidade. As URLs antigas (`https://speedtest.net/download` e `https://speedtest.net/upload`) **não funcionam** porque não existem.

### ✅ URLs Corretas

#### Download Test

```
https://httpbin.org/bytes/10485760
```

- **Tamanho**: 10MB
- **Tipo**: Arquivo binário para download
- **Funcionamento**: Retorna um arquivo de 10MB para testar velocidade de download

#### Upload Test

```
https://httpbin.org/post
```

- **Tipo**: Endpoint POST
- **Funcionamento**: Aceita dados POST para testar velocidade de upload

#### Ping Test

```
https://www.google.com
```

- **Tipo**: Servidor web confiável
- **Funcionamento**: Responde a requests HEAD para medir latência

## URLs Alternativas

### Download

- `https://proof.ovh.net/files/10Mb.dat` - Arquivo de 10MB
- `https://speed.cloudflare.com/__down?bytes=10485760` - Arquivo de 10MB
- `https://httpbin.org/bytes/52428800` - Arquivo de 50MB

### Upload

- `https://httpbin.org/put` - Endpoint PUT
- `https://httpbin.org/patch` - Endpoint PATCH

### Ping

- `https://www.cloudflare.com` - Servidor CDN
- `https://httpbin.org/get` - Serviço de teste
- `https://www.github.com` - Servidor confiável

## Como Usar URLs Personalizadas

```typescript
import SpeedTest from 'rn-speed-test';

// Usar URL personalizada para download
SpeedTest.testDownloadSpeed({
  url: 'https://sua-url-personalizada.com/arquivo.dat',
  timeout: 30000,
});

// Usar URL personalizada para upload
SpeedTest.testUploadSpeed({
  url: 'https://seu-servidor.com/upload',
  timeout: 30000,
});

// Usar URL personalizada para ping
SpeedTest.testPing({
  url: 'https://seu-servidor.com',
  timeout: 5000,
});
```

## Requisitos para URLs de Teste

### Download

- Deve retornar um arquivo binário
- Tamanho recomendado: 1MB - 100MB
- Deve suportar HTTP/HTTPS
- Deve permitir múltiplas requisições

### Upload

- Deve aceitar requests POST/PUT
- Deve retornar resposta HTTP 200/201
- Deve suportar dados binários
- Deve ter timeout configurável

### Ping

- Deve responder a requests HEAD
- Deve ter baixa latência
- Deve ser um servidor confiável
- Deve suportar HTTPS

## Troubleshooting

### Erro "Page Not Found"

- Verifique se a URL está correta
- Teste a URL no navegador primeiro
- Certifique-se de que o servidor está online

### Erro de Timeout

- Aumente o valor de timeout
- Verifique sua conexão de internet
- Teste com URLs alternativas

### Erro de CORS

- Use URLs que suportam CORS
- Verifique se o servidor permite requests de apps móveis
- Considere usar um proxy se necessário

## Exemplo Completo

```typescript
import SpeedTest from 'rn-speed-test';

// Configuração com URLs personalizadas
const config = {
  download: {
    url: 'https://httpbin.org/bytes/10485760',
    timeout: 30000,
    reportInterval: 1000,
  },
  upload: {
    url: 'https://httpbin.org/post',
    timeout: 30000,
    reportInterval: 1000,
  },
  ping: {
    url: 'https://www.google.com',
    timeout: 5000,
  },
};

// Executar testes
SpeedTest.testDownloadSpeed(config.download);
SpeedTest.testUploadSpeed(config.upload);
SpeedTest.testPing(config.ping);
```
