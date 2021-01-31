import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  CreditCardComponent,
  CurrencyService,
  MaterialModule,
  PaymentService,
  UserService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import * as _ from 'lodash';
import { MockComponent } from 'ng-mocks';
import { BehaviorSubject, of } from 'rxjs';
import { CardsComponent } from './cards.component';

describe('CardsComponent', () => {
  let component: CardsComponent;
  let fixture: ComponentFixture<CardsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), MaterialModule, FormsModule],
      declarations: [CardsComponent, MockComponent(CreditCardComponent)],
      providers: [
        {
          provide: CurrencyService,
          useValue: {
            toNumber: (amount: string) => {},
          },
        },
        {
          provide: PaymentService,
          useValue: {
            cards: () => Promise.resolve([]),
            chargeCard: () => {},
            deleteCard: (id: string) => {},
            updateCard: (card: any) => {},
          },
        },
        {
          provide: UserService,
          useValue: {
            $selectedOrganization: new BehaviorSubject(null).asObservable(),
            $selectedOrgInfo: of({}),
            $profile: of({ user: { is_superuser: false } }),
            $selectedOrgBillable: new BehaviorSubject(null).asObservable(),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: _.noop(),
          },
        },
        {
          provide: MatDialog,
          useValue: {
            open: () => {
              return { afterClosed: () => new BehaviorSubject('') };
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsComponent);
    component = fixture.componentInstance;
    window['Spreedly'] = {
      init: () => {},
      on: () => {},
      removeHandlers: () => {},
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should allow a normal user without any cards to add a payment method', async () => {
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.isSuperUser).toBe(false);
    expect(component.cardLimit).toBe(3);
    const componentElement: HTMLElement = fixture.nativeElement;
    expect(componentElement.textContent).toContain('CREDIT_CARD.ADD');
  });

  it('should prevent a normal user with 3 cards from adding a payment method', async () => {
    const paymentService = TestBed.inject(PaymentService);
    spyOn(paymentService, 'cards').and.returnValue(
      Promise.resolve(<any>[{ id: 1 }, { id: 2 }, { id: 3 }])
    );

    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.isSuperUser).toBe(false);
    expect(component.cardLimit).toBe(3);

    const componentElement: HTMLElement = fixture.nativeElement;
    expect(componentElement.textContent).toContain('CREDIT_CARD.LIMIT_REACHED');
  });

  it('should allow a super user with 3 cards to add a payment method', async () => {
    const userService = TestBed.inject(UserService);
    const paymentService = TestBed.inject(PaymentService);
    userService.$profile = of(<any>{ user: { is_superuser: true } });
    spyOn(paymentService, 'cards').and.returnValue(
      Promise.resolve(<any>[{ id: 1 }, { id: 2 }, { id: 3 }])
    );

    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.isSuperUser).toBe(true);
    expect(component.cardLimit).toBe(3);

    const componentElement: HTMLElement = fixture.nativeElement;
    expect(componentElement.textContent).toContain('CREDIT_CARD.ADD');

    userService.$profile = of(<any>{ user: { is_superuser: false } });
  });

  it('should have an increased limit if set', async () => {
    const userService = TestBed.inject(UserService);
    userService.$selectedOrgInfo = of(<any>{ 'card-limit': 5 });

    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.isSuperUser).toBe(false);
    expect(component.cardLimit).toBe(5);

    userService.$selectedOrgInfo = of(<any>{});
  });
});
