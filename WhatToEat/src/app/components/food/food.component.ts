import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {Food} from '../../model/food';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TagService} from '../../services/tag.service';
import {Tag} from '../../model/tag';
import {Subscription} from 'rxjs';
import {FoodService} from '../../services/food.service';

@Component({
    selector: 'app-food',
    templateUrl: './food.component.html',
    styleUrls: ['./food.component.scss'],
})
export class FoodComponent implements OnInit, OnDestroy {

    @Input() food: Food; // Only use for query one food!
    @Input() mode: 'EDIT' | 'SHOW';

    tags: Tag[];
    tags$: Subscription;
    f: Food;
    f$: Subscription;
    imgSrc: string;
    form: FormGroup;

    constructor(
        private modalController: ModalController,
        private tagService: TagService,
        private foodService: FoodService,
        private toaster: ToastController,
    ) {
    }

    async ngOnInit() {
        this.f$ = this.foodService.food.subscribe(f => {
            this.f = f.filter((ff) => {
                return ff.id === this.food.id;
            })[0];
            this.form = new FormGroup({
                food: new FormControl(this.f.food, {
                    updateOn: 'change',
                    validators: [Validators.required]
                })
            });
        });


        this.tags$ = this.tagService.tags.subscribe(tag => {
            this.tags = tag;
        });
        await this.tagService.fetch();
        this.imgSrc = `https://ui-avatars.com/api/?name=${this.food.food}&rounded=true&background=random&size=64`;
    }

    ngOnDestroy() {
        if (this.tags$) {
            this.tags$.unsubscribe();
        }
        if (this.f$) {
            this.f$.unsubscribe();
        }
    }

    async onClose() {
        await this.modalController.dismiss();
    }

    async onSubmitForm() {
        await this.foodService.update(this.f, new Food('', this.form.value.food, ''));
        await this.toaster.create({
            message: 'Updated',
            duration: 1000,
        });
        await this.modalController.dismiss();
    }

    async attach(tag: Tag) {
        await this.tagService.relateToFood(this.f, tag).then(async () => {
            const toast = await this.toaster.create({
                message: 'Done',
                duration: 1000
            });
            await toast.present();
        }).catch(async () => {
            const toast = await this.toaster.create({
                message: 'Oops ! error occur, please contact developer on this regard',
                duration: 1000
            });
            await toast.present();
        });
    }

    isAttachToFood(tag: Tag): boolean {
        if (this.f.tags === null) {
            return false;
        }

        let yes = false;
        this.f.tags.forEach(item => (item.split('/').slice(-1)[0] === tag.id) ? yes = true : null);
        return yes;
    }
}
