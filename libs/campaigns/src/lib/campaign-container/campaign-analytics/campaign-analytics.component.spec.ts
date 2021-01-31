import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CampaignService,
  MaterialModule,
  TranslationService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { configureTestSuite } from 'ng-bullet';
import { MockComponents } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { CampaignFlipsComponent } from '../campaign-flips/campaign-flips.component';
import { CampaignAnalyticsComponent } from './campaign-analytics.component';

describe('CampaignAnalyticsComponent', () => {
  let component: CampaignAnalyticsComponent;
  let fixture: ComponentFixture<CampaignAnalyticsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot(), NgxChartsModule],
      declarations: [
        CampaignAnalyticsComponent,
        MockComponents(CampaignFlipsComponent),
      ],
      providers: [
        { provide: CampaignService, useValue: { $campaign: EMPTY } },
        {
          provide: TranslationService,
          useValue: { getTranslation: () => EMPTY },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
