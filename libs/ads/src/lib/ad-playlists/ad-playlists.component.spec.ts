import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  FilterPipe,
  MaterialModule,
  PlaylistService,
  SearchService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockComponent } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { PlaylistsMenuComponent } from '../playlists-menu/playlists-menu.component';
import { AdPlaylistsComponent } from './ad-playlists.component';

describe('AdPlaylistsComponent', () => {
  let component: AdPlaylistsComponent;
  let fixture: ComponentFixture<AdPlaylistsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      declarations: [
        AdPlaylistsComponent,
        MockComponent(PlaylistsMenuComponent),
      ],
      providers: [
        { provide: FilterPipe, useValue: {} },
        { provide: PlaylistService, useValue: { $playlists: EMPTY } },
        { provide: SearchService, useValue: { type: () => EMPTY } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdPlaylistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
