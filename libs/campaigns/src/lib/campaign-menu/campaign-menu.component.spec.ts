import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
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
import { BehaviorSubject } from 'rxjs';
import { CampaignMenuComponent } from './campaign-menu.component';

describe('CampaignMenuComponent', () => {
  let component: CampaignMenuComponent;
  let fixture: ComponentFixture<CampaignMenuComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        CampaignMenuComponent,
        MockDirective(GoogleAnalyticsDirective),
      ],
      imports: [MaterialModule, TranslateModule.forRoot(), RouterTestingModule],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: () => ({ afterClosed: () => new BehaviorSubject(true) }),
          },
        },
        { provide: CampaignsService, useValue: { deleteCampaign: () => {} } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignMenuComponent);
    component = fixture.componentInstance;
    component.campaign = new Campaign({
      campaign_type: CampaignType.STANDARD,
      name: 'Test Campaign',
    });
    fixture.detectChanges();
  });

  it('should select delete campaign button and close dialog ref', () => {
    const open = spyOn(TestBed.inject(MatDialog), 'open').and.callThrough();
    component.campaign.deleted = true;
    fixture.detectChanges();
    component.delete();
    expect(open).toHaveBeenCalled();
  });
});
