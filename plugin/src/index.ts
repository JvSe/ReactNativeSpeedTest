import { type ConfigPlugin } from 'expo/config-plugins';
import { withAndroidConfiguration } from './withAndroid';
import { withIosConfiguration } from './withIos';

export interface RNSpeedTestPluginProps {
  customProperty?: string;
  enableFeature?: boolean;
}

const withRNSpeedTest: ConfigPlugin<RNSpeedTestPluginProps> = (
  config,
  props = {}
) => {
  try {
    // Validate configuration early
    validateProps(props);

    // Apply Android configurations
    config = withAndroidConfiguration(config, props);

    // Apply iOS configurations
    config = withIosConfiguration(config, props);

    return config;
  } catch (error) {
    // Re-throw with more context if needed
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to configure RNSpeedTest plugin: ${errorMessage}`);
  }
};

function validateProps(props: RNSpeedTestPluginProps) {
  // Add validation logic here if needed
  if (props.customProperty && typeof props.customProperty !== 'string') {
    throw new Error('customProperty must be a string');
  }
}

export default withRNSpeedTest;
