# What To Eat Huh ?

What To Eat huh is an web application that helps user to decide what food to eat today.

## Getting Started
Since this application is build by using [Ionic](https://github.com/ionic-team/ionic-framework) and [Angular](https://github.com/angular/angular), please make sure you installed them before hand like so:

```sh
npm install -g @ionic/cli
npm install -g @angular/cli
```

After install ionic and angular, you need to copy your firebase config to enviroment file like so :
```sh
cd whattoeat\src\environments
cp environment.example.ts environment.prod.ts 
cp environment.example.ts environment.ts 
```

Open your favourite editor to paste your config from [Firebase](https://console.firebase.google.com/u/0/project/) under Project setting --> Config

You can serve the application using ionic like so : 
```sh
ionic serve
```
OR serve it in angular way
```sh
ng serve
```
OR launch as a mobile view 
```sh
ionic serve -l
```

The possibilities are endless.

### Building the Application

So far this app only support web and android version, so to build an web just need to do like so :
```sh
ionic build web
```
OR you want to build android app (You need to install android studio beforehand [here](https://developer.android.com/studio/) )
```sh
ionic cap build android
```

### Deploying
As this website is powered by firebase, hence using firebase hosting has come to normal.
To deploy this website, you need to install firebase cli beforehand like so : 
```sh
npm install -g firebase-tools 
```

If you are new to firebase, please feel free to read their documentation to know more about firebase [Firebase Documentation](https://firebase.google.com/docs/web/setup)

## Contributing

Any Contribution is welcomed
