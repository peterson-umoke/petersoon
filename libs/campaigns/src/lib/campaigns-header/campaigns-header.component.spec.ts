import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { CampaignsHeaderComponent } from './campaigns-header.component';

xdescribe('CampaignsHeaderComponent', () => {
  let component: CampaignsHeaderComponent;
  let fixture: ComponentFixture<CampaignsHeaderComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [CampaignsHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
