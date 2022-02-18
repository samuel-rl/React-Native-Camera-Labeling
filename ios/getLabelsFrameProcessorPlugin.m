//
//  getLabelsFrameProcessorPlugin.m
//  reactNativeCameraLabeling
//
//  Created by Samuel Rodriguez-Lozano on 18/02/2022.
//

#import <Foundation/Foundation.h>
#import <VisionCamera/FrameProcessorPlugin.h>
#import <MLKit.h>

@interface ImageLabelerProcessorPlugin : NSObject

+ (MLKImageLabeler*) labeler;

@end

@implementation ImageLabelerProcessorPlugin

+ (MLKImageLabeler*) labeler{
  static MLKImageLabeler* labeler = nil;
  if (labeler == nil) {
    MLKImageLabelerOptions* options = [[MLKImageLabelerOptions alloc] init];
    labeler = [MLKImageLabeler imageLabelerWithOptions:options];
  }
  return labeler;
}

static inline id getLabels(Frame* frame, NSArray* arguments) {
  MLKVisionImage *image = [[MLKVisionImage alloc] initWithBuffer:frame.buffer];
  image.orientation = frame.orientation;

  NSError* error;
  NSArray<MLKImageLabel*>* labels = [[ImageLabelerProcessorPlugin labeler] resultsInImage:image error:&error];

  NSMutableArray* results = [NSMutableArray arrayWithCapacity:labels.count];
  for (MLKImageLabel* label in labels) {
    [results addObject:label.text];
  }

  return results;
}

VISION_EXPORT_FRAME_PROCESSOR(getLabels)

@end
