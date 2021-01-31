import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardDetailsComponent } from './card-details/card-details.component';
import { CardsComponent } from './cards/cards.component';

const routes: Routes = [
  { path: '', component: CardsComponent },
  { path: ':cardId', component: CardDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardsRoutingModule {}
