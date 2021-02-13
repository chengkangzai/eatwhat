import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {RoleService} from '../../services/role.service';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {AboutComponent} from '../../components/about/about.component';
import {AngularFireFunctions} from '@angular/fire/functions';

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
        private functions: AngularFireFunctions,
        private toaster: ToastController
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

    async userMgn() {
        const alert = await this.alertController.create({
            message: 'Who you wish to be an master also ?',
            inputs: [{
                name: 'email',
                placeholder: 'Type the Email here',
                type: 'email'
            }],
            buttons: [{
                text: 'Cancel',
                role: 'cancel'
            }, {
                text: 'Add',
                handler: input => {
                    // TODO ;)
                    const callable = this.functions.httpsCallable('addMaster');
                    callable({email: input.email}).subscribe(async res => {
                        console.log(res);
                        const toast = await this.toaster.create({
                            message: res
                        });
                        await toast.present();
                    });
                }
            }]
        });
        await alert.present();
    }
}
