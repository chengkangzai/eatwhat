import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {

    version = '0.0.1';

    constructor(
        private modalController: ModalController
    ) {

    }

    ngOnInit() {
    }

    async onClose(){
        await this.modalController.dismiss();
    }
}