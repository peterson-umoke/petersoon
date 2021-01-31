import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ArtworkGeneratorComponent } from '@marketplace/ads';
import { MaterialModule } from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponents } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { WizardAdsComponent } from './wizard-ads/wizard-ads.component';
import { WizardArtworkComponent } from './wizard-artwork.component';
import { WizardAdUploaderComponent } from './wizard-uploader/wizard-ad-uploader.component';

describe('WizardArtworkComponent', () => {
  let component: WizardArtworkComponent;
  let fixture: ComponentFixture<WizardArtworkComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          WizardArtworkComponent,
          MockComponents(
            WizardAdsComponent,
            ArtworkGeneratorComponent,
            WizardAdUploaderComponent
          ),
        ],
        imports: [MaterialModule, TranslateModule],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { params: EMPTY },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardArtworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
