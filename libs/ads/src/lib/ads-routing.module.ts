import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AdPlaylistDetailsComponent,
  AdPlaylistsComponent,
  AdsComponent,
  AdsContainerComponent,
  AdsModule,
  AdVerificationsComponent,
} from '@marketplace/ads';

const routes: Routes = [
  {
    path: '',
    component: AdsContainerComponent,
    children: [
      { path: '', component: AdsComponent },
      { path: 'playlists', component: AdPlaylistsComponent },
      { path: 'playlists/new', component: AdPlaylistDetailsComponent },
      { path: 'playlists/:id', component: AdPlaylistDetailsComponent },
      { path: 'verifications', component: AdVerificationsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), AdsModule],
  exports: [RouterModule],
})
export class AdsRoutingModule {}
