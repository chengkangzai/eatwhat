import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {PrivacyPageRoutingModule} from './privacy-routing.module';

import {PrivacyPage} from './privacy.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PrivacyPageRoutingModule
    ],
    declarations: [PrivacyPage],
    schemas: [NO_ERRORS_SCHEMA]
})
export class PrivacyPageModule {
}
