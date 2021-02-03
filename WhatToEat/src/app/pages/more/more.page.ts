import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {RoleService} from '../../services/role.service';
import {AlertController, ModalController} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {AboutComponent} from '../../components/about/about.component';

@Component({
    selector: 'app-more',
    templateUrl: 'more.page.html',
    styleUrls: ['more.page.scss']
})
export class MorePage implements OnInit, OnDestroy {
    isMaster = false;
    isMasterSub: Subscription;

    constructor(
        private router: Router,
        private authService: AuthService,
        private role: RoleService,
        private alertController: AlertController,
        private modalController: ModalController,
    ) {
    }

    ngOnInit() {
        this.isMasterSub = this.role.isMaster().subscribe(master => {
            this.isMaster = master;
        });

    }

    ngOnDestroy() {
        if (this.isMasterSub) {
            this.isMasterSub.unsubscribe();
        }
    }

    ionViewWillLeave() {
        if (this.isMasterSub) {
            this.isMasterSub.unsubscribe();
        }
    }

    async onSignOut() {
        await this.authService.SignOut().then(() => this.router.navigateByUrl('/auth'));
    }

    async Logout() {
        const alert = await this.alertController.create({
            header: 'Warning',
            message: 'Are you sure you want to log out ?',
            buttons: [{
                text: 'Cancel',
                role: 'cancel'
            }, {
                text: 'Log Out',
                role: 'destructive',
                handler: async () => {
                    await this.authService.SignOut().then(() => this.router.navigateByUrl('/auth'));
                }
            }]
        });
        await alert.present();
    }

    async about() {
        const modal = await this.modalController.create({
            component: AboutComponent,
        });
        await modal.present();
    }
}
