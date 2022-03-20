import { TestBed } from '@angular/core/testing';

import { TutorialAmazonAnchorsService } from './tutorial-amazon-anchors.service';

describe('TutorialAmazonAnchorsService', () => {
  let service: TutorialAmazonAnchorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TutorialAmazonAnchorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
