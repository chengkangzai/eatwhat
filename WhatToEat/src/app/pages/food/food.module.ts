import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {FoodPage} from './food.page';

import {FoodPageRoutingModule} from './food-routing.module';
import {NgxAuthFirebaseUIModule} from 'ngx-auth-firebaseui';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        ReactiveFormsModule,
        FoodPageRoutingModule,
        NgxAuthFirebaseUIModule
    ],
    declarations: [FoodPage]
})
export class FoodPageModule {
}
