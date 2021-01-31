import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Campaign,
  CampaignType,
  ImageViewerDirective,
  MaterialModule,
  TranslationService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockComponents, MockDirective } from 'ng-mocks';
import { CampaignMenuComponent } from '../campaign-menu/campaign-menu.component';
import { CampaignPlayPauseComponent } from '../campaign-play-pause/campaign-play-pause.component';
import { WaitingToLaunchComponent } from '../waiting-to-launch/waiting-to-launch.component';
import { CampaignCardComponent } from './campaign-card.component';

describe('CampaignCardComponent', () => {
  let component: CampaignCardComponent;
  let fixture: ComponentFixture<CampaignCardComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot(), RouterTestingModule],
      declarations: [
        CampaignCardComponent,
        MockComponents(
          CampaignMenuComponent,
          CampaignPlayPauseComponent,
          WaitingToLaunchComponent
        ),
        MockDirective(ImageViewerDirective),
      ],
      providers: [{ provide: TranslationService, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignCardComponent);
    component = fixture.componentInstance;
    component.campaign = new Campaign({
      campaign_type: CampaignType.STANDARD,
      id: 'c1',
      name: 'Test Campaign',
      thumbnails: ['a'],
    });
  });

  it('should create imageNumber and links', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.imageNumber).toEqual([{ display: '1', index: 0 }]);
    expect(component.analytics).toBe('/campaigns/c1/analytics');
  });

  it('should limit the image numbers', () => {
    component.campaign = new Campaign({
      campaign_type: CampaignType.STANDARD,
      id: 'c1',
      name: 'Test Campaign 2',
      thumbnails: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.imageNumber).toEqual([
      { display: '1', index: 0 },
      { display: '2', index: 1 },
      { display: '3', index: 2 },
      { display: '4', index: 3 },
      { display: '5', index: 4 },
      { display: '6', index: 5 },
      { display: '7', index: 6 },
      { display: '...', index: 7 },
    ]);
    expect(component.analytics).toBe('/campaigns/c1/analytics');
  });
});
