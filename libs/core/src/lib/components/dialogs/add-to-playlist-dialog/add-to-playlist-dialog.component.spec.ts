import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import { MaterialModule } from '../../../modules';
import { PlaylistService } from '../../../services';
import { AddToPlaylistDialogComponent } from './add-to-playlist-dialog.component';

describe('AddToPlaylistDialogComponent', () => {
  let component: AddToPlaylistDialogComponent;
  let fixture: ComponentFixture<AddToPlaylistDialogComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      declarations: [AddToPlaylistDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {},
          },
        },
        {
          provide: PlaylistService,
          useValue: {
            $playlists: new BehaviorSubject([]),
            updatePlaylist: () => {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToPlaylistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
