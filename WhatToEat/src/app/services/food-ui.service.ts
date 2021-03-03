import {Injectable} from '@angular/core';
import {Food} from '../model/food';
import {AlertController, IonItemSliding, ModalController, ToastController} from '@ionic/angular';
import {FoodComponent} from '../components/food/food.component';
import {FoodService} from './food.service';
import {FormGroup} from '@angular/forms';
import firebase from 'firebase';
import FirebaseError = firebase.FirebaseError;

@Injectable({
    providedIn: 'root'
})
export class FoodUIService {

    constructor(
        private modalController: ModalController,
        private toaster: ToastController,
        private foodService: FoodService,
        private alertController: AlertController
    ) {
    }

    /**
     * Handle the UI when the food in on Edit
     * @param food the food that need to Edit
     * @param itemSliding the sliding item of the food
     */
    async onEdit(food: Food, itemSliding: IonItemSliding): Promise<void> {
        const modal = await this.modalController.create({
            component: FoodComponent,
            componentProps: {
                food,
                mode: 'EDIT'
            },
            backdropDismiss: false,
        });
        await modal.present();
        await itemSliding.close();
    }

    /**
     * Handle the UI when the food in on Show
     * @param food the food that need to Show
     * @param itemSliding the sliding item of the food
     */
    async onShow(food: Food, itemSliding: IonItemSliding): Promise<void> {
        const modal = await this.modalController.create({
            component: FoodComponent,
            componentProps: {
                food,
                mode: 'SHOW'
            }
        });
        await modal.present();
        await itemSliding.close();
    }

    /**
     * Handle the UI when the food in on SubmitForm
     * @param form the form where food is submitted
     */
    async onSubmitForm(form: FormGroup): Promise<void> {
        if (form.invalid) {
            const alert = await this.alertController.create({
                message: 'Please add your food into text input ',
                buttons: [{
                    text: 'Ok',
                    role: 'cancel',
                }]
            });
            await alert.present();
            return;
        }

        await this.foodService.add(new Food('', form.value.food, ''))
            .then(async () => {
                const toast = await this.toaster.create({
                    message: `${form.value.food} Added`,
                    duration: 1000
                });
                await toast.present();
                form.reset();
            }).catch(async (err: FirebaseError) => {
                const toast = await this.toaster.create({
                    message: `Error Occur! Please contact developer on this regard ${err.message}`,
                    duration: 1000,
                    color: 'danger'
                });
                await toast.present();
            });
    }

    /**
     * Handle the UI when the food in on Delete
     * @param food the food that need to Delete
     * @param itemSliding the sliding item of the food
     */
    async onDelete(food: Food, itemSliding: IonItemSliding): Promise<void> {
        const alert = await this.alertController.create({
            header: 'Delete',
            message: `are you sure you want to delete the Food '${food.food}' ?`,
            buttons: [{
                text: 'Cancel',
                role: 'cancel'
            }, {
                text: 'Delete',
                handler: () => {
                    this.foodService.delete(food);
                }
            }]
        });
        await alert.present();
        await itemSliding.close();
    }
}
