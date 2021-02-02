import {Component, OnInit} from '@angular/core';
import {AlertController, LoadingController, ToastController} from '@ionic/angular';
import {FeedbackService} from '../../services/feedback.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.page.html',
    styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
    form: FormGroup;

    constructor(
        private alertController: AlertController,
        private loadingController: LoadingController,
        private toaster: ToastController,
        private feedbackService: FeedbackService,
        private router: Router
    ) {
    }

    async ngOnInit() {
        this.form = new FormGroup({
            feedback: new FormControl(null, {
                updateOn: 'change',
                validators: [Validators.required, Validators.minLength(10)]
            })
        });
    }

    async onSubmitForm() {
        if (this.form.invalid) {
            const alert = await this.alertController.create({
                message: 'Hi ... Please filled up the form with at least 10 word ',
                header: 'Validation error',
                buttons: [{
                    text: 'Ok',
                    role: 'cancel'
                }]
            });
            await alert.present();
            return;
        }

        const loading = await this.loadingController.create({
            message: 'Hang in there ... Submitting'
        });
        await loading.present();

        this.feedbackService.add(this.form.value.feedback).then(async () => {
            await loading.dismiss();
            this.form.reset();
            const toast = await this.toaster.create({
                message: 'Thanks for your Feedback !',
                duration: 1500
            });
            await toast.present();
            await this.router.navigateByUrl('/tabs/more');
        });
    }

}
