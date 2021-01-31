import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AdsService,
  MaterialModule,
  PlaylistService,
  UserService,
  VerificationsService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockComponents } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { AdPlaylistCreativePickerComponent } from './ad-playlists/ad-playlist-creative-picker/ad-playlist-creative-picker.component';
import { AdPlaylistSidenavComponent } from './ad-playlists/ad-playlist-sidenav/ad-playlist-sidenav.component';
import { AdsContainerHeaderComponent } from './ads-container-header/ads-container-header.component';
import { AdsContainerComponent } from './ads-container.component';
import { AdsDetailComponent } from './ads/ads-detail/ads-detail.component';

describe('AdsContainerComponent', () => {
  let component: AdsContainerComponent;
  let fixture: ComponentFixture<AdsContainerComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      declarations: [
        AdsContainerComponent,
        MockComponents(
          AdsDetailComponent,
          AdPlaylistSidenavComponent,
          AdPlaylistCreativePickerComponent,
          AdsContainerHeaderComponent
        ),
      ],
      providers: [
        { provide: AdsService, useValue: {} },
        { provide: ActivatedRoute, useValue: { queryParamMap: EMPTY } },
        { provide: PlaylistService, useValue: {} },
        { provide: UserService, useValue: { $selectedOrganization: EMPTY } },
        { provide: VerificationsService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
