import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import firebase from 'firebase/app';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {Feedback} from '../model/feedback';
import {map, tap} from 'rxjs/operators';
import Timestamp = firebase.firestore.Timestamp;

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

    get feedback(): Observable<Feedback[]> {
        return this._feedback.asObservable();
    }

    fetch(): Observable<Feedback[]> {
        return this.firestore.collection<FeedbackInterface>('feedback').valueChanges({idField: 'id'}).pipe(
            map(resData => {
                const temp = [];
                resData.forEach(data => {
                    temp.push(new Feedback(data.id, data.feedback, data.timestamp, data.user));
                });
                return temp;
            })
            , tap(feedback => {
                return this._feedback.next(feedback);
            })
        );
    }

    update(oriFeedback: Feedback, feedback: string): Promise<void> {
        return this.firestore.doc(`feedback/${oriFeedback.id}`).set({
            feedback
        });
    }

    delete(feedback: Feedback): Promise<void> {
        return this.firestore.doc(`feedback/${feedback.id}`).delete();
    }

    add(feedback: string): Promise<void> {
        const id = this.firestore.createId();
        const uid = this.authService.userData.uid;
        return this.firestore.collection('feedback').doc(id).set({
            id,
            feedback,
            timestamp: Timestamp.fromDate(new Date()),
            user: uid
        });
    }
}
