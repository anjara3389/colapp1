import { Component, OnInit } from '@angular/core';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';
import { Router } from '@angular/router';
import { AlertUtilsComponent } from '../utils/alert-utils.component';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent implements OnInit {

  constructor(private appPreferences: AppPreferences,
    public router: Router,
    public alertUtils: AlertUtilsComponent) { }

  ngOnInit() {
    this.appPreferences.fetch('nit').then((res) => {
      //this.alertUtils.presentOKAlert('Info', res == null ? 'es null' : 'No es null');
      if (res != null && res != '') {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
