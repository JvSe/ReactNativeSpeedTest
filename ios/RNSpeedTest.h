
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#endif

#import <Network/Network.h>
#import <SystemConfiguration/SystemConfiguration.h>
#import <CoreTelephony/CTTelephonyNetworkInfo.h>

@interface RNSpeedTest : RCTEventEmitter <RCTBridgeModule, NSURLSessionDelegate, NSURLSessionDataDelegate>

@property (nonatomic) CFAbsoluteTime startTime;
@property (nonatomic) CFAbsoluteTime stopTime;
@property (nonatomic) CFAbsoluteTime lastElapsed;
@property (nonatomic) NSURL *url;
@property (nonatomic) NSURLSession *session;
@property (nonatomic) NSMutableURLRequest *mutableRequest;
@property (nonatomic) long long bytesReceived;
@property (nonatomic) long long bytesSent;
@property (nonatomic) int dlEpoch;
@property (nonatomic) int dlEpochSize;
@property (nonatomic) NSDate *start;
@property (nonatomic) int pingTimeout;
@property (nonatomic) int stage;
@property (nonatomic) BOOL hasListeners;

@end
  
