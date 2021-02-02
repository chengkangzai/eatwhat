import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FoodPage } from './food.page';

const routes: Routes = [
  {
    path: '',
    component: FoodPage,
  },  {
    path: 'view',
    loadChildren: () => import('./view/view.module').then( m => m.ViewPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoodPageRoutingModule {}
