import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { MockComponents } from 'ng-mocks';
import { CampaignsContainerComponent } from './campaigns-container.component';
import { CampaignsHeaderComponent } from './campaigns-header/campaigns-header.component';

xdescribe('CampaignsContainerComponent', () => {
  let component: CampaignsContainerComponent;
  let fixture: ComponentFixture<CampaignsContainerComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        CampaignsContainerComponent,
        MockComponents(CampaignsHeaderComponent),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
