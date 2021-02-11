import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {FoodService} from '../../services/food.service';
import {Subscription} from 'rxjs';
import {Food} from '../../model/food';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastController} from '@ionic/angular';
import {FoodUIService} from '../../services/food-ui.service';

@Component({
    selector: 'app-tab1',
    templateUrl: 'food.page.html',
    styleUrls: ['food.page.scss']
})
export class FoodPage implements OnInit {
    // TODO Search Food

    foods: Food[];
    foodSub: Subscription;
    isLoading = true;
    selectedFood: Food;

    form: FormGroup;

    constructor(
        private foodService: FoodService,
        private router: Router,
        private auth: AngularFireAuth,
        private toastController: ToastController,
        public foodUIService: FoodUIService,
    ) {
    }

    async onSignOut() {
        await this.auth.signOut().then(() => this.router.navigateByUrl('/auth'));
    }

    ngOnInit() {
        this.foodSub = this.foodService.food.subscribe((foods) => {
            this.foods = foods;
        });
        this.foodService.fetch().then(() => {
            this.isLoading = false;
        });

        this.form = new FormGroup({
            food: new FormControl(null, {
                updateOn: 'change',
                validators: [Validators.required]
            })
        });
    }

    doRefresh($event) {
        this.foodService.fetch().then(() => {
            $event.target.complete();
        });
    }

    async selectFood() {
        if (this.foods.length <= 1) {
            const msg = this.foods.length === 1 ? 'Bloody Hell only have one food what you want to choose La' : 'Kindly Add your favorite food to the collection ';
            const toaster = await this.toastController.create({
                message: msg,
                duration: 2000,
                color: 'danger'
            });
            await toaster.present();
            return;
        }

        const interval = setInterval(() => {
            this.selectedFood = this.foods[Math.floor(Math.random() * this.foods.length)];
        }, 50);

        setTimeout(() => {
            clearInterval(interval);
        }, Math.floor(Math.random() * 2000));
    }
}
