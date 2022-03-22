import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SheetDragService {

  rows = {};
  rowRefs = {};
  categoryRefs = [];
  headerRefs = [];
  highlightHeaderIndex: number;
  belowGridIndex: number
  highlightedHeader: number;
  scrollingInterval: any;

  constructor() { }
}
