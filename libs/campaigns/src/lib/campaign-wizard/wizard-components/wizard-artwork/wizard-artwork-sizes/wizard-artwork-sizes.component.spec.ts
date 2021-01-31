import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageOutlineComponent, MaterialModule } from '@marketplace/core';
import { TranslatePipe } from '@ngx-translate/core';
import * as _ from 'lodash';
import { MockComponent, MockPipe } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { WizardImageSizesService } from '../../../../services/campaign-wizard/wizard-image-sizes/wizard-image-sizes.service';
import { WizardArtworkSizesComponent } from './wizard-artwork-sizes.component';

describe('WizardArtworkSizesComponent', () => {
  let component: WizardArtworkSizesComponent;
  let fixture: ComponentFixture<WizardArtworkSizesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          WizardArtworkSizesComponent,
          MockComponent(ImageOutlineComponent),
          MockPipe(TranslatePipe),
        ],
        imports: [MaterialModule, BrowserAnimationsModule],
        providers: [
          {
            provide: WizardImageSizesService,
            useValue: {
              signSizes$: EMPTY,
              reducedSizes$: EMPTY,
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardArtworkSizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
