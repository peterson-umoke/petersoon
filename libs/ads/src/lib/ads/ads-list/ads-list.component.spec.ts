import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  FilterPipe,
  ImageViewerDirective,
  MaterialModule,
  SearchService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockComponent, MockDirective } from 'ng-mocks';
import { BehaviorSubject } from 'rxjs';
import { AdMenuComponent } from '../../../../../core/src/lib/components/ad-menu/ad-menu.component';
import { AdsListComponent } from './ads-list.component';

describe('AdsListComponent', () => {
  let component: AdsListComponent;
  let fixture: ComponentFixture<AdsListComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        NoopAnimationsModule,
      ],
      declarations: [
        AdsListComponent,
        MockComponent(AdMenuComponent),
        MockDirective(ImageViewerDirective),
      ],
      providers: [
        { provide: FilterPipe, useValue: {} },
        {
          provide: SearchService,
          useValue: {
            type: (type: string) => {
              return new BehaviorSubject('');
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsListComponent);
    component = fixture.componentInstance;
    component.ads = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
