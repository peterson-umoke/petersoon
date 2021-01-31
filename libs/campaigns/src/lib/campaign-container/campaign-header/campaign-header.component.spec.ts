import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  CampaignService,
  MaterialModule,
  RouterService,
  TitleService,
  UserService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockComponent } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { CampaignPlayPauseComponent } from '../../campaign-play-pause/campaign-play-pause.component';
import { CampaignHeaderComponent } from './campaign-header.component';

describe('CampaignHeaderComponent', () => {
  let component: CampaignHeaderComponent;
  let fixture: ComponentFixture<CampaignHeaderComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot(), RouterTestingModule],
      declarations: [
        CampaignHeaderComponent,
        MockComponent(CampaignPlayPauseComponent),
      ],
      providers: [
        { provide: CampaignService, useValue: {} },
        { provide: RouterService, useValue: {} },
        { provide: TitleService, useValue: {} },
        { provide: UserService, useValue: { $selectedOrganization: EMPTY } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
