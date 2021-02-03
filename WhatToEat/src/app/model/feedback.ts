import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

export class Feedback {
    constructor(
        public id: string,
        public feedback: string,
        private timestamp: Timestamp,
        private user: string
    ) {
    }
}
