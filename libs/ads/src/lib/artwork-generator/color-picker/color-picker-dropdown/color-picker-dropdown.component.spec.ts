import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { ColorPickerDropdownComponent } from './color-picker-dropdown.component';

describe('ColorPickerDropdownComponent', () => {
  let component: ColorPickerDropdownComponent;
  let fixture: ComponentFixture<ColorPickerDropdownComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ColorPickerDropdownComponent, ColorPickerComponent],
      providers: [
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
        { provide: MatBottomSheetRef, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
