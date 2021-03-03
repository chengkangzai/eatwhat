import {Injectable, NgZone} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import firebase from 'firebase/app';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import AuthProvider = firebase.auth.AuthProvider;

export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    userData: User;

    constructor(
        public afStore: AngularFirestore,
        public ngFireAuth: AngularFireAuth,
        public router: Router,
        public ngZone: NgZone
    ) {
        this.ngFireAuth.authState.subscribe(user => {
            if (user) {
                this.userData = user;
                localStorage.setItem('user', JSON.stringify(this.userData));
                JSON.parse(localStorage.getItem('user'));
            } else {
                localStorage.setItem('user', null);
                JSON.parse(localStorage.getItem('user'));
            }
        });

    }

    /**
     * Check if user is logged in
     *
     * @return boolean return if the user is logged in
     */
    get isLoggedIn(): boolean {
        const user = JSON.parse(localStorage.getItem('user'));
        return (user !== null && user.emailVerified !== false);
    }

    /**
     * Check if the user email is verified
     *
     * @return boolean return if the user email is verified
     */
    get isEmailVerified(): boolean {
        const user = JSON.parse(localStorage.getItem('user'));
        return (user.emailVerified !== false);
    }

    /**
     * Sign in user with user and email
     *
     * @param email Email of the user
     * @param password Password of the user
     */
    signIn(email, password): ReturnType<firebase.auth.Auth['signInWithEmailAndPassword']> {
        return this.ngFireAuth.signInWithEmailAndPassword(email, password);
    }

    /**
     *
     * @param email Email of the user
     * @param password Password of the user
     */
    registerUser(email, password): ReturnType<firebase.auth.Auth['createUserWithEmailAndPassword']> {
        return this.ngFireAuth.createUserWithEmailAndPassword(email, password);
    }

    /**
     * Send password reset email to the user who want to recover the email
     *
     * @param passwordResetEmail the email of the user that wish to recover his password
     */
    passwordRecover(passwordResetEmail): Promise<void> {
        return this.ngFireAuth.sendPasswordResetEmail(passwordResetEmail)
            .then(() => {
                window.alert('Password reset email has been sent, please check your inbox.');
            }).catch((error) => {
                window.alert(error);
            });
    }

    /**
     * Log in with google
     */
    googleAuth(): Promise<any> {
        return this.authLogin(new GoogleAuthProvider());
    }

    /**
     * Authenticate user by using Social media account
     *
     * @param provider Auth provider that used to logged in
     */
    authLogin(provider: AuthProvider): Promise<any> {
        return this.ngFireAuth.signInWithPopup(provider)
            .then((result) => {
                this.ngZone.run(() => {
                    this.router.navigate(['tabs/food']);
                });
                this.setUserData(result.user);
            }).catch((error) => {
                window.alert(error);
            });
    }

    /**
     * Save user data to firestore
     *
     * @param user User that just been authenticate
     */
    setUserData(user: User): Promise<void> {
        const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.uid}`);
        const userData: User = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
        };
        return userRef.set(userData, {
            merge: true
        });
    }

    /**
     * Sign out the user
     */
    signOut(): Promise<void> {
        return this.ngFireAuth.signOut().then(() => {
            localStorage.removeItem('user');
            this.router.navigate(['auth']);
        });
    }

}
