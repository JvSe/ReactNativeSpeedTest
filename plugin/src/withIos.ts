import { type ConfigPlugin, withInfoPlist } from 'expo/config-plugins';

export interface RNSpeedTestPluginProps {
  customProperty?: string;
  enableFeature?: boolean;
}

export const withIosConfiguration: ConfigPlugin<RNSpeedTestPluginProps> = (
  config,
  props
) => {
  return withInfoPlist(config, (config) => {
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

    // Add custom properties
    infoPlist.RNSpeedTestCustomProperty =
      props.customProperty || 'default_value';

    if (props.enableFeature) {
      infoPlist.RNSpeedTestFeatureEnabled = true;
    }

    return config;
  });
};
