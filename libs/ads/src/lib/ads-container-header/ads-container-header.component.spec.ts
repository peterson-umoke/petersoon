import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  MaterialModule,
  RouterService,
  SearchService,
  VerificationsService,
  ViewTypeService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { EMPTY } from 'rxjs';
import { AdsContainerHeaderComponent } from './ads-container-header.component';

describe('AdsContainerHeaderComponent', () => {
  let component: AdsContainerHeaderComponent;
  let fixture: ComponentFixture<AdsContainerHeaderComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        FormsModule,
        NoopAnimationsModule,
      ],
      declarations: [AdsContainerHeaderComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParamMap: EMPTY } },
        { provide: RouterService, useValue: { $route: EMPTY } },
        { provide: SearchService, useValue: {} },
        { provide: VerificationsService, useValue: { $verifications: EMPTY } },
        { provide: ViewTypeService, useValue: { type: () => EMPTY } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsContainerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
