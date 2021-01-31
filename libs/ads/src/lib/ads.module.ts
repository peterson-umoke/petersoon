import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule, MaterialModule } from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { AdPlaylistCreativePickerComponent } from './ad-playlists/ad-playlist-creative-picker/ad-playlist-creative-picker.component';
import { AdPlaylistDetailsComponent } from './ad-playlists/ad-playlist-details/ad-playlist-details.component';
import { AdPlaylistSidenavComponent } from './ad-playlists/ad-playlist-sidenav/ad-playlist-sidenav.component';
import { AdPlaylistsComponent } from './ad-playlists/ad-playlists.component';
import { AdVerificationsComponent } from './ad-verifications/ad-verifications.component';
import { AdsContainerHeaderComponent } from './ads-container-header/ads-container-header.component';
import { AdsContainerComponent } from './ads-container.component';
import { AdsDetailComponent } from './ads/ads-detail/ads-detail.component';
import { AdsListComponent } from './ads/ads-list/ads-list.component';
import { AdsComponent } from './ads/ads.component';
import { ArtworkGeneratorComponent } from './artwork-generator/artwork-generator.component';
import { ColorPickerDropdownComponent } from './artwork-generator/color-picker/color-picker-dropdown/color-picker-dropdown.component';
import { ColorPickerComponent } from './artwork-generator/color-picker/color-picker/color-picker.component';
import { FontBottomSheetComponent } from './artwork-generator/font-bottom-sheet/font-bottom-sheet.component';
import { GeneratorCarouselComponent } from './artwork-generator/generator-template-carousel/generator-template-carousel.component';
import { GeneratorTemplateComponent } from './artwork-generator/generator-template/generator-template.component';
import { PlaylistsMenuComponent } from './playlists-menu/playlists-menu.component';
import { WebTriggersComponent } from './web-triggers/web-triggers.component';

export const components: any[] = [
  AdPlaylistCreativePickerComponent,
  AdPlaylistDetailsComponent,
  AdPlaylistSidenavComponent,
  AdPlaylistsComponent,
  AdVerificationsComponent,
  AdsContainerComponent,
  AdsContainerHeaderComponent,
  AdsDetailComponent,
  AdsListComponent,
  AdsComponent,
  AdsContainerHeaderComponent,
  PlaylistsMenuComponent,
  WebTriggersComponent,
  AdsContainerComponent,
  ArtworkGeneratorComponent,
  GeneratorTemplateComponent,
  GeneratorCarouselComponent,
  ColorPickerComponent,
  ColorPickerDropdownComponent,
  FontBottomSheetComponent,
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [
    CoreModule,
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
  ],
})
export class AdsModule {}
