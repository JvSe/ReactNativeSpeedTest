
#import "RNSpeedTest.h"
#import <React/RCTLog.h>
#import <React/RCTUtils.h>

@implementation RNSpeedTest

RCT_EXPORT_MODULE(RNSpeedTest)

// Will be called when this module's first listener is added.
-(void)startObserving {
    self.hasListeners = YES;
    // Set up any upstream listeners or background tasks as necessary
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    self.hasListeners = NO;
    // Remove upstream listeners, stop unnecessary background tasks
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"onCompleteTest", @"onErrorTest", @"onCompleteEpoch", @"onTestCanceled", @"onPacketLost"];
}

RCT_REMAP_METHOD(cancelTest,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        if(self.stage==1){
            [[self.session dataTaskWithURL:self.url] cancel];
        }
        else if(self.stage==2){
            [[self.session dataTaskWithRequest:self.mutableRequest] cancel];
        }
        
        if (self.hasListeners) {
            [self sendEventWithName:@"onTestCanceled" body:@{@"cancelled": @YES}];
        }
        
        resolve(@YES);
    } @catch (NSException *exception) {
        reject(@"CANCEL_ERROR", exception.reason, nil);
    }
}

RCT_EXPORT_METHOD(pingTest:(NSString*) urlString timeoutMs:(double)timeoutMs)
{
    // Simple ping implementation using NSURLSession
    NSURL *url = [NSURL URLWithString:urlString];
    if (!url) {
        if (self.hasListeners) {
            [self sendEventWithName:@"onErrorTest" body:@{@"error": @"INVALID_URL", @"message": @"Invalid URL provided"}];
        }
        return;
    }
    
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration ephemeralSessionConfiguration];
    configuration.timeoutIntervalForRequest = timeoutMs / 1000.0;
    configuration.timeoutIntervalForResource = timeoutMs / 1000.0;
    
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    request.HTTPMethod = @"HEAD";
    
    NSDate *startTime = [NSDate date];
    
    NSURLSessionDataTask *task = [session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        NSDate *endTime = [NSDate date];
        NSTimeInterval latency = [endTime timeIntervalSinceDate:startTime] * 1000; // Convert to milliseconds
        
        if (error) {
            if (self.hasListeners) {
                [self sendEventWithName:@"onErrorTest" body:@{@"error": @"PING_ERROR", @"message": error.localizedDescription}];
            }
        } else {
            if (self.hasListeners) {
                [self sendEventWithName:@"onCompleteTest" body:@{@"speed": @(latency)}];
            }
        }
    }];
    
    [task resume];
}


RCT_EXPORT_METHOD(testDownloadSpeedWithTimeout:(NSString*) urlString epochSize:(int)epochSize timeoutMs:(double)timeoutMs {
    self.url = [NSURL URLWithString:urlString];
    self.startTime = CFAbsoluteTimeGetCurrent();
    self.stopTime = self.startTime;
    self.bytesReceived = 0;
    self.dlEpochSize = epochSize;
    self.dlEpoch = 1;
    self.stage = 1;
    
    NSLog(@"Download test started timeout: %fms epochSize: %d url: %@", timeoutMs, epochSize, urlString);
    
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration ephemeralSessionConfiguration];
    configuration.timeoutIntervalForResource = timeoutMs/1000;
    self.session = [NSURLSession sessionWithConfiguration:configuration delegate:self delegateQueue:[NSOperationQueue mainQueue]];
    [[self.session dataTaskWithURL:self.url] resume];
})

RCT_EXPORT_METHOD(testUploadSpeedWithTimeout:(NSString*) urlString epochSize:(int)epochSize timeoutMs:(double)timeoutMs {
    self.url = [NSURL URLWithString:urlString];
    self.startTime = CFAbsoluteTimeGetCurrent();
    self.stopTime = self.startTime;
    self.bytesSent = 0;
    self.dlEpochSize = epochSize;
    self.dlEpoch = 1;
    self.lastElapsed = 0;
    self.stage = 2;
    
    
    NSLog(@"Upload test started timeout: %fms epochSize: %d url: %@", timeoutMs, epochSize, urlString);
    
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration ephemeralSessionConfiguration];
    configuration.timeoutIntervalForResource = timeoutMs/1000;
    self.session = [NSURLSession sessionWithConfiguration:configuration delegate:self delegateQueue:nil];
    self.mutableRequest = [NSMutableURLRequest requestWithURL:self.url
                                                  cachePolicy:NSURLRequestUseProtocolCachePolicy
                                              timeoutInterval:timeoutMs/1000.0];
    [self.mutableRequest setHTTPMethod:@"POST"];
    void * bytes = malloc(1024*1024*100);
    NSData * postData = [NSData dataWithBytes:bytes length:1024*1024*100];
    free(bytes);
    [self.mutableRequest setHTTPBody:postData];
    
    [[self.session dataTaskWithRequest:self.mutableRequest] resume];
})

RCT_EXPORT_METHOD(getNetworkType :(RCTPromiseResolveBlock)resolve
                  reject:(__unused RCTPromiseRejectBlock)reject)
{
    @try {
        // Use modern Network framework if available (iOS 12+)
        if (@available(iOS 12.0, *)) {
            nw_path_monitor_t monitor = nw_path_monitor_create();
            nw_path_monitor_set_update_handler(monitor, ^(nw_path_t path) {
                nw_path_status_t status = nw_path_get_status(path);
                
                if (status == nw_path_status_satisfied) {
                    if (nw_path_uses_interface_type(path, nw_interface_type_wifi)) {
                        resolve(@"WIFI");
                    } else if (nw_path_uses_interface_type(path, nw_interface_type_cellular)) {
                        // Get cellular technology
                        CTTelephonyNetworkInfo *netinfo = [[CTTelephonyNetworkInfo alloc] init];
                        NSDictionary *radioAccessTechnology = netinfo.serviceCurrentRadioAccessTechnology;
                        
                        if (radioAccessTechnology) {
                            NSString *carrierType = [radioAccessTechnology.allValues firstObject];
                            if ([carrierType isEqualToString:CTRadioAccessTechnologyGPRS] ||
                                [carrierType isEqualToString:CTRadioAccessTechnologyEdge] ||
                                [carrierType isEqualToString:CTRadioAccessTechnologyCDMA1x]) {
                                resolve(@"2G");
                            } else if ([carrierType isEqualToString:CTRadioAccessTechnologyWCDMA] ||
                                       [carrierType isEqualToString:CTRadioAccessTechnologyHSDPA] ||
                                       [carrierType isEqualToString:CTRadioAccessTechnologyHSUPA] ||
                                       [carrierType isEqualToString:CTRadioAccessTechnologyCDMAEVDORev0] ||
                                       [carrierType isEqualToString:CTRadioAccessTechnologyCDMAEVDORevA] ||
                                       [carrierType isEqualToString:CTRadioAccessTechnologyCDMAEVDORevB] ||
                                       [carrierType isEqualToString:CTRadioAccessTechnologyeHRPD]) {
                                resolve(@"3G");
                            } else if ([carrierType isEqualToString:CTRadioAccessTechnologyLTE]) {
                                resolve(@"LTE");
                            } else {
                                resolve(@"UNKNOWN");
                            }
                        } else {
                            resolve(@"UNKNOWN");
                        }
                    } else {
                        resolve(@"UNKNOWN");
                    }
                } else {
                    resolve(@"NONE");
                }
                
                nw_path_monitor_cancel(monitor);
            });
            
            dispatch_queue_t queue = dispatch_queue_create("NetworkMonitor", NULL);
            nw_path_monitor_set_queue(monitor, queue);
            nw_path_monitor_start(monitor);
        } else {
            // Fallback for older iOS versions
            SCNetworkReachabilityRef reachability = SCNetworkReachabilityCreateWithName(NULL, "www.apple.com");
            SCNetworkReachabilityFlags flags;
            BOOL success = SCNetworkReachabilityGetFlags(reachability, &flags);
            CFRelease(reachability);
            
            if (!success) {
                resolve(@"UNKNOWN");
                return;
            }
            
            if ((flags & kSCNetworkReachabilityFlagsReachable) == 0) {
                resolve(@"NONE");
            } else if ((flags & kSCNetworkReachabilityFlagsIsWWAN) != 0) {
                // Cellular connection
                CTTelephonyNetworkInfo *netinfo = [[CTTelephonyNetworkInfo alloc] init];
                NSString *carrierType = netinfo.currentRadioAccessTechnology;
                
                if ([carrierType isEqualToString:CTRadioAccessTechnologyGPRS] ||
                    [carrierType isEqualToString:CTRadioAccessTechnologyEdge] ||
                    [carrierType isEqualToString:CTRadioAccessTechnologyCDMA1x]) {
                    resolve(@"2G");
                } else if ([carrierType isEqualToString:CTRadioAccessTechnologyWCDMA] ||
                           [carrierType isEqualToString:CTRadioAccessTechnologyHSDPA] ||
                           [carrierType isEqualToString:CTRadioAccessTechnologyHSUPA] ||
                           [carrierType isEqualToString:CTRadioAccessTechnologyCDMAEVDORev0] ||
                           [carrierType isEqualToString:CTRadioAccessTechnologyCDMAEVDORevA] ||
                           [carrierType isEqualToString:CTRadioAccessTechnologyCDMAEVDORevB] ||
                           [carrierType isEqualToString:CTRadioAccessTechnologyeHRPD]) {
                    resolve(@"3G");
                } else if ([carrierType isEqualToString:CTRadioAccessTechnologyLTE]) {
                    resolve(@"LTE");
                } else {
                    resolve(@"UNKNOWN");
                }
            } else {
                resolve(@"WIFI");
            }
        }
    } @catch (NSException *exception) {
        resolve(@"UNKNOWN");
    }
}

- (void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask didReceiveData:(NSData *)data {
    if(self.stage==1 && self.hasListeners){
        self.bytesReceived += (float)[data length];
        
        CFAbsoluteTime elapsed = (CFAbsoluteTimeGetCurrent() - self.startTime);
        
        if(elapsed > 1){
            CGFloat speed = elapsed != 0 ? self.bytesReceived / elapsed / 1024.0 / 1024.0 * 8 : -1;
            [self sendEventWithName:@"onCompleteEpoch" body:@{@"speed": @(speed)}];
            self.lastElapsed = elapsed;
            self.bytesReceived = 0;
            self.startTime = CFAbsoluteTimeGetCurrent();
        }
    }
}

- (void)URLSession:(NSURLSession *)session
              task:(NSURLSessionTask *)task
   didSendBodyData:(int64_t)bytesSent
    totalBytesSent:(int64_t)totalBytesSent
totalBytesExpectedToSend:(int64_t)totalBytesExpectedToSend{
    if(self.stage==2 && self.hasListeners){
        CFAbsoluteTime elapsed = (CFAbsoluteTimeGetCurrent() - self.startTime);
        if(elapsed - self.lastElapsed > 2){
            CGFloat speed = elapsed != 0 ? totalBytesSent / elapsed / 1024.0 / 1024.0 * 8 : -1;
            [self sendEventWithName:@"onCompleteEpoch" body:@{@"speed": @(speed)}];
            self.lastElapsed = elapsed;
        }
    }
}


-(void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask didReceiveResponse:(NSURLResponse *)response completionHandler:(void (^)(NSURLSessionResponseDisposition))completionHandler{
    NSLog(@"didReceiveResponse");
    self.startTime = CFAbsoluteTimeGetCurrent();
    completionHandler(NSURLSessionResponseAllow);
}

- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didCompleteWithError:(NSError *)error {
    if (self.hasListeners) {
        CFAbsoluteTime elapsed = self.stopTime - self.startTime;
        CGFloat speed = elapsed != 0 ? self.bytesReceived / elapsed / 1024.0 / 1024.0 * 8 : -1;
        
        if (error == nil || ([error.domain isEqualToString:NSURLErrorDomain] && error.code == NSURLErrorTimedOut)) {
            // Treat timeout as no error (as we're testing speed)
            [self sendEventWithName:@"onCompleteTest" body:@{@"speed": @(speed)}];
        } else {
            // Send error event
            [self sendEventWithName:@"onErrorTest" body:@{@"error": @"NETWORK_ERROR", @"message": error.localizedDescription}];
        }
    }
}

@end

