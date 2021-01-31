import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  MaterialModule,
  PaymentDetailsComponent,
  PaymentService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockComponent } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { CardDetailsComponent } from './card-details.component';

describe('CardDetailsComponent', () => {
  let component: CardDetailsComponent;
  let fixture: ComponentFixture<CardDetailsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot(), RouterTestingModule],
      declarations: [
        CardDetailsComponent,
        MockComponent(PaymentDetailsComponent),
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: EMPTY } },
        { provide: PaymentService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
