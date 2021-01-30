import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
    selector: 'app-tab1',
    templateUrl: 'food.page.html',
    styleUrls: ['food.page.scss']
})
export class FoodPage {

    constructor(
        private router: Router,
        private auth: AngularFireAuth,
    ) {
    }

    async onSignOut() {
        await this.auth.signOut().then(() => this.router.navigateByUrl('/login'));
    }
}
