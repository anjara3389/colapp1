import { Component } from '@angular/core';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';
import { MenuController } from '@ionic/angular';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private nombres: String;
  constructor(private appPreferences: AppPreferences,
    public menuCtrl: MenuController,
    private appComponent: AppComponent) {
    this.appPreferences.fetch('nombres').then((res) => {
      console.log(res);
      this.nombres = res;
      menuCtrl.enable(true);
    });
  }

  getExtractos() {
    this.appComponent.getExtractos();
  }
}
