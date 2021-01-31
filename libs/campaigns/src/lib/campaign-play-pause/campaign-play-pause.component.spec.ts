import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Campaign,
  CampaignsService,
  CampaignType,
  GoogleAnalyticsDirective,
  MaterialModule,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockDirective } from 'ng-mocks';
import { CampaignPlayPauseComponent } from './campaign-play-pause.component';

describe('CampaignPlayPauseComponent', () => {
  let component: CampaignPlayPauseComponent;
  let fixture: ComponentFixture<CampaignPlayPauseComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot()],
      declarations: [
        CampaignPlayPauseComponent,
        MockDirective(GoogleAnalyticsDirective),
      ],
      providers: [
        {
          provide: CampaignsService,
          useValue: {
            updateCampaign: (campaign: any) => Promise.resolve({}),
            goToPage: () => {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignPlayPauseComponent);
    component = fixture.componentInstance;
    component.campaign = new Campaign({
      campaign_type: CampaignType.STANDARD,
      name: 'Test Campaign',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
