import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  FirestoreService,
  MaterialModule,
  OrganizationService,
  PhoneNumberService,
  SnackBarService,
  UserService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import { CreateOrganizationComponent } from './create-organization.component';

describe('CreateOrganizationComponent', () => {
  let component: CreateOrganizationComponent;
  let fixture: ComponentFixture<CreateOrganizationComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      declarations: [CreateOrganizationComponent],
      providers: [
        {
          provide: FirestoreService,
          useValue: {
            getBusinessTypes: () => new BehaviorSubject([]),
          },
        },
        {
          provide: UserService,
          useValue: {
            $profile: new BehaviorSubject({
              organizations: [],
              user: {},
            }),
          },
        },
        { provide: MatDialog, useValue: {} },
        { provide: OrganizationService, useValue: {} },
        { provide: PhoneNumberService, useValue: {} },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {} } },
        },
        { provide: SnackBarService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
