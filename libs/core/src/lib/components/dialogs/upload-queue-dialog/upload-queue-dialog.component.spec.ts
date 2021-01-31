import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockModule } from 'ng-mocks';
import { AdsService } from '../../../services';
import { UploadQueueDialogComponent } from './upload-queue-dialog.component';

describe('UploadQueueDialogComponent', () => {
  let component: UploadQueueDialogComponent;
  let fixture: ComponentFixture<UploadQueueDialogComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [UploadQueueDialogComponent],
      imports: [
        MockModule(FormsModule),
        MockModule(ReactiveFormsModule),
        MockModule(TranslateModule),

        // Material Modules
        MockModule(MatButtonModule),
        MockModule(MatDialogModule),
        MockModule(MatFormFieldModule),
        MockModule(MatIconModule),
        MockModule(MatProgressBarModule),
        MockModule(MatTooltipModule),
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            uploader: {
              files: [{ name: 'books.jpg' }],
              clearQueue: () => {},
            },
          },
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {},
          },
        },
        {
          provide: AdsService,
          useValue: {
            createAd: () => Promise.resolve({}),
            deleteImage: () => {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadQueueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
