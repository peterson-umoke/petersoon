import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIcon } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute } from '@angular/router';
import {
  SafePipe,
  SnackBarService,
  TranslationService,
  UserService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockComponent } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { RewardsComponent } from './rewards.component';

describe('RewardsComponent', () => {
  let component: RewardsComponent;
  let fixture: ComponentFixture<RewardsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [RewardsComponent, SafePipe, MockComponent(MatIcon)],
      imports: [MatToolbarModule, MatTabsModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: EMPTY },
        },
        {
          provide: SnackBarService,
          useValue: {},
        },
        {
          provide: TranslationService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: { $profile: EMPTY },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
