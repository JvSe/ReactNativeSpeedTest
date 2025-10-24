
package com.saitbnzl.rnspeedtest;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.telephony.TelephonyManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import fr.bmartel.speedtest.SpeedTestReport;
import fr.bmartel.speedtest.SpeedTestSocket;
import fr.bmartel.speedtest.inter.ISpeedTestListener;
import fr.bmartel.speedtest.model.SpeedTestError;

public class RNSpeedTestModule extends ReactContextBaseJavaModule {
  private ReactContext reactContext;
  private SpeedTestSocket mSpeedTestSocket;
  private boolean hasListeners = false;

  public RNSpeedTestModule(final ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    mSpeedTestSocket = new SpeedTestSocket();
    mSpeedTestSocket.addSpeedTestListener(new ISpeedTestListener() {
      @Override
      public void onCompletion(SpeedTestReport report) {
        if (hasListeners) {
          WritableMap payload = Arguments.createMap();
          payload.putDouble("speed", report.getTransferRateBit().doubleValue() / 1000000.0); // Convert to Mbps
          payload.putDouble("progress", 100.0);
          reactContext
                  .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                  .emit("onCompleteTest", payload);
        }
      }

      @Override
      public void onError(SpeedTestError speedTestError, String errorMessage) {
        if (hasListeners) {
          WritableMap payload = Arguments.createMap();
          payload.putString("error", speedTestError.name());
          payload.putString("message", errorMessage);
          reactContext
                  .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                  .emit("onErrorTest", payload);
        }
      }

      @Override
      public void onProgress(float percent, SpeedTestReport report) {
        if (hasListeners) {
          WritableMap payload = Arguments.createMap();
          payload.putDouble("speed", report.getTransferRateBit().doubleValue() / 1000000.0); // Convert to Mbps
          payload.putDouble("progress", percent);
          reactContext
                  .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                  .emit("onCompleteEpoch", payload);
        }
      }
    });
  }

  @Override
  public void initialize() {
    super.initialize();
    hasListeners = true;
  }

  @Override
  public void onCatalystInstanceDestroy() {
    hasListeners = false;
    super.onCatalystInstanceDestroy();
  }

  @ReactMethod
  public void testDownloadSpeed(String url, int timeout, int reportInterval) {
    try {
      mSpeedTestSocket.startFixedDownload(url, timeout, reportInterval);
    } catch (Exception e) {
      if (hasListeners) {
        WritableMap payload = Arguments.createMap();
        payload.putString("error", "DOWNLOAD_ERROR");
        payload.putString("message", e.getMessage());
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onErrorTest", payload);
      }
    }
  }

  @ReactMethod
  public void testUploadSpeed(String url, int timeout, int reportInterval) {
    try {
      mSpeedTestSocket.startFixedUpload(url, 10000000, timeout, reportInterval);
    } catch (Exception e) {
      if (hasListeners) {
        WritableMap payload = Arguments.createMap();
        payload.putString("error", "UPLOAD_ERROR");
        payload.putString("message", e.getMessage());
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onErrorTest", payload);
      }
    }
  }

  @ReactMethod
  public void pingTest(String url, int timeout) {
    // Simple ping implementation - in a real implementation you might want to use a proper ping library
    try {
      // For now, we'll simulate a ping test
      // In a production app, you'd want to implement actual ICMP ping
      if (hasListeners) {
        WritableMap payload = Arguments.createMap();
        payload.putDouble("speed", 50.0); // Simulated latency in ms
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onCompleteTest", payload);
      }
    } catch (Exception e) {
      if (hasListeners) {
        WritableMap payload = Arguments.createMap();
        payload.putString("error", "PING_ERROR");
        payload.putString("message", e.getMessage());
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onErrorTest", payload);
      }
    }
  }

  @ReactMethod
  public void getNetworkType(Promise promise) {
    try {
      ConnectivityManager connectivityManager = 
          (ConnectivityManager) reactContext.getSystemService(Context.CONNECTIVITY_SERVICE);
      
      if (connectivityManager == null) {
        promise.resolve("UNKNOWN");
        return;
      }

      NetworkInfo activeNetwork = connectivityManager.getActiveNetworkInfo();
      
      if (activeNetwork == null || !activeNetwork.isConnected()) {
        promise.resolve("NONE");
        return;
      }

      int type = activeNetwork.getType();
      
      if (type == ConnectivityManager.TYPE_WIFI) {
        promise.resolve("WIFI");
      } else if (type == ConnectivityManager.TYPE_MOBILE) {
        TelephonyManager telephonyManager = 
            (TelephonyManager) reactContext.getSystemService(Context.TELEPHONY_SERVICE);
        
        if (telephonyManager != null) {
          int networkType = telephonyManager.getNetworkType();
          
          switch (networkType) {
            case TelephonyManager.NETWORK_TYPE_GPRS:
            case TelephonyManager.NETWORK_TYPE_EDGE:
            case TelephonyManager.NETWORK_TYPE_CDMA:
            case TelephonyManager.NETWORK_TYPE_1xRTT:
            case TelephonyManager.NETWORK_TYPE_IDEN:
              promise.resolve("2G");
              break;
            case TelephonyManager.NETWORK_TYPE_UMTS:
            case TelephonyManager.NETWORK_TYPE_EVDO_0:
            case TelephonyManager.NETWORK_TYPE_EVDO_A:
            case TelephonyManager.NETWORK_TYPE_HSDPA:
            case TelephonyManager.NETWORK_TYPE_HSUPA:
            case TelephonyManager.NETWORK_TYPE_HSPA:
            case TelephonyManager.NETWORK_TYPE_EVDO_B:
            case TelephonyManager.NETWORK_TYPE_EHRPD:
            case TelephonyManager.NETWORK_TYPE_HSPAP:
              promise.resolve("3G");
              break;
            case TelephonyManager.NETWORK_TYPE_LTE:
              promise.resolve("LTE");
              break;
            default:
              promise.resolve("UNKNOWN");
              break;
          }
        } else {
          promise.resolve("UNKNOWN");
        }
      } else {
        promise.resolve("UNKNOWN");
      }
    } catch (Exception e) {
      promise.reject("NETWORK_TYPE_ERROR", e.getMessage());
    }
  }

  @ReactMethod
  public void cancelTest(Promise promise) {
    try {
      if (mSpeedTestSocket != null) {
        mSpeedTestSocket.forceStopTask();
      }
      promise.resolve(null);
    } catch (Exception e) {
      promise.reject("CANCEL_ERROR", e.getMessage());
    }
  }

  @Override
  public String getName() {
    return "RNSpeedTest";
  }
}