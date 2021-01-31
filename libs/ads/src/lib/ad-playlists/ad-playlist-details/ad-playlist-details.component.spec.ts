import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule, PlaylistService } from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { EMPTY } from 'rxjs';
import { AdPlaylistDetailsComponent } from './ad-playlist-details.component';

describe('AdPlaylistDetailsComponent', () => {
  let component: AdPlaylistDetailsComponent;
  let fixture: ComponentFixture<AdPlaylistDetailsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      declarations: [AdPlaylistDetailsComponent],
      providers: [
        { provide: PlaylistService, useValue: { $playlistAdDelete: EMPTY } },
        { provide: ActivatedRoute, useValue: { params: EMPTY } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdPlaylistDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
