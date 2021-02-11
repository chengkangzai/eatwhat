import {Component, OnDestroy, OnInit} from '@angular/core';
import {FoodService} from '../../../services/food.service';
import {Food} from '../../../model/food';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FoodUIService} from '../../../services/food-ui.service';

@Component({
    selector: 'app-view',
    templateUrl: './view.page.html',
    styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit, OnDestroy {

    form: FormGroup;
    foods: Food[];
    foodSub: Subscription;
    isLoading = true;

    limit = 10;

    constructor(
        private foodService: FoodService,
        public foodUIService: FoodUIService
    ) {
    }

    ngOnInit() {
        this.foodSub = this.foodService.food.subscribe((food) => {
            this.foods = food;
        });
        this.foodService.fetch().then(() => {
            this.isLoading = false;
        });
        this.form = new FormGroup({
            food: new FormControl(null, {
                updateOn: 'blur',
                validators: [Validators.required]
            })
        });
    }

    ngOnDestroy() {
        if (this.foodSub) {
            this.foodSub.unsubscribe();
        }
    }


}
