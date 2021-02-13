import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ViewPageRoutingModule} from './view-routing.module';

import {ViewPage} from './view.page';
import {Ng2SearchPipeModule} from 'ng2-search-filter';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ViewPageRoutingModule,
        Ng2SearchPipeModule
    ],
    declarations: [ViewPage]
})
export class ViewPageModule {
}
