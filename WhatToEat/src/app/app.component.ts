import {Component} from '@angular/core';
import {Platform} from '@ionic/angular';
import {Capacitor, Plugins} from '@capacitor/core';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    constructor(
        private platform: Platform,
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(async () => {
            if (Capacitor.isPluginAvailable('SplashScreen')) {
                await Plugins.SplashScreen.hide();
            }
        });
    }
}
