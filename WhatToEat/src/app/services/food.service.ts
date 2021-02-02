import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {BehaviorSubject} from 'rxjs';
import {Food} from '../model/food';
import {AngularFireAuth} from '@angular/fire/auth';
import {first, map, tap} from 'rxjs/operators';
import {AlertController, IonItemSliding, ToastController} from '@ionic/angular';
import {FormGroup} from '@angular/forms';
import firebase from 'firebase';
import {HttpClient} from '@angular/common/http';
import FirebaseError = firebase.FirebaseError;


interface FoodInterface {
    id: string;
    food: string;
    user: string;
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
        private http: HttpClient
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
                        temp.push(new Food(data.id, data.food, data.user));
                    });
                    console.log(temp);
                    return temp;
                })
                , tap(food => {
                    return this._food.next(food);
                })
            ).subscribe();
        });
    }


    async update(oriFood: Food, food: string) {
        return this.authService.authState.subscribe(user => {
            return this.firestore.doc(`user/${user.uid}/food/${oriFood.id}`).set({
                food
            });
        });
    }

    async delete(food: Food) {
        return this.authService.authState.subscribe(user => {
            return this.firestore.doc(`user/${user.uid}/food/${food.id}`).delete();
        });
    }

    async add(food: string) {
        const id = this.firestore.createId();
        return this.authService.authState.subscribe(user => {
            return this.firestore.collection(`user/${user.uid}/food/`).doc(id).set({
                food,
                user: user.email,
            });
        });
    }

    async onSubmitForm(form: FormGroup) {
        if (form.invalid) {
            const alert = await this.alertController.create({
                message: 'Please add your food first ',
                buttons: [{
                    text: 'Ok',
                    role: 'cancel',
                }]
            });
            await alert.present();
            return;
        }

        await this.add(form.value.food).then(async () => {
            const toast = await this.toaster.create({
                message: `${form.value.food} Added`,
                duration: 1000
            });
            await toast.present();
            form.reset();
        }).catch(async (err: FirebaseError) => {
            const toast = await this.toaster.create({
                header: 'Error',
                message: `Error Occur! Please contact developer on this regard ${err.message}`,
                duration: 1000,
                color: 'danger'
            });
            await toast.present();
        });
    }

    async onEdit(f: Food, itemSliding: IonItemSliding) {
        const alert = await this.alertController.create({
            header: 'Edit',
            message: 'Change the name of the food ',
            inputs: [{
                name: 'fName',
                type: 'text',
                placeholder: 'New Name',
                value: f.food
            }],
            buttons: [{
                text: 'Cancel',
                role: 'cancel'
            }, {
                text: 'Save',
                handler: (input) => {
                    console.log(input.fName);
                    this.update(f, input.fName);
                }
            }]
        });
        await alert.present();
        await itemSliding.close();
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
        const alert = await this.alertController.create({
            header: 'Show',
            message: f.food,
            buttons: [{
                text: 'Delete',
                role: 'destructive',
                cssClass: 'danger',
                handler: () => {
                    this.onDelete(f, itemSliding);
                }
            }, {
                text: 'Edit',
                handler: () => {
                    this.onEdit(f, itemSliding);
                }
            }, {
                text: 'OK',
                role: 'cancel'
            }]
        });
        await alert.present();
        await itemSliding.close();
    }


}
