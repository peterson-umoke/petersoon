import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { CurrencyDirective } from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockDirective, MockModule } from 'ng-mocks';
import { AddCreditDialogComponent } from './add-credit-dialog.component';

describe('AddCreditDialogComponent', () => {
  let component: AddCreditDialogComponent;
  let fixture: ComponentFixture<AddCreditDialogComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddCreditDialogComponent,
        MockDirective(CurrencyDirective),
      ],
      imports: [
        MockModule(FormsModule),
        MockModule(ReactiveFormsModule),
        MockModule(TranslateModule),

        // Material Modules
        MockModule(MatDialogModule),
        MockModule(MatFormFieldModule),
        MockModule(MatSelectModule),
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCreditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should select close-button and close dialog ref', () => {
    spyOn(component.dialogRef, 'close').and.callThrough();
    fixture.debugElement
      .query(By.css('button[data-test=close-button]'))
      .nativeElement.click();
    expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
  });
});
