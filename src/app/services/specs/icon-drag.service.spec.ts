import { TestBed } from '@angular/core/testing';

import { IconDragService } from './icon-drag.service';

describe('IconDragService', () => {
  let service: IconDragService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IconDragService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
