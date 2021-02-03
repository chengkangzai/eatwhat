import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './auth.page';
import {NgxAuthFirebaseUIModule} from 'ngx-auth-firebaseui';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AuthPageRoutingModule,
        NgxAuthFirebaseUIModule
    ],
  declarations: [AuthPage]
})
export class AuthPageModule {}
