import { TestBed } from '@angular/core/testing';

import { S1Service } from './s1.service';

describe('S1Service', () => {
  let service: S1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(S1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
