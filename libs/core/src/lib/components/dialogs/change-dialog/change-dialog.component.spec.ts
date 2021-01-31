import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { EMPTY } from 'rxjs';
import { MaterialModule } from '../../../modules';
import { TranslationService } from '../../../services';
import { ChangeDialogComponent } from './change-dialog.component';

describe('ChangeDialogComponent', () => {
  let component: ChangeDialogComponent;
  let fixture: ComponentFixture<ChangeDialogComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot()],
      declarations: [ChangeDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {},
          },
        },
        {
          provide: TranslationService,
          useValue: {
            getTranslation: () => EMPTY,
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
