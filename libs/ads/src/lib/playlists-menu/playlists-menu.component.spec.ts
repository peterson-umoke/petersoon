import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import {
  GoogleAnalyticsDirective,
  MaterialModule,
  PlaylistService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockDirective } from 'ng-mocks';
import { PlaylistsMenuComponent } from './playlists-menu.component';

describe('PlaylistsMenuComponent', () => {
  let component: PlaylistsMenuComponent;
  let fixture: ComponentFixture<PlaylistsMenuComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot(), RouterTestingModule],
      declarations: [
        PlaylistsMenuComponent,
        MockDirective(GoogleAnalyticsDirective),
      ],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: PlaylistService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
