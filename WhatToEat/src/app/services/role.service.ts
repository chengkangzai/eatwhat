import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import firebase from 'firebase/app';
import {switchMap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RoleService {

    constructor(
        private auth: AngularFireAuth
    ) {
    }

    /**
     * Get the user as on observable
     * @private
     */
    private getUser(): Observable<firebase.User> {
        return this.auth.authState.pipe(
            switchMap(async (User) => {
                return User;
            }),
        );
    }

    /**
     * Check if the user have the claim of master
     *
     */
    isMaster(): Observable<boolean> {
        return this.getUser().pipe(switchMap(async User => {
            if (User) {
                const token = await User.getIdTokenResult();
                return !!token.claims.isMaster;
            } else {
                return false;
            }
        }));
    }
}
