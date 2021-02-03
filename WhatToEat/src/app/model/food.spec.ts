import {Food} from './food';

describe('Food', () => {
    it('should create an instance', () => {
        expect(new Food('123', 'Food', '132')).toBeTruthy();
    });
});
