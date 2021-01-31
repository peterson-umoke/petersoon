import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { Environment } from '../../models';
import { MaterialModule } from '../../modules';
import { AdsService, UploadService } from '../../services';
import { AdUploadComponent } from './ad-upload.component';

describe('AdUploadComponent', () => {
  let component: AdUploadComponent;
  let fixture: ComponentFixture<AdUploadComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        MatDatepickerModule,
        MatNativeDateModule,
      ],
      declarations: [AdUploadComponent],
      providers: [
        {
          provide: AdsService,
          useValue: { getAds: () => {} },
        },
        {
          provide: UploadService,
          useValue: {
            newUploader: () => Promise.resolve({}),
            prepareFilesForUpload: () => {},
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {},
        },
        {
          provide: Environment,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
