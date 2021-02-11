import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MorePage} from './more.page';

const routes: Routes = [
    {
        path: '',
        component: MorePage,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MorePageRoutingModule {
}
