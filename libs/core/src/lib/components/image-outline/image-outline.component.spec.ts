import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MaterialModule } from '../../modules';
import { ImageOutlineComponent } from './image-outline.component';

describe('ImageOutlineComponent', () => {
  let component: ImageOutlineComponent;
  let fixture: ComponentFixture<ImageOutlineComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot()],
      declarations: [ImageOutlineComponent],
      providers: [
        { provide: HAMMER_LOADER, useValue: () => new Promise(() => {}) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageOutlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
