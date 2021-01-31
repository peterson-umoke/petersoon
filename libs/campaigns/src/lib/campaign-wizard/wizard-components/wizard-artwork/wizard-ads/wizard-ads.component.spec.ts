import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AdsCardComponent,
  AdsService,
  AdUploadComponent,
  DesignLinkComponent,
  MaterialModule,
} from '@marketplace/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { CampaignWizardService } from '../../../../services/campaign-wizard/campaign-wizard.service';
import { WizardImageSizesService } from '../../../../services/campaign-wizard/wizard-image-sizes/wizard-image-sizes.service';
import { WizardArtworkSizesComponent } from '../wizard-artwork-sizes/wizard-artwork-sizes.component';
import { WizardAdsComponent } from './wizard-ads.component';

describe('WizardAdsComponent', () => {
  let component: WizardAdsComponent;
  let fixture: ComponentFixture<WizardAdsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          WizardAdsComponent,
          MockComponents(
            AdUploadComponent,
            WizardArtworkSizesComponent,
            AdsCardComponent,
            DesignLinkComponent
          ),
          MockPipe(TranslatePipe),
        ],
        imports: [
          MaterialModule,
          MatDatepickerModule,
          MatNativeDateModule,
          RouterTestingModule,
        ],
        providers: [
          { provide: AdsService, useValue: { ads$: EMPTY } },
          { provide: ActivatedRoute, useValue: {} },
          { provide: CampaignWizardService, useValue: { selectedAds$: EMPTY } },
          {
            provide: WizardImageSizesService,
            useValue: { missingMatches$: EMPTY },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
