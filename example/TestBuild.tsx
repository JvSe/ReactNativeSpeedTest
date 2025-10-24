import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SpeedTest } from 'rn-speed-test';

export default function TestBuild() {
  const [isAvailable, setIsAvailable] = React.useState(false);
  const [defaultUrls, setDefaultUrls] = React.useState<any>(null);

  React.useEffect(() => {
    // Testar se o módulo está disponível
    const available = SpeedTest.isAvailable();
    setIsAvailable(available);

    // Testar se as URLs padrão estão disponíveis
    setDefaultUrls(SpeedTest.DEFAULT_URLS);

    console.log('SpeedTest available:', available);
    console.log('Default URLs:', SpeedTest.DEFAULT_URLS);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Build Test</Text>
      <Text style={styles.text}>
        SpeedTest Available: {isAvailable ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.text}>
        Default URLs: {defaultUrls ? 'Loaded' : 'Not loaded'}
      </Text>
      {defaultUrls && (
        <View style={styles.urlsContainer}>
          <Text style={styles.urlText}>Download: {defaultUrls.download}</Text>
          <Text style={styles.urlText}>Upload: {defaultUrls.upload}</Text>
          <Text style={styles.urlText}>Ping: {defaultUrls.ping}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  urlsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  urlText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
});
