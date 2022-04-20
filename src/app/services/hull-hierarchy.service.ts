import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HullHierarchyService {

  hulls = {
    'BB': [
      'BB',
      'BC',
      'BBV'
    ],
    'CV': [
      'CV',
      'CVL'
    ],
    'DD': [
      'DD',
      'DDG'
    ],
    'CA': [
      'CA',
      'CB',
      'BM'
    ],
    'SS': [
      'SS',
      'SSV'
    ],
    'CL': [
      'CL'
    ],
    'Others': [
      'AR',
      'AE',
      'BM'
    ]
  }

  constructor() {}
}
