
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

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class RNSpeedTestModule extends ReactContextBaseJavaModule {
  private ReactContext reactContext;
  private boolean hasListeners = false;
  private ExecutorService executorService;

  public RNSpeedTestModule(final ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.executorService = Executors.newCachedThreadPool();
  }

  @Override
  public void initialize() {
    super.initialize();
    hasListeners = true;
  }

  @Override
  public void onCatalystInstanceDestroy() {
    hasListeners = false;
    if (executorService != null) {
      executorService.shutdown();
    }
    super.onCatalystInstanceDestroy();
  }

  @ReactMethod
  public void testDownloadSpeed(String url, int timeout, int reportInterval) {
    if (!hasListeners) return;
    
    executorService.execute(() -> {
      try {
        long startTime = System.currentTimeMillis();
        URL downloadUrl = new URL(url);
        HttpURLConnection connection = (HttpURLConnection) downloadUrl.openConnection();
        connection.setRequestMethod("GET");
        connection.setConnectTimeout(timeout);
        connection.setReadTimeout(timeout);
        connection.setDoInput(true);
        
        int responseCode = connection.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK) {
          InputStream inputStream = connection.getInputStream();
          byte[] buffer = new byte[8192];
          int bytesRead;
          long totalBytes = 0;
          
          while ((bytesRead = inputStream.read(buffer)) != -1) {
            totalBytes += bytesRead;
            
            // Emit progress
            long currentTime = System.currentTimeMillis();
            double elapsedSeconds = (currentTime - startTime) / 1000.0;
            double speedMbps = (totalBytes * 8.0) / (elapsedSeconds * 1000000.0);
            double progress = Math.min(100.0, (elapsedSeconds / (timeout / 1000.0)) * 100.0);
            
            if (hasListeners) {
              WritableMap payload = Arguments.createMap();
              payload.putDouble("speed", speedMbps);
              payload.putDouble("progress", progress);
              reactContext
                      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                      .emit("onCompleteEpoch", payload);
            }
          }
          
          inputStream.close();
          
          // Emit completion
          long endTime = System.currentTimeMillis();
          double totalSeconds = (endTime - startTime) / 1000.0;
          double finalSpeed = (totalBytes * 8.0) / (totalSeconds * 1000000.0);
          
          if (hasListeners) {
            WritableMap payload = Arguments.createMap();
            payload.putDouble("speed", finalSpeed);
            payload.putDouble("progress", 100.0);
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onCompleteTest", payload);
          }
        } else {
          throw new IOException("HTTP Error: " + responseCode);
        }
        
        connection.disconnect();
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
    });
  }

  @ReactMethod
  public void testUploadSpeed(String url, int timeout, int reportInterval) {
    if (!hasListeners) return;
    
    executorService.execute(() -> {
      try {
        long startTime = System.currentTimeMillis();
        URL uploadUrl = new URL(url);
        HttpURLConnection connection = (HttpURLConnection) uploadUrl.openConnection();
        connection.setRequestMethod("POST");
        connection.setConnectTimeout(timeout);
        connection.setReadTimeout(timeout);
        connection.setDoOutput(true);
        connection.setDoInput(true);
        connection.setRequestProperty("Content-Type", "application/octet-stream");
        
        // Generate test data (1MB)
        byte[] testData = new byte[1024 * 1024]; // 1MB
        for (int i = 0; i < testData.length; i++) {
          testData[i] = (byte) (i % 256);
        }
        
        connection.getOutputStream().write(testData);
        connection.getOutputStream().flush();
        connection.getOutputStream().close();
        
        int responseCode = connection.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK || responseCode == HttpURLConnection.HTTP_CREATED) {
          // Emit progress
          long currentTime = System.currentTimeMillis();
          double elapsedSeconds = (currentTime - startTime) / 1000.0;
          double speedMbps = (testData.length * 8.0) / (elapsedSeconds * 1000000.0);
          
          if (hasListeners) {
            WritableMap payload = Arguments.createMap();
            payload.putDouble("speed", speedMbps);
            payload.putDouble("progress", 100.0);
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onCompleteTest", payload);
          }
        } else {
          throw new IOException("HTTP Error: " + responseCode);
        }
        
        connection.disconnect();
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
    });
  }

  @ReactMethod
  public void pingTest(String url, int timeout) {
    if (!hasListeners) return;
    
    executorService.execute(() -> {
      try {
        long startTime = System.currentTimeMillis();
        URL pingUrl = new URL(url);
        HttpURLConnection connection = (HttpURLConnection) pingUrl.openConnection();
        connection.setRequestMethod("HEAD");
        connection.setConnectTimeout(timeout);
        connection.setReadTimeout(timeout);
        
        int responseCode = connection.getResponseCode();
        long endTime = System.currentTimeMillis();
        long latency = endTime - startTime;
        
        if (responseCode == HttpURLConnection.HTTP_OK || responseCode == HttpURLConnection.HTTP_NO_CONTENT) {
          if (hasListeners) {
            WritableMap payload = Arguments.createMap();
            payload.putDouble("speed", latency); // Return latency as speed for ping
            payload.putDouble("latency", latency);
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onCompleteTest", payload);
          }
        } else {
          throw new IOException("HTTP Error: " + responseCode);
        }
        
        connection.disconnect();
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
    });
  }

  @ReactMethod
  public void cancelTest() {
    if (hasListeners) {
      WritableMap payload = Arguments.createMap();
      payload.putBoolean("cancelled", true);
      reactContext
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
              .emit("onTestCanceled", payload);
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


  @Override
  public String getName() {
    return "RNSpeedTest";
  }
}