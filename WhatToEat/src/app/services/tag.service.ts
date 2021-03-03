import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {Tag} from '../model/tag';
import {AngularFirestore} from '@angular/fire/firestore';
import {first, map, tap} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase/app';
import {Food} from '../model/food';
import {FoodInterface, FoodService} from './food.service';
import {AlertController} from '@ionic/angular';
import Timestamp = firebase.firestore.Timestamp;


interface TagsInterface {
    id: string;
    name: string;
    timestamp: Timestamp;
}

@Injectable({
    providedIn: 'root'
})
export class TagService {

    constructor(
        private firestore: AngularFirestore,
        private authService: AngularFireAuth,
        private foodService: FoodService,
        private alertController: AlertController,
    ) {
    }

    // tslint:disable-next-line:variable-name
    private _tags = new BehaviorSubject<Tag[]>([]);

    /**
     * Get the tag as an observable
     */
    get tags(): Observable<Tag[]> {
        return this._tags.asObservable();
    }

    /**
     * fetch the data from firestore
     */
    async fetch(): Promise<Subscription> {
        return this.authService.authState.pipe(first()).subscribe(user => {
            return this.firestore.collection<TagsInterface>(`user/${user.uid}/tags`).valueChanges({idField: 'id'}).pipe(
                map(resData => {
                    const temp = [];
                    resData.forEach(data => {
                        temp.push(new Tag(data.id, data.name, data.timestamp));
                    });
                    return temp;
                }),
                tap(tag => {
                    return this._tags.next(tag);
                })
            ).subscribe();
        });
    }

    /**
     * Add an tag to firestore
     *
     * @param tag the Tag object that need to be add
     */
    async add(tag: Tag): Promise<Subscription> {
        const id = this.firestore.createId();
        return this.authService.authState.subscribe(user => {
            tag.id = id;
            tag.timestamp = Timestamp.now();
            return this.firestore.collection(`user/${user.uid}/tags/`).doc(id).set(
                JSON.parse(JSON.stringify(tag))
            );
        });
    }

    /**
     * Update the tag
     *
     * @param oriTag original Tag Object (id as doc Reference)
     * @param newTag new Tag object
     */
    async update(oriTag: Tag, newTag: Tag): Promise<Subscription> {
        return this.authService.authState.subscribe(user => {
            newTag.timestamp = Timestamp.now();
            return this.firestore.doc(`user/${user.uid}/tags/${oriTag.id}`).set(
                JSON.parse(JSON.stringify(newTag))
            );
        });
    }

    /**
     * delete a tag
     *
     * @param tag tag that needed to deleted
     */
    async delete(tag: Tag): Promise<Subscription> {
        return this.authService.authState.pipe(first()).subscribe(async user => {
            const tagRef = `user/${user.uid}/tags/${tag.id}`;
            return this.firestore.collection(`user/${user.uid}/food`,
                ref => ref.where('tags', 'array-contains', tagRef)).valueChanges().pipe(first())
                .subscribe(async (doc) => {
                    console.log(doc);
                    if (doc.length !== 0) {
                        const alert = await this.alertController.create({
                            message: `Tag is current using by :
                        ${doc.map((element: FoodInterface) => element.food).join(',')}. Kindly remove the tag from the food first`,
                            buttons: ['OK']
                        });
                        await alert.present();
                        return;
                    }
                    await this.firestore.doc(`user/${user.uid}/tags/${tag.id}`).delete();
                });
        });
    }

    /**
     * attach a tag to a food
     *
     * @param food food that need to be related
     * @param tag tag that need to be related
     */
    async relateToFood(food: Food, tag: Tag): Promise<Subscription> {
        return this.authService.authState.pipe(first()).subscribe(user => {
            const f: Food = JSON.parse(JSON.stringify(food));
            const tagRef = `user/${user.uid}/tags/${tag.id}`;

            f.tags = f.tags === null // if the tags is null
                ? [tagRef] // initiate as array
                : f.tags.includes(tagRef) // if its not null and it include tag Reference
                    ? f.tags.filter(item => item !== tagRef) // return the array but without that reference
                    : f.tags.concat(tagRef); // If it do not include tag Reference, return array that join with that Reference
            this.foodService.update(food, f);
        });
    }
}

