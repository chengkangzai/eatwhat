import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

export class Tag {
    constructor(
        public id: string,
        public name: string,
        public timestamp: Timestamp
    ) {
    }
}
