import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from './tabs.page';
import {LoggedInGuard} from 'ngx-auth-firebaseui';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        canActivate: [LoggedInGuard],
        children: [
            {
                path: 'food',
                loadChildren: () => import('../food/food.module').then(m => m.FoodPageModule)
            },
            {
                path: 'more',
                loadChildren: () => import('../more/more.module').then(m => m.MorePageModule)
            }, {
                path: 'feedback',
                loadChildren: () => import('../feedback/feedback.module').then(m => m.FeedbackPageModule)
            },
            {
                path: '',
                redirectTo: '/tabs/food',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/food',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
