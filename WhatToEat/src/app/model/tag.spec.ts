import {Tag} from './tag';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

describe('Tag', () => {
    it('should create an instance', () => {
        expect(new Tag('', 'Tag Name', Timestamp.now())).toBeTruthy();
    });
});
