# Plugin Development Guide

This project follows the [Expo Config Plugins development guidelines](https://docs.expo.dev/config-plugins/development-for-libraries/) for creating and maintaining config plugins.

## Project Structure

```
.
├── src/                    # Main library code
│   └── index.ts
├── android/                # Android native module code
├── ios/                    # iOS native module code
├── plugin/                 # Plugin implementation
│   ├── src/
│   │   ├── index.ts        # Main plugin entry point
│   │   ├── withAndroid.ts  # Android-specific configurations
│   │   └── withIos.ts      # iOS-specific configurations
│   ├── __tests__/          # Plugin tests
│   ├── tsconfig.json       # Plugin-specific TypeScript config
│   └── jest.config.js      # Plugin test configuration
├── example/                # Example app
├── app.plugin.js          # Plugin entry point for Expo CLI
└── package.json           # Package configuration
```

## Key Features

### 1. **Separation of Concerns**

- Library code (`src/`) is separate from plugin code (`plugin/`)
- Platform-specific configurations are in separate files
- Tests are organized by functionality

### 2. **Expo Module Scripts Integration**

- Uses `expo-module-scripts` for build tooling
- Automated TypeScript compilation
- Integrated testing framework

### 3. **TypeScript Support**

- Full TypeScript support for both library and plugin
- Type-safe configuration options
- IntelliSense support for plugin properties

### 4. **Testing Infrastructure**

- Jest-based testing for plugin logic
- Mocked Expo configuration objects
- Cross-platform validation

## Plugin Configuration

The plugin supports the following configuration options:

```typescript
interface RNSpeedTestPluginProps {
  customProperty?: string; // Custom property for configuration
  enableFeature?: boolean; // Enable additional features
}
```

### Usage Example

```javascript
export default {
  expo: {
    plugins: [
      [
        'rn-speed-test',
        {
          customProperty: 'custom-value',
          enableFeature: true,
        },
      ],
    ],
  },
};
```

## Development Commands

```bash
# Build the plugin
npm run build:plugin

# Build everything
npm run build

# Run tests
npm run test

# Clean build artifacts
npm run clean

# Prepare for publishing
npm run prepare
```

## Plugin Implementation Details

### Android Configuration

- Adds network permissions automatically
- Configures AndroidManifest.xml
- Sets up metadata for the main application

### iOS Configuration

- Configures Info.plist
- Sets up network security settings
- Adds custom properties to the app configuration

### Error Handling

- Validates configuration parameters
- Provides clear error messages
- Graceful fallback for missing configurations

## Testing Strategy

The plugin uses a comprehensive testing approach:

1. **Unit Tests**: Test configuration transformation logic
2. **Integration Tests**: Verify actual prebuild output
3. **Error Testing**: Validate error handling scenarios

## Best Practices

1. **Idempotent Operations**: Plugin can be run multiple times safely
2. **Platform Separation**: Android and iOS configurations are separate
3. **Type Safety**: Full TypeScript support throughout
4. **Documentation**: Clear documentation for all configuration options
5. **Testing**: Comprehensive test coverage for all functionality

## Publishing

The plugin is automatically built and included when the package is published. The `app.plugin.js` file serves as the entry point for Expo CLI to find and load the plugin.

## Troubleshooting

### Common Issues

1. **Plugin not found**: Ensure `app.plugin.js` exists and points to the correct build directory
2. **Build errors**: Run `npm run clean` and then `npm run build:plugin`
3. **Type errors**: Ensure TypeScript configuration is correct in `plugin/tsconfig.json`

### Debug Mode

To debug plugin issues, use the `EXPO_DEBUG` environment variable:

```bash
EXPO_DEBUG=1 npx expo prebuild
```

This will show detailed logging of which platform-specific functions are being executed.
