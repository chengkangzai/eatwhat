import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import {BehaviorSubject} from 'rxjs';
import {Feedback} from '../model/feedback';
import {map, tap} from 'rxjs/operators';

interface FeedbackInterface {
    id: string;
    feedback: string;
    timestamp: Timestamp;
    user: string;
}

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {

    constructor(
        private firestore: AngularFirestore,
        private authService: AuthService
    ) {
    }

    // tslint:disable-next-line:variable-name
    private _feedback = new BehaviorSubject<Feedback[]>([]);

    get feedback() {
        return this._feedback.asObservable();
    }

    fetch() {
        return this.firestore.collectionGroup('feedback').valueChanges({idField: 'id'}).pipe(
            map(resData => {
                const temp = [];
                (resData as FeedbackInterface[]).forEach(data => {
                    temp.push(new Feedback(data.id, data.feedback, data.timestamp, data.user));
                });
                return temp;
            })
            , tap(feedback => {
                return this._feedback.next(feedback);
            })
        );
    }

    async update(oriFeedback: Feedback, feedback: string) {
        return await this.firestore.doc(`feedback/${oriFeedback.id}`).set({
            feedback
        });
    }

    async delete(feedback: Feedback) {
        return await this.firestore.doc(`feedback/${feedback.id}`).delete();
    }

    async add(feedback: string) {
        const id = this.firestore.createId();
        const email = this.authService.userData.email;
        return await this.firestore.collection('feedback').doc(id).set({
            id,
            feedback,
            timestamp: Timestamp.fromDate(new Date()),
            user: email
        });
    }
}
