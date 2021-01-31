import { AgmMap, AgmMarker } from '@agm/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FlexLayoutModule, MediaObserver } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  BingMapsService,
  Environment,
  MaterialModule,
  Sign,
  SignCluster,
  SignFilter,
} from '@marketplace/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe, ngMocks } from 'ng-mocks';
import { Subject } from 'rxjs';
import { first, skip } from 'rxjs/operators';
import { CampaignWizardService } from '../../../services/campaign-wizard/campaign-wizard.service';
import { WizardLocationsService } from '../../../services/campaign-wizard/wizard-locations/wizard-locations.service';
import { WizardLocationsCardComponent } from './wizard-locations-card/wizard-locations-card.component';
import { WizardLocationsComponent } from './wizard-locations.component';

class Polygon {}

describe('WizardLocationsComponent', () => {
  let component: WizardLocationsComponent;
  let fixture: ComponentFixture<WizardLocationsComponent>;
  const selectedSigns = new Subject();
  const visibleClusters = new Subject();
  const visibleSigns = new Subject();
  const selectedFilter = new Subject();
  const allowAddingSigns = new Subject();
  const allowAddingUniqueSign = new Subject();
  const mediaChanges = new Subject();
  const signs = [
    { id: 'a', name: 'signa' } as Sign,
    { id: 'b', name: 'signb' } as Sign,
  ];
  const clusters = [
    { signs: signs, lat: '45.1', lon: '45.2', icon: null } as SignCluster,
  ];
  const STANDARD_ITEM_SIZE = 156;
  const MOBILE_ITEM_SIZE = 337;

  beforeAll(() => {
    window.google = <any>{
      maps: {
        Polygon: Polygon,
      },
    };
  });

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          WizardLocationsComponent,
          MockComponents(WizardLocationsCardComponent, AgmMap, AgmMarker),
          MockPipe(TranslatePipe),
        ],
        imports: [FlexLayoutModule, MaterialModule, BrowserAnimationsModule],
        providers: [
          { provide: BingMapsService, useValue: {} },
          {
            provide: WizardLocationsService,
            useValue: {
              selectedFilter$: selectedFilter.asObservable(),
              visibleSigns$: visibleSigns.asObservable(),
              visibleClusters$: visibleClusters.asObservable(),
              selectedSigns$: selectedSigns.asObservable(),
              updateMapBounds: (_bounds) => visibleClusters.next(clusters),
              updateSelectedFilter: (_filter) =>
                selectedFilter.next(SignFilter.AVAILABLE),
            },
          },
          {
            provide: CampaignWizardService,
            useValue: {
              allowAddingSigns$: allowAddingSigns.asObservable(),
              allowAddingUniqueSign$: allowAddingUniqueSign.asObservable(),
              selectedSigns$: selectedSigns.asObservable(),
              addSigns: (_signs) => selectedSigns.next(signs),
              removeSigns: () => selectedSigns.next([]),
            },
          },
          { provide: Environment, useValue: {} },
          {
            provide: MediaObserver,
            useValue: {
              asObservable: () => mediaChanges.asObservable(),
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should observe selected signs count', () => {
    component.selectedSignsCount$.pipe(first()).subscribe((count) => {
      expect(count).toEqual(2);
    });
    selectedSigns.next([{ id: 'a' }, { id: 'b' }]);
  });

  it('should observe selected filter', () => {
    component.selectedFilter$.pipe(first()).subscribe((filter) => {
      expect(filter).toEqual(SignFilter.ALL);
    });
    selectedFilter.next(SignFilter.ALL);
  });

  it('should observe visible signs', () => {
    component.visibleSigns$.pipe(first()).subscribe((visible) => {
      expect(visible).toEqual(signs);
    });
    visibleSigns.next(signs);
  });

  it('should observe visible clusters', () => {
    component.visibleClusters$.pipe(first()).subscribe((visible) => {
      expect(visible).toEqual(clusters);
    });
    visibleClusters.next(clusters);
  });

  it('should observe visible sign count', () => {
    component.visibleSignsCount$.pipe(first()).subscribe((visible) => {
      expect(visible).toEqual(2);
    });
    visibleSigns.next(signs);
  });

  it('should observe allow adding signs', () => {
    component.allowAddingSigns$.pipe(first()).subscribe((allow) => {
      expect(allow).toEqual(true);
    });
    allowAddingSigns.next(true);
  });

  it('should observe allow adding unique sign', () => {
    component.allowAddingUniqueSign$.pipe(first()).subscribe((allow) => {
      expect(allow).toEqual(true);
    });
    allowAddingUniqueSign.next(true);
  });

  it('should observe if screen is lt-md', () => {
    component.ltMd$.pipe(first()).subscribe((ltmd) => {
      expect(ltmd).toEqual(true);
    });
    mediaChanges.next([{ mqAlias: 'lt-md' }]);
  });

  it('should observe item size', () => {
    component.itemSize$.pipe(first()).subscribe((size) => {
      expect(size).toEqual(MOBILE_ITEM_SIZE);
    });
    mediaChanges.next([{ mqAlias: 'lt-md' }]);
  });

  it('should observe render card maps', () => {
    component.renderCardMaps$.pipe(first()).subscribe((render) => {
      expect(render).toEqual(true);
    });
    mediaChanges.next([{ mqAlias: 'lt-sm' }]);
  });

  it('should update bounds', () => {
    component.visibleClusters$.pipe(first()).subscribe((visible) => {
      expect(visible).toEqual(clusters);
    });
    const mockAgmMap = ngMocks.find<AgmMap>('agm-map').componentInstance;
    mockAgmMap.boundsChange.emit(<any>{});
    component.updateVisible();
  });

  it('should filter signs', () => {
    component.selectedFilter$.pipe(first()).subscribe((filter) => {
      expect(filter).toEqual(SignFilter.AVAILABLE);
    });
    component.filterSigns(SignFilter.AVAILABLE);
  });

  it('should add visible signs', () => {
    component.selectedSignsCount$.pipe(skip(1)).subscribe((count) => {
      expect(count).toEqual(2);
    });
    component.addVisibleSigns();
  });

  it('should remove all signs', () => {
    component.selectedSignsCount$.pipe(first()).subscribe((count) => {
      expect(count).toEqual(0);
    });
    component.removeAllSigns();
  });

  it('should deselect selected cluster', () => {
    //TODO IMPROVE
    component.deselectClusters();
  });

  it('should signal if sign marker clicked', () => {
    expect(component.signMarkerClicked(signs[0])).toEqual(false);
  });

  it('should toggle map expand', () => {
    component.mapExpand = false;
    component.toggleMapExpand();
    expect(component.mapExpand).toEqual(true);
  });
});
