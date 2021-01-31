import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { FontBottomSheetComponent } from './font-bottom-sheet.component';

describe('FontBottomSheetComponent', () => {
  let component: FontBottomSheetComponent;
  let fixture: ComponentFixture<FontBottomSheetComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot()],
      declarations: [FontBottomSheetComponent],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FontBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
