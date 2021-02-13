import {Component, OnDestroy, OnInit} from '@angular/core';
import {Feedback} from '../../../model/feedback';
import {Subscription} from 'rxjs';
import {FeedbackService} from '../../../services/feedback.service';
import {AlertController, IonItemSliding} from '@ionic/angular';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {RoleService} from '../../../services/role.service';

@Component({
    selector: 'app-view',
    templateUrl: './view.page.html',
    styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit, OnDestroy {

    filterTerm: string;
    feedbacks: Feedback[];
    feedbackSub: Subscription;
    isLoading = true;
    isMasterSub: Subscription;

    constructor(
        private feedbackService: FeedbackService,
        private alertController: AlertController,
        private auth: AngularFireAuth,
        private router: Router,
        private role: RoleService
    ) {
    }

    async ngOnInit() {
        this.isLoading = true;

        this.isMasterSub = this.role.isMaster().subscribe(async isMaster => {
            if (isMaster) {
                this.feedbackSub = this.feedbackService.feedback.subscribe((feed) => {
                    this.feedbacks = feed;
                });
                this.feedbackService.fetch().subscribe(() => {
                    this.isLoading = false;
                });
            } else {
                await this.router.navigateByUrl('tabs/more');
            }
        });
    }

    ngOnDestroy() {
        if (this.feedbackSub) {
            this.feedbackSub.unsubscribe();
        }
        if (this.isMasterSub) {
            this.isMasterSub.unsubscribe();
        }
    }

    async onEdit(f: Feedback, itemSliding: IonItemSliding) {
        const alert = await this.alertController.create({
            header: 'Edit ' + f.feedback,
            message: 'Change the value below and hit the update',
            inputs: [{
                name: 'feedback',
                type: 'text',
                placeholder: 'New Feedback',
                value: f.feedback,
            }],
            buttons: [{
                text: 'CANCEL',
                role: 'cancel'
            }, {
                text: 'Update',
                handler: (input) => {
                    this.feedbackService.update(f, input.feedback);
                }
            }]
        });
        await alert.present();
        await itemSliding.close();
    }

    async onShow(f: Feedback, itemSliding: IonItemSliding) {
        const alert = await this.alertController.create({
            header: 'Show ' + f.feedback,
            message: f.feedback,
            buttons: [{
                text: 'CANCEL',
                role: 'cancel'
            }],
        });
        await alert.present();
        await itemSliding.close();
    }


    async onDelete(f: Feedback) {
        const alert = await this.alertController.create({
            message: `are you sure you want to delete Feedback '${f.feedback}' ?`,
            header: 'Warning',
            buttons: [{
                text: 'Nope',
                role: 'cancel',
            }, {
                text: 'I am sure',
                handler: () => {
                    this.feedbackService.delete(f);
                }
            }]
        });
        await alert.present();
    }

    doRefresh(event) {
        this.feedbackService.fetch().subscribe(() => {
            event.target.complete();
        });
    }

}
