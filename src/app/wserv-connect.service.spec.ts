import { TestBed } from '@angular/core/testing';

import { WservConnectService } from './wserv-connect.service';

describe('WservConnectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WservConnectService = TestBed.get(WservConnectService);
    expect(service).toBeTruthy();
  });
});
