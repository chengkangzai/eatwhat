import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {NgxAuthFirebaseUIModule} from 'ngx-auth-firebaseui';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AboutComponent} from './components/about/about.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {FoodComponent} from './components/food/food.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularFireFunctionsModule, REGION} from '@angular/fire/functions';

@NgModule({
    declarations: [AppComponent, AboutComponent, FoodComponent],
    entryComponents: [],
    imports: [BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFirestoreModule.enablePersistence(),
        NgxAuthFirebaseUIModule.forRoot(environment.firebaseConfig, () => 'What to Eattt? ', {
            enableFirestoreSync: true, // enable/disable autosync users with firestore
            authGuardFallbackURL: '/auth', // url for unauthenticated users - to use in combination with canActivate feature on a route
            authGuardLoggedInURL: '/tabs/food', // url for authenticated users - to use in combination with canActivate feature on a route
            passwordMinLength: 8, // Password length min/max in forms independently of each componenet min/max.
            nameMaxLength: 50,
            nameMinLength: 2,
            enableEmailVerification: true,
            guardProtectedRoutesUntilEmailIsVerified: false,
            toastMessageOnAuthSuccess: false,
            toastMessageOnAuthError: false
        }),
        AngularFireFunctionsModule,
        BrowserAnimationsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
        ReactiveFormsModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        {provide: REGION, useValue: 'asia-northeast3'}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
