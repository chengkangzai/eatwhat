import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Tag} from '../model/tag';
import {AngularFirestore} from '@angular/fire/firestore';
import {first, map, tap} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase/app';
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

    // tslint:disable-next-line:variable-name
    private _tags = new BehaviorSubject<Tag[]>([]);


    constructor(
        private firestore: AngularFirestore,
        private authService: AngularFireAuth,
    ) {
    }

    get tags() {
        return this._tags.asObservable();
    }

    async fetch() {
        await this.authService.authState.pipe(first()).subscribe(user => {
            return this.firestore.collection(`user/${user.uid}/tags`).valueChanges({idField: 'id'}).pipe(
                map(resData => {
                    const temp = [];
                    (resData as TagsInterface[]).forEach(data => {
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
        return this.authService.authState.subscribe(user => {
            return this.firestore.doc(`user/${user.uid}/tags/${tag.id}`).delete();
        });
    }

    async query(name: string) {
        // Do we need this ? Hmm
        await this.authService.authState.pipe(first()).subscribe(user => {
            return this.firestore.collection(`user/${user.uid}/tags`, ref => ref.where('name', '==', name))
                .valueChanges({idField: 'id'}).pipe(
                    map(resData => {
                        const temp = [];
                        (resData as TagsInterface[]).forEach(data => {
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
}

