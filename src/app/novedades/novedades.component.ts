import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.scss'],
})
export class NovedadesComponent implements OnInit {

  constructor(public router: Router,
    private appPreferences: AppPreferences) { }

  ngOnInit() {
    this.appPreferences.fetch('nit').then((res) => {
      if (res == null || res == '') {
        this.router.navigate(['/login']);
      }
    });
  }

}
