import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AdsService,
  GoogleAnalyticsDirective,
  MaterialModule,
  PlaylistService,
  UploadService,
  VerificationsService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockDirective } from 'ng-mocks';
import { AdMenuComponent } from './ad-menu.component';

describe('AdMenuComponent', () => {
  let component: AdMenuComponent;
  let fixture: ComponentFixture<AdMenuComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot()],
      declarations: [AdMenuComponent, MockDirective(GoogleAnalyticsDirective)],
      providers: [
        {
          provide: AdsService,
          useValue: {
            deleteAd: () => Promise.resolve(true),
            viewAdDetails: () => {},
            getAds: () => {},
          },
        },
        {
          provide: PlaylistService,
          useValue: {
            getPlaylists: () => ({ setOptions: () => {} }),
          },
        },
        {
          provide: UploadService,
          useValue: {
            newUploader: () => Promise.resolve({ setOptions: () => {} }),
            getCurrentResolutions: () => {},
            prepareFilesForUpload: () => Promise.resolve(0),
          },
        },
        {
          provide: VerificationsService,
          useValue: {
            getVerifications: () => {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdMenuComponent);
    component = fixture.componentInstance;
    component.ad = { name: '' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
