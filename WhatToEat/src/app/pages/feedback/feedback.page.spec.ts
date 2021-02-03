import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FeedbackPage } from './feedback.page';

describe('FeedbackPage', () => {
  let component: FeedbackPage;
  let fixture: ComponentFixture<FeedbackPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
