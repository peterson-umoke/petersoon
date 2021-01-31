import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdsService, MaterialModule, UploadService } from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { WizardImageSizesService } from '../../../../services/campaign-wizard/wizard-image-sizes/wizard-image-sizes.service';
import { WizardUploaderRowComponent } from './uploader-row/wizard-uploader-row.component';
import { WizardAdUploaderComponent } from './wizard-ad-uploader.component';

describe('WizardAdUploaderComponent', () => {
  let component: WizardAdUploaderComponent;
  let fixture: ComponentFixture<WizardAdUploaderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          WizardAdUploaderComponent,
          MockComponent(WizardUploaderRowComponent),
        ],
        imports: [TranslateModule, MaterialModule, FormsModule],
        providers: [
          {
            provide: WizardImageSizesService,
            useValue: {
              imageSignMatches$: EMPTY,
              reducedMatches$: EMPTY,
              missingMatches$: EMPTY,
            },
          },
          {
            provide: AdsService,
            useValue: {
              viewAdDetails: () => {},
              adDetail$: EMPTY,
            },
          },
          {
            provide: ActivatedRoute,
            useValue: {
              queryParams: EMPTY,
            },
          },
          {
            provide: UploadService,
            useValue: {
              imagesUploadedToAd$: EMPTY,
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardAdUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
