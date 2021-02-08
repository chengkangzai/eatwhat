import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {BehaviorSubject} from 'rxjs';
import {Food} from '../model/food';
import {AngularFireAuth} from '@angular/fire/auth';
import {first, map, tap} from 'rxjs/operators';
import {AlertController, IonItemSliding, ModalController, ToastController} from '@ionic/angular';
import {FormGroup} from '@angular/forms';
import firebase from 'firebase/app';
import {FoodComponent} from '../components/food/food.component';
import FirebaseError = firebase.FirebaseError;
import Timestamp = firebase.firestore.Timestamp;


interface FoodInterface {
    id: string;
    food: string;
    user: string;
    timestamp?: Timestamp;
}

@Injectable({
    providedIn: 'root'
})
export class FoodService {

    // tslint:disable-next-line:variable-name
    private _food = new BehaviorSubject<Food[]>([]);

    constructor(
        private firestore: AngularFirestore,
        private authService: AngularFireAuth,
        private alertController: AlertController,
        private toaster: ToastController,
        private modalController: ModalController
    ) {
    }


    get food() {
        return this._food.asObservable();
    }

    async fetch() {
        await this.authService.authState.pipe(first()).subscribe(user => {
            return this.firestore.collection(`user/${user.uid}/food`).valueChanges({idField: 'id'}).pipe(
                map(resData => {
                    const temp = [];
                    (resData as FoodInterface[]).forEach(data => {
                        temp.push(new Food(data.id, data.food, data.user, (data.timestamp ? data.timestamp : null)));
                    });
                    return temp;
                })
                , tap(food => {
                    return this._food.next(food);
                })
            ).subscribe();
        });
    }


    async update(oriFood: Food, newFood: Food) {
        return this.authService.authState.subscribe(user => {
            newFood.timestamp = Timestamp.now();
            newFood.userID = user.uid;
            return this.firestore.doc(`user/${user.uid}/food/${oriFood.id}`).set(
                JSON.parse(JSON.stringify(newFood))
            );
        });
    }

    async delete(food: Food) {
        return this.authService.authState.subscribe(user => {
            return this.firestore.doc(`user/${user.uid}/food/${food.id}`).delete();
        });
    }

    async add(food: Food) {
        const id = this.firestore.createId();
        return this.authService.authState.subscribe(user => {
            food.id = id;
            food.timestamp = Timestamp.now();
            food.userID = user.uid;
            return this.firestore.collection(`user/${user.uid}/food/`).doc(id).set(
                JSON.parse(JSON.stringify(food))
            );
        });
    }

    async onSubmitForm(form: FormGroup) {
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

        await this.add(new Food('', form.value.food, '')).then(async () => {
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

    async onEdit(f: Food, itemSliding: IonItemSliding) {
        const modal = await this.modalController.create({
            component: FoodComponent,
            componentProps: {
                food: f,
                mode: 'EDIT'
            },
            backdropDismiss: false,
        });
        await modal.present();
        await itemSliding.close();
        const {data} = await modal.onDidDismiss();

        if (data.mode === 'CREATE') {
            await this.update(f, new Food('', data.form.value.food, ''));
            await this.toaster.create({
                message: 'Updated',
                duration: 1000,
            });
        }
    }

    async onDelete(f: Food, itemSliding: IonItemSliding) {
        const alert = await this.alertController.create({
            header: 'Delete',
            message: `are you sure you want to delete the Food '${f.food}' ?`,
            buttons: [{
                text: 'Cancel',
                role: 'cancel'
            }, {
                text: 'Delete',
                handler: () => {
                    this.delete(f);
                }
            }]
        });
        await alert.present();
        await itemSliding.close();
    }

    async onShow(f: Food, itemSliding: IonItemSliding) {
        const modal = await this.modalController.create({
            component: FoodComponent,
            componentProps: {
                food: f,
                mode: 'SHOW'
            }
        });
        await modal.present();
        await itemSliding.close();
    }


}
