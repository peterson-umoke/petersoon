import { inject, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import {
  LoadingService,
  SnackBarService,
  TranslationService,
  UserService,
} from '../..';
import { PlaylistApiService } from '../../../api';
import { PlaylistService } from './playlist.service';

describe('PlaylistService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlaylistService,
        { provide: PlaylistApiService, useValue: {} },
        { provide: LoadingService, useValue: {} },
        { provide: SnackBarService, useValue: {} },
        {
          provide: TranslationService,
          useValue: { getTranslation: () => EMPTY },
        },
        { provide: UserService, useValue: { $selectedOrganization: EMPTY } },
      ],
    });
  });

  it('should be created', inject(
    [PlaylistService],
    (service: PlaylistService) => {
      expect(service).toBeTruthy();
    }
  ));
});
