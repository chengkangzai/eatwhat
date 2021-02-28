import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertController, IonItemSliding, ToastController} from '@ionic/angular';
import {TagService} from '../../services/tag.service';
import {Tag} from '../../model/tag';
import firebase from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import Timestamp = firebase.firestore.Timestamp;

@Component({
    selector: 'app-tags',
    templateUrl: './tags.page.html',
    styleUrls: ['./tags.page.scss'],
})
export class TagsPage implements OnInit, OnDestroy {
    // TODO Find Food by tags!
    tags: Tag[];
    tags$: Subscription;
    isLoading = false;

    form: FormGroup;

    constructor(
        private alertController: AlertController,
        private tagService: TagService,
        private auth: AngularFireAuth,
        private router: Router,
        private toaster: ToastController
    ) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            tag: new FormControl(null, {
                updateOn: 'change',
                validators: [Validators.required]
            })
        });

        this.tags$ = this.tagService.tags.subscribe(tags => {
            this.tags = tags;
        });
        this.tagService.fetch().then(() => this.isLoading = false);
    }

    ngOnDestroy() {
        if (this.tags$) {
            this.tags$.unsubscribe();
        }
    }

    doRefresh($event) {
        this.tagService.fetch().then(() => {
            $event.target.complete();
        });
    }

    async onSubmitForm() {
        if (this.form.invalid) {
            await this.alertController.create({
                message: 'Invalid Form',
                buttons: ['OK']
            });
            return;
        }

        await this.tagService.add(new Tag('', this.form.value.tag, Timestamp.now()));
        this.form.reset();
    }

    async onShow(tag: Tag) {
        const alert = await this.alertController.create({
            header: 'SHOW',
            message: `Tag : ${tag.name} `,
            buttons: ['OK']
        });
        await alert.present();
    }

    async onEdit(tag: Tag, itemSliding: IonItemSliding) {
        const alert = await this.alertController.create({
            header: 'EDIT',
            message: 'Editing Tag : ' + tag.name,
            inputs: [{
                name: 'name',
                value: tag.name,
                placeholder: 'Type new tag name here',
            }],
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
            }, {
                text: 'Update',
                handler: (input) => {
                    const newTag: Tag = JSON.parse(JSON.stringify(tag));
                    newTag.name = input.name;
                    this.tagService.update(tag, newTag).then(async () => {
                        const toaster = await this.toaster.create({
                            message: 'Done',
                            duration: 1000,
                        });
                        await toaster.present();
                    });

                }
            }]
        });
        await alert.present();
        await itemSliding.close();
    }

    async onDelete(tag: Tag, itemSliding: IonItemSliding) {
        await this.tagService.delete(tag);
        await itemSliding.close();
    }

}
