import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'alert-utils',
  //templateUrl: './login.component.html',
  //styleUrls: ['./login.component.scss'],
})
export class AlertUtilsComponent implements OnInit {

  ngOnInit() {

  }

  constructor(public alertController: AlertController
  ) {

  }

  async presentOKAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
