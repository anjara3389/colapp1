import { TestBed } from '@angular/core/testing';

import { GoogleDriveProviderService } from './google-drive-provider.service';

describe('GoogleDriveProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoogleDriveProviderService = TestBed.get(GoogleDriveProviderService);
    expect(service).toBeTruthy();
  });
});
