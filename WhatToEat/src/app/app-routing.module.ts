import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {canActivate, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';

const redirectLoggedInToItems = () => redirectLoggedInTo(['tabs/food']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth']);

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
    },
    {
        path: 'tabs',
        ...canActivate(redirectUnauthorizedToLogin),
        loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
    },
    {
        path: 'auth',
        ...canActivate(redirectLoggedInToItems),
        loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthPageModule)
    },
    {
        path: 'about/privacy',
        loadChildren: () => import('./pages/about/privacy/privacy.module').then(m => m.PrivacyPageModule)
    },

];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
