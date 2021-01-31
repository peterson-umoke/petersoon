import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DesignLinkComponent, URL } from './design-link.component';

describe('DesignLinkComponent', () => {
  let component: DesignLinkComponent;
  let fixture: ComponentFixture<DesignLinkComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [DesignLinkComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a link with the correct url', () => {
    expect(component.designTeamUrl).toBe(URL);
  });
});
