import { TestBed } from '@angular/core/testing';

import { NgxErrorBoundaryService } from './ngx-error-boundary.service';

describe('NgxErrorBoundaryService', () => {
  let service: NgxErrorBoundaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxErrorBoundaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
