import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  private addMenu: boolean = false;
  public appPages = [
    {
      title: 'Inicio',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Pagos',
      url: '/list',
      icon: 'cash'
    },
    {
      title: 'Captación',
      url: '/list',
      icon: 'bookmarks'
    },
    {
      title: 'Actualiz. Datos',
      url: '/tercero',
      icon: 'person'
    },
    {
      title: 'Cartera',
      url: '/pdf-cartera',
      icon: 'wallet'
    },
    {
      title: 'Novedades',
      url: '/list',
      icon: 'book'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private appPreferences: AppPreferences
  ) {
   /* this.appPreferences.fetch('nombres').then((res) => {
      console.log("RESPUSTA", res);
      this.addMenu = res != null;
      //
    });*/
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
