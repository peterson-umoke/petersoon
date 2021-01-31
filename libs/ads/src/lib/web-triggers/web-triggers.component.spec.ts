import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MaterialModule,
  ScraperApiService,
  SnackBarService,
  TranslationService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { WebTriggersComponent } from './web-triggers.component';

describe('WebTriggersComponent', () => {
  let component: WebTriggersComponent;
  let fixture: ComponentFixture<WebTriggersComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      declarations: [WebTriggersComponent],
      providers: [
        { provide: ScraperApiService, useValue: {} },
        { provide: SnackBarService, useValue: {} },
        { provide: TranslationService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebTriggersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
