import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppRoutes, AuthService, LoadingService } from '@marketplace/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @ViewChild('email', { static: false }) emailInput: ElementRef;

  public loading = true;
  public loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });
  public registerRoute = AppRoutes.REGISTER;

  constructor(
    private authService: AuthService,
    public loadingService: LoadingService // Used in HTML
  ) {
    this.authService.initialize();
    this.setFocus();
  }

  public forgotPassword(): void {
    if (this.loginForm.controls.email.invalid) {
      this.emailInput.nativeElement.focus();
      this.authService.enterEmail();
      return;
    }
    this.authService.forgotPassword(this.loginForm.controls.email.value);
  }

  public facebook(): void {
    this.authService.facebook();
  }

  public google(): void {
    this.authService.google();
  }

  public async login() {
    if (this.loginForm.invalid) {
      this.authService.invalidCredentials();
      return;
    }
    this.authService.login(
      this.loginForm.controls.email.value,
      this.loginForm.controls.password.value
    );
  }

  private setFocus() {
    if (this.emailInput && this.emailInput.nativeElement) {
      this.emailInput.nativeElement.focus();
    } else {
      setTimeout(() => {
        this.setFocus();
      });
    }
  }
}
