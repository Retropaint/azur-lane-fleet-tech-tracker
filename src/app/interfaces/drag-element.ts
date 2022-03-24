import { Component, ElementRef } from "@angular/core";
import { Gesture, GestureDetail } from "@ionic/angular";

export interface DragElement {
  transformX?: number;
  transformY?: number;
  mouse?: GestureDetail;
  halfWidth?: number; 
  halfHeight?: number;
  gesture?: Gesture;
  gestureElement?: ElementRef;

  // sheet
  scrollingDir?: number;
  sheetUI?: any
}
