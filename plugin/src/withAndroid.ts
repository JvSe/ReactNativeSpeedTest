import {
  AndroidConfig,
  type ConfigPlugin,
  withAndroidManifest,
} from 'expo/config-plugins';

export interface RNSpeedTestPluginProps {
  customProperty?: string;
  enableFeature?: boolean;
}

export const withAndroidConfiguration: ConfigPlugin<RNSpeedTestPluginProps> = (
  config,
  props
) => {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;

    // Add ITSECURITYTEST permission if needed
    if (!androidManifest.manifest['uses-permission']) {
      androidManifest.manifest['uses-permission'] = [];
    }

    const permissions = androidManifest.manifest['uses-permission'];

    // Add network permissions
    const networkPermissions = [
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.ACCESS_WIFI_STATE',
    ];

    networkPermissions.forEach((permission) => {
      if (!permissions.find((p) => p.$['android:name'] === permission)) {
        permissions.push({
          $: {
            'android:name': permission,
          },
        });
      }
    });

    // Add metadata to main application if needed
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults
    );

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      'rn_speed_test_config_key',
      props.customProperty || 'default_value'
    );

    return config;
  });
};
