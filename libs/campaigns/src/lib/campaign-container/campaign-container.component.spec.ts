import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockComponents } from 'ng-mocks';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { CampaignContainerComponent } from './campaign-container.component';
import { CampaignHeaderComponent } from './campaign-header/campaign-header.component';

describe('CampaignContainerComponent', () => {
  let component: CampaignContainerComponent;
  let fixture: ComponentFixture<CampaignContainerComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot(), RouterTestingModule],
      declarations: [
        CampaignContainerComponent,
        MockComponents(CampaignHeaderComponent),
      ],
      providers: [{ provide: ActivatedRoute, useValue: { params: EMPTY } }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
