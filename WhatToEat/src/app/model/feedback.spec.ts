import {Feedback} from './feedback';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

describe('Feedback', () => {
    it('should create an instance', () => {
        expect(new Feedback('12', 'Feedback', Timestamp.fromDate(new Date()), '123')).toBeTruthy();
    });
});
