import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule, PlaylistService } from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockComponents } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { WebTriggersComponent } from '../../web-triggers/web-triggers.component';
import { AdPlaylistSidenavComponent } from './ad-playlist-sidenav.component';

describe('AdPlaylistSidenavComponent', () => {
  let component: AdPlaylistSidenavComponent;
  let fixture: ComponentFixture<AdPlaylistSidenavComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [
        AdPlaylistSidenavComponent,
        MockComponents(WebTriggersComponent),
      ],
      providers: [
        { provide: PlaylistService, useValue: { $playlistDetail: EMPTY } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdPlaylistSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
