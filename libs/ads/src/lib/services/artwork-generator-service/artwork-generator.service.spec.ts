import { NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  AdsService,
  Environment,
  HttpService,
  SnackBarService,
  TranslationService,
  UploadService,
  UserService,
} from '@marketplace/core';
import * as _ from 'lodash';
import { of } from 'rxjs';
import { ArtworkGeneratorService } from './artwork-generator.service';

describe('ArtworkGeneratorService', () => {
  let service: ArtworkGeneratorService;
  beforeEach(() => {
    service = new ArtworkGeneratorService(
      <UploadService>(<any>{
        newUploader: () => Promise.resolve(),
      }),
      <TranslationService>(<any>{
        getTranslation: () => of({}),
      }),
      <SnackBarService>(<any>{
        open: _.noop,
      }),
      <AdsService>{},
      <NgZone>{},
      <MatDialog>{},
      <HttpService>{},
      <Environment>{},
      <UserService>(<any>{
        $selectedOrganization: of({ name: 'Blip' }),
      })
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should recalculate character count upon image upload and removal', () => {
    let charCount;
    service.charCount$.subscribe((val) => (charCount = val));
    expect(charCount).toBe(35);

    const changes = {
      headline: 'HEADLINE',
      subhead: 'SUBHEAD',
      third: 'THIRD',
    };
    service.updateText(changes);
    expect(charCount).toBe(40);

    const file: File = new File([], 'File Name');
    service.uploadImage(file, (_result) => {
      expect(charCount).toBe(45);
      return _result;
    });

    service.updateImageURL(null);
    expect(charCount).toBe(40);
  });
});
