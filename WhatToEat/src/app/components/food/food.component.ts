import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Food} from '../../model/food';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Url} from 'url';

@Component({
    selector: 'app-food',
    templateUrl: './food.component.html',
    styleUrls: ['./food.component.scss'],
})
export class FoodComponent implements OnInit {

    @Input() food: Food;
    @Input() mode: 'EDIT' | 'SHOW';

    imgSrc: Url;
    form: FormGroup;

    constructor(
        private modalController: ModalController,
    ) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            food: new FormControl(this.food.food, {
                updateOn: 'change',
                validators: [Validators.required]
            })
        });

        this.imgSrc = `https://ui-avatars.com/api/?name=${this.food.food}&rounded=true&background=random&size=16`;
    }

    async onClose() {
        await this.modalController.dismiss({
            mode: 'CLOSE'
        });
    }

    async onSubmitForm() {
        await this.modalController.dismiss({
            mode: 'CREATE',
            form: this.form
        });
    }
}
