import { TestBed } from '@angular/core/testing';

import { GetmusicService } from './getmusic.service';

describe('GetmusicService', () => {
  let service: GetmusicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetmusicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
