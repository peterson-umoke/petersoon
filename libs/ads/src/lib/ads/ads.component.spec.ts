import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AdsCardComponent,
  AdsService,
  AdUploadComponent,
  DesignLinkComponent,
  FilterPipe,
  SearchService,
  ViewTypeService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockComponents } from 'ng-mocks';
import { BehaviorSubject } from 'rxjs';
import { AdMenuComponent } from '../../../../core/src/lib/components/ad-menu/ad-menu.component';
import { AdsListComponent } from './ads-list/ads-list.component';
import { AdsComponent } from './ads.component';

describe('AdsComponent', () => {
  let component: AdsComponent;
  let fixture: ComponentFixture<AdsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        AdsComponent,
        MockComponents(
          AdMenuComponent,
          AdUploadComponent,
          AdsCardComponent,
          AdsListComponent,
          DesignLinkComponent
        ),
      ],
      providers: [
        {
          provide: AdsService,
          useValue: {
            adsLoaded$: new BehaviorSubject<boolean>(false),
            ads$: new BehaviorSubject([]),
          },
        },
        {
          provide: SearchService,
          useValue: { type: (type: string) => new BehaviorSubject('') },
        },
        {
          provide: ViewTypeService,
          useValue: { type: (type: string) => new BehaviorSubject(0) },
        },
        {
          provide: FilterPipe,
          useValue: {
            transform: (ads: any[], type: string, search: string) => [],
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
