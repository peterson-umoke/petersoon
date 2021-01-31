import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  AdsService,
  FilterPipe,
  MaterialModule,
  PlaylistService,
  SnackBarService,
  TranslationService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { EMPTY } from 'rxjs';
import { AdPlaylistCreativePickerComponent } from './ad-playlist-creative-picker.component';

describe('AdPlaylistCreativePickerComponent', () => {
  let component: AdPlaylistCreativePickerComponent;
  let fixture: ComponentFixture<AdPlaylistCreativePickerComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot(), FormsModule],
      declarations: [AdPlaylistCreativePickerComponent],
      providers: [
        { provide: AdsService, useValue: { ads$: EMPTY } },
        { provide: FilterPipe, useValue: {} },
        { provide: PlaylistService, useValue: { $playlistAdsArray: EMPTY } },
        { provide: SnackBarService, useValue: {} },
        {
          provide: TranslationService,
          useValue: { getTranslation: () => EMPTY },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdPlaylistCreativePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
