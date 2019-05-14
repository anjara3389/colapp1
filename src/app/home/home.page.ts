import { Component } from '@angular/core';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';
import { MenuController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private nombres: String;
  constructor(private appPreferences: AppPreferences,
    public menuCtrl: MenuController,
    private appComponent: AppComponent,
    public router: Router) {
    this.appPreferences.fetch('nit').then((res) => {
      if (res == null || res == '') {
        this.router.navigate(['/login']);
      } else {
        this.appPreferences.fetch('nombres').then((nombres) => {
          console.log(nombres);
          this.nombres = nombres;
          menuCtrl.enable(true);
        });
      }
    });
  }

  getExtractos() {
    this.appComponent.getExtractos();
  }
}
