import {TestBed} from '@angular/core/testing';

import {FoodUIService} from './food-ui.service';

describe('FoodUIService', () => {
    let service: FoodUIService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FoodUIService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
