import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FoodPage } from './food.page';

const routes: Routes = [
  {
    path: '',
    component: FoodPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoodPageRoutingModule {}
