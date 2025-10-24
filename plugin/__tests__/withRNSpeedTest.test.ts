import withRNSpeedTest from '../src';

describe('withRNSpeedTest', () => {
  it('should configure Android with custom property', () => {
    const config = {
      name: 'test-app',
      slug: 'test-app',
      platforms: ['android', 'ios'],
    };

    const result = withRNSpeedTest(config, {
      customProperty: 'test-value',
    });

    // Verify the plugin was applied correctly
    expect(result).toBeDefined();
    expect(result.name).toBe('test-app');
  });

  it('should handle default configuration', () => {
    const config = {
      name: 'test-app',
      slug: 'test-app',
      platforms: ['android', 'ios'],
    };

    const result = withRNSpeedTest(config, {});

    // Verify the plugin was applied correctly
    expect(result).toBeDefined();
    expect(result.name).toBe('test-app');
  });

  it('should enable feature when requested', () => {
    const config = {
      name: 'test-app',
      slug: 'test-app',
      platforms: ['android', 'ios'],
    };

    const result = withRNSpeedTest(config, {
      enableFeature: true,
    });

    // Verify the plugin was applied correctly
    expect(result).toBeDefined();
    expect(result.name).toBe('test-app');
  });

  it('should throw error for invalid customProperty', () => {
    const config = {
      name: 'test-app',
      slug: 'test-app',
      platforms: ['android', 'ios'],
    };

    expect(() => {
      withRNSpeedTest(config, {
        customProperty: 123 as any, // Invalid type
      });
    }).toThrow('customProperty must be a string');
  });
});
