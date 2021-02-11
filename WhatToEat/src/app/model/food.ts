import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

export class Food {
    constructor(
        public id: string,
        public food: string,
        public userID: string,
        public timestamp?: Timestamp, // temporary, may remove when all user food have timestamp
        public tags?: string[],
    ) {
    }
}
