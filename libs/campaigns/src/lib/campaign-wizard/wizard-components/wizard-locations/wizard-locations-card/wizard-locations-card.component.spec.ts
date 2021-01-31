import { AgmMap, AgmMarker } from '@agm/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';
import {
  AbbreviateStatePipe,
  Environment,
  ImageViewerDirective,
  MaterialModule,
  Sign,
  SignFacing,
  TranslationService,
} from '@marketplace/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { MockComponents, MockDirective, MockPipes } from 'ng-mocks';
import { of } from 'rxjs';
import { CampaignWizardService } from '../../../../services/campaign-wizard/campaign-wizard.service';
import { WizardLocationsCardComponent } from './wizard-locations-card.component';

describe('WizardLocationsCardComponent', () => {
  let component: WizardLocationsCardComponent;
  let fixture: ComponentFixture<WizardLocationsCardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          WizardLocationsCardComponent,
          MockDirective(ImageViewerDirective),
          MockPipes(TranslatePipe, AbbreviateStatePipe),
          MockComponents(AgmMap, AgmMarker),
        ],
        imports: [MaterialModule, MatDatepickerModule, MatNativeDateModule],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {},
          },
          {
            provide: TranslateService,
            useValue: {},
          },
          {
            provide: TranslationService,
            useValue: {
              getTranslation: (key: string) => {
                return of(key);
              },
            },
          },
          {
            provide: CampaignWizardService,
            useValue: {
              removeSigns: (_sign: Sign) => _.noop,
              addUniqueSign: (_sign: Sign) => _.noop,
              addSigns: (_signs: Sign) => _.noop,
            },
          },
          {
            provide: Environment,
            useValue: {},
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardLocationsCardComponent);
    component = fixture.componentInstance;
    component.sign = <Sign>{
      flip_duration: 8,
      height: 200,
      width: 704,
      lat: 0,
      lon: 0,
      name: 'test',
      ordered: true,
      timezone: '',
      total_slots: 8,
      photos: [
        { id: 'a', url: '' },
        { id: 'b', url: '' },
        { id: 'c', url: '' },
      ],
      unique_sign: false,
    };
    component.signSelected = false;
    component.render.next(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove sign when toggled if selected', () => {
    component.signSelected = true;
    const remove = spyOn(
      TestBed.inject(CampaignWizardService),
      'removeSigns'
    ).and.callThrough();
    component.toggleSelected();
    expect(remove).toHaveBeenCalledWith(component.sign);
  });

  it('should add sign when toggled if not selected and not unique', () => {
    const add = spyOn(
      TestBed.inject(CampaignWizardService),
      'addSigns'
    ).and.callThrough();
    component.toggleSelected();
    expect(add).toHaveBeenCalledWith(component.sign);
  });

  it('should add unique sign when toggled if not selected and not unique', () => {
    component.sign.unique_sign = true;
    const addUnique = spyOn(
      TestBed.inject(CampaignWizardService),
      'addUniqueSign'
    ).and.callThrough();
    component.toggleSelected();
    expect(addUnique).toHaveBeenCalledWith(component.sign);
  });

  // Timing issues
  // it('should expand collapsible when toggled and not expanded', async () => {
  //   await new Promise((r) => setTimeout(r, 200));
  //   fixture.whenStable().then(() => {
  //     component.expanded = false;
  //     component.renderCardMap = true;
  //     component.toggleCollapsible();
  //     expect(component.collapsible.nativeElement.style.maxHeight).toEqual(
  //       component.collapsible.nativeElement.scrollHeight + 150 + 'px'
  //     );
  //     expect(component.description.nativeElement.style.whiteSpace).toEqual(
  //       'normal'
  //     );
  //     expect(component.description.nativeElement.style.height).toEqual(
  //       'inherit'
  //     );
  //     expect(component.name.nativeElement.style.whiteSpace).toEqual('normal');
  //     expect(component.name.nativeElement.style.height).toEqual('inherit');
  //     expect(component.expanded).toEqual(true);
  //   });
  // });

  // Timing issues
  // it('should collapse collapsible when toggled and expanded', async () => {
  //   await new Promise((r) => setTimeout(r, 200));
  //   fixture.whenStable().then(() => {
  //     component.expanded = true;
  //     component.toggleCollapsible();
  //     expect(component.collapsible.nativeElement.style.maxHeight).toBeFalsy();
  //     expect(component.description.nativeElement.style.whiteSPace).toBeFalsy();
  //     expect(component.description.nativeElement.style.height).toBeFalsy();
  //     expect(component.name.nativeElement.style.whiteSpace).toBeFalsy();
  //     expect(component.name.nativeElement.style.height).toBeFalsy();
  //     expect(component.expanded).toEqual(false);
  //   });
  // });

  it('should return S traffic direction for N facing sign', () => {
    const translate = spyOn(component, 'translate').and.callThrough();
    const trafficDirection = component.trafficDirection(SignFacing.N);
    expect(translate).toHaveBeenCalledWith('DIRECTIONS.S');
    expect(trafficDirection).toEqual(
      'CAMPAIGN.CREATION.SIGN_LIST.DIRECTIONS.S'
    );
  });

  it('should return S traffic direction for N facing sign', () => {
    const translate = spyOn(component, 'translate').and.callThrough();
    const trafficDirection = component.trafficDirection(SignFacing.S);
    expect(translate).toHaveBeenCalledWith('DIRECTIONS.N');
    expect(trafficDirection).toEqual(
      'CAMPAIGN.CREATION.SIGN_LIST.DIRECTIONS.N'
    );
  });

  it('should return W traffic direction for E facing sign', () => {
    const translate = spyOn(component, 'translate').and.callThrough();
    const trafficDirection = component.trafficDirection(SignFacing.E);
    expect(translate).toHaveBeenCalledWith('DIRECTIONS.W');
    expect(trafficDirection).toEqual(
      'CAMPAIGN.CREATION.SIGN_LIST.DIRECTIONS.W'
    );
  });

  it('should return E traffic direction for W facing sign', () => {
    const translate = spyOn(component, 'translate').and.callThrough();
    const trafficDirection = component.trafficDirection(SignFacing.W);
    expect(translate).toHaveBeenCalledWith('DIRECTIONS.E');
    expect(trafficDirection).toEqual(
      'CAMPAIGN.CREATION.SIGN_LIST.DIRECTIONS.E'
    );
  });

  it('should return SW traffic direction for NE facing sign', () => {
    const translate = spyOn(component, 'translate').and.callThrough();
    const trafficDirection = component.trafficDirection(SignFacing.NE);
    expect(translate).toHaveBeenCalledWith('DIRECTIONS.SW');
    expect(trafficDirection).toEqual(
      'CAMPAIGN.CREATION.SIGN_LIST.DIRECTIONS.SW'
    );
  });

  it('should return SE traffic direction for NW facing sign', () => {
    const translate = spyOn(component, 'translate').and.callThrough();
    const trafficDirection = component.trafficDirection(SignFacing.NW);
    expect(translate).toHaveBeenCalledWith('DIRECTIONS.SE');
    expect(trafficDirection).toEqual(
      'CAMPAIGN.CREATION.SIGN_LIST.DIRECTIONS.SE'
    );
  });

  it('should return NW traffic direction for SE facing sign', () => {
    const translate = spyOn(component, 'translate').and.callThrough();
    const trafficDirection = component.trafficDirection(SignFacing.SE);
    expect(translate).toHaveBeenCalledWith('DIRECTIONS.NW');
    expect(trafficDirection).toEqual(
      'CAMPAIGN.CREATION.SIGN_LIST.DIRECTIONS.NW'
    );
  });

  it('should return NE traffic direction for SW facing sign', () => {
    const translate = spyOn(component, 'translate').and.callThrough();
    const trafficDirection = component.trafficDirection(SignFacing.SW);
    expect(translate).toHaveBeenCalledWith('DIRECTIONS.NE');
    expect(trafficDirection).toEqual(
      'CAMPAIGN.CREATION.SIGN_LIST.DIRECTIONS.NE'
    );
  });

  it('should change image to last image', () => {
    component.changeImage(-1);
    expect(component.imageIndex).toEqual(component.sign.photos.length - 1);
  });

  it('should change image to first image', () => {
    component.changeImage(component.sign.photos.length);
    expect(component.imageIndex).toEqual(0);
  });

  it('should change image to selected index', () => {
    component.changeImage(1);
    expect(component.imageIndex).toEqual(1);
  });
});
