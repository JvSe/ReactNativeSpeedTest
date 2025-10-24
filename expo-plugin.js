const { withAndroidManifest, withInfoPlist } = require('@expo/config-plugins');

const withSpeedTest = (config) => {
  // Android permissions
  config = withAndroidManifest(config, (config) => {
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

    return config;
  });

  // iOS permissions and configuration
  config = withInfoPlist(config, (config) => {
    const infoPlist = config.modResults;

    // Add network usage description
    infoPlist.NSAppTransportSecurity = {
      NSAllowsArbitraryLoads: true,
      NSExceptionDomains: {
        localhost: {
          NSExceptionAllowsInsecureHTTPLoads: true,
        },
      },
    };

    return config;
  });

  return config;
};

module.exports = withSpeedTest;
