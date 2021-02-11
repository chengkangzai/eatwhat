import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {TagsPageRoutingModule} from './tags-routing.module';

import {TagsPage} from './tags.page';
import {NgxAuthFirebaseUIModule} from 'ngx-auth-firebaseui';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IonicModule,
        TagsPageRoutingModule,
        NgxAuthFirebaseUIModule
    ],
    declarations: [TagsPage]
})
export class TagsPageModule {
}
