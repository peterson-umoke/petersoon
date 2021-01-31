import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import {
  Campaign,
  CampaignType,
  ImageViewerDirective,
  MaterialModule,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockDirective } from 'ng-mocks';
import { WaitingToLaunchComponent } from './waiting-to-launch.component';

describe('WaitingToLaunchComponent', () => {
  let component: WaitingToLaunchComponent;
  let fixture: ComponentFixture<WaitingToLaunchComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule, MaterialModule, TranslateModule.forRoot()],
      declarations: [
        WaitingToLaunchComponent,
        MockDirective(ImageViewerDirective),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingToLaunchComponent);
    component = fixture.componentInstance;
    component.campaign = new Campaign({
      campaign_type: CampaignType.STANDARD,
      name: 'Test Campaign',
      thumbnails: [],
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
