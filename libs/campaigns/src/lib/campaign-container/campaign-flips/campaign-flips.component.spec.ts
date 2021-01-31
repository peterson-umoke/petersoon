import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MediaObserver } from '@angular/flex-layout';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { EMPTY } from 'rxjs';
import { CampaignFlipsComponent } from './campaign-flips.component';

describe('CampaignFlipsComponent', () => {
  let component: CampaignFlipsComponent;
  let fixture: ComponentFixture<CampaignFlipsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        NoopAnimationsModule,
      ],
      declarations: [CampaignFlipsComponent],
      providers: [
        { provide: MediaObserver, useValue: { asObservable: () => EMPTY } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignFlipsComponent);
    // class LatLng {
    // }
    // _.set(window, 'google.maps.LatLng', LatLng);
    component = fixture.componentInstance;
    component.signs = [
      {
        city: 'Some City',
        flips: 1234,
        id: 'id',
        impressions: 1234,
        lat: 1,
        location: 'Some Location',
        lon: 3,
        name: 'Sign Name',
        spent: 200,
      },
    ];
    spyOn(component, 'initHeatmap');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
