import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {Food} from '../model/food';
import {AngularFireAuth} from '@angular/fire/auth';
import {first, map, tap} from 'rxjs/operators';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;


export interface FoodInterface {
    id: string;
    food: string;
    user: string;
    timestamp?: Timestamp;
    tags?: string[];
}

@Injectable({
    providedIn: 'root'
})
export class FoodService {

    constructor(
        private firestore: AngularFirestore,
        private authService: AngularFireAuth,
    ) {
    }

    // tslint:disable-next-line:variable-name
    private _food = new BehaviorSubject<Food[]>([]);

    get food(): Observable<Food[]> {
        return this._food.asObservable();
    }

    async fetch(): Promise<Subscription> {
        return this.authService.authState.pipe(first()).subscribe(user => {
            return this.firestore.collection<FoodInterface>(`user/${user.uid}/food`).valueChanges({idField: 'id'}).pipe(
                map(resData => {
                    const temp = [];
                    resData.forEach(data => {
                        temp.push(new Food(
                            data.id,
                            data.food,
                            data.user,
                            (data.timestamp ? data.timestamp : null),
                            (data.tags ? data.tags : null)
                        ));
                    });
                    return temp;
                })
                , tap(food => {
                    return this._food.next(food);
                })
            ).subscribe();
        });
    }


    async update(oriFood: Food, newFood: Food): Promise<Subscription> {
        return this.authService.authState.subscribe(user => {
            newFood.timestamp = Timestamp.now();
            newFood.userID = user.uid;
            return this.firestore.doc(`user/${user.uid}/food/${oriFood.id}`).set(
                JSON.parse(JSON.stringify(newFood))
            );
        });
    }

    async delete(food: Food): Promise<Subscription> {
        return this.authService.authState.subscribe(user => {
            return this.firestore.doc(`user/${user.uid}/food/${food.id}`).delete();
        });
    }

    async add(food: Food): Promise<Subscription> {
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

}
