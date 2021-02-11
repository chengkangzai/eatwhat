import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
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

    get tags() {
        return this._tags.asObservable();
    }

    async fetch() {
        this.authService.authState.pipe(first()).subscribe(user => {
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

    async add(tag: Tag) {
        const id = this.firestore.createId();
        return this.authService.authState.subscribe(user => {
            tag.id = id;
            tag.timestamp = Timestamp.now();
            return this.firestore.collection(`user/${user.uid}/tags/`).doc(id).set(
                JSON.parse(JSON.stringify(tag))
            );
        });
    }

    async update(oriTag: Tag, newTag: Tag) {
        return this.authService.authState.subscribe(user => {
            newTag.timestamp = Timestamp.now();
            return this.firestore.doc(`user/${user.uid}/tags/${oriTag.id}`).set(
                JSON.parse(JSON.stringify(newTag))
            );
        });
    }

    async delete(tag: Tag) {
        return this.authService.authState.pipe(first()).subscribe(async user => {
            const tagRef = `user/${user.uid}/tags/${tag.id}`;
            this.firestore.collection(`user/${user.uid}/food`,
                ref => ref.where('tags', 'array-contains', tagRef)).valueChanges().pipe(first())
                .subscribe(async (doc) => {
                    console.log(doc);

                    if (doc.length === 0) {
                        await this.firestore.doc(`user/${user.uid}/tags/${tag.id}`).delete();
                    }

                    const alert = await this.alertController.create({
                        message: `Tag is current using by :
                        ${doc.map((element: FoodInterface) => element.food).join(',')} Kindly remove the tag from the food first`,
                        buttons: ['OK']
                    });
                    await alert.present();
                });
        });


    }

    async query(name: string) {
        // Do we need this ? Hmm
        await this.authService.authState.pipe(first()).subscribe(user => {
            return this.firestore.collection<TagsInterface>(`user/${user.uid}/tags`, ref => ref.where('name', '==', name))
                .valueChanges({idField: 'id'}).pipe(
                    map(resData => {
                        const temp = [];
                        resData.forEach(data => {
                            temp.push(new Tag(data.id, data.name, data.timestamp));
                        });
                        return temp;
                    })
                    , tap(tag => {
                        return this._tags.next(tag);
                    })
                ).subscribe();
        });
    }

    async relateToFood(food: Food, tag: Tag) {
        this.authService.authState.pipe(first()).subscribe(user => {
            const f: Food = JSON.parse(JSON.stringify(food));
            const tagRef = `user/${user.uid}/tags/${tag.id}`;

            f.tags = f.tags === null
                ? [tagRef]
                : f.tags.includes(tagRef)
                    ? f.tags.filter(item => item !== tagRef)
                    : f.tags.concat(tagRef);
            this.foodService.update(food, f);
        });
    }
}

