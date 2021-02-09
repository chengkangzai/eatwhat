import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertController} from '@ionic/angular';
import {TagService} from '../../services/tag.service';
import {Tag} from '../../model/tag';
import firebase from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import Timestamp = firebase.firestore.Timestamp;

@Component({
    selector: 'app-tags',
    templateUrl: './tags.page.html',
    styleUrls: ['./tags.page.scss'],
})
export class TagsPage implements OnInit {

    // tslint:disable-next-line:variable-name
    tags: Tag[];
    isLoading = false;

    form: FormGroup;

    constructor(
        private alertController: AlertController,
        private tagService: TagService,
        private auth: AngularFireAuth,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            tag: new FormControl(null, {
                updateOn: 'change',
                validators: [Validators.required]
            })
        });

        this.tagService.tags.subscribe(tags => {
            this.tags = tags;
        });
        this.tagService.fetch().then(() => this.isLoading = false);
    }

    async onSignOut() {
        await this.auth.signOut().then(() => this.router.navigateByUrl('/auth'));
    }

    async onSubmitForm() {
        if (this.form.invalid) {
            await this.alertController.create({
                message: 'Invalid Form',
                buttons: ['OK']
            });
            return;
        }

        this.tagService.add(new Tag('', this.form.value.tag, Timestamp.now())).then(res => {
            console.log(res);
        });
    }

    async onShow(tag: Tag) {
        const alert = await this.alertController.create({
            message: 'Tag : ' + tag.name,
            buttons: ['OK']
        });
        await alert.present();
    }

}
