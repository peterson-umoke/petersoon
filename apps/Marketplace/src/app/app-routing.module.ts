import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomPreloadingStrategy } from './app-preloading.module';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { RegisterSuccessComponent } from './register-success/register-success.component';
import { RegisterComponent } from './register/register.component';
import { RewardsComponent } from './rewards/rewards.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register/success', component: RegisterSuccessComponent },
  { path: '', redirectTo: 'campaigns', pathMatch: 'full' },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'das',
        loadChildren: () =>
          import('@marketplace/ads-routing').then((m) => m.AdsRoutingModule),
        // data: { preload: true },
      },
      // View campaign cards and list routes
      {
        path: 'campaigns',
        loadChildren: () =>
          import('@marketplace/campaigns').then((m) => m.CampaignsModule),
        // data: { preload: true },
      },
      {
        path: 'cards',
        loadChildren: () =>
          import('@marketplace/cards').then((m) => m.CardsModule),
      },
      {
        path: 'preferences',
        loadChildren: () =>
          import('@marketplace/preferences').then((m) => m.PreferencesModule),
      },
      {
        path: 'organizations',
        loadChildren: () =>
          import('@marketplace/organizations').then(
            (m) => m.OrganizationsModule
          ),
      },
      {
        path: 'payments',
        loadChildren: () =>
          import('@marketplace/payments').then((m) => m.PaymentsModule),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('@marketplace/reports').then((m) => m.ReportsModule),
      },
      { path: 'rewards', component: RewardsComponent },
      {
        path: 'users',
        loadChildren: () =>
          import('@marketplace/users').then((m) => m.UsersModule),
      },
      // {
      //   path: 'check-campaigns',
      //   loadChildren: () =>
      //     import('@marketplace/campaign').then((m) => m.CampaignModule),
      //   canActivate: [AuthGuard, HasCampaignsGuard],
      // },
    ],
  },
  { path: '**', redirectTo: '/campaigns' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false,
      preloadingStrategy: CustomPreloadingStrategy,
    }),
  ],
  exports: [RouterModule],
  providers: [CustomPreloadingStrategy],
})
export class AppRoutingModule {}
