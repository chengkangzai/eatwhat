import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {TagsPage} from './tags.page';

describe('TagsPage', () => {
    let component: TagsPage;
    let fixture: ComponentFixture<TagsPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TagsPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(TagsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
