import { TestBed } from '@angular/core/testing';

import { LoadingSkeletonService } from './loading-skeleton.service';

describe('LoadingSkeletonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoadingSkeletonService = TestBed.get(LoadingSkeletonService);
    expect(service).toBeTruthy();
  });
});
