import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';



@Component({
  selector: 'alert-utils',
  //templateUrl: './login.component.html',
  //styleUrls: ['./login.component.scss'],
})
export class AlertUtilsComponent implements OnInit {

  ngOnInit() {

  }

  constructor(public alertController: AlertController,
    private toastController: ToastController
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
  async presentToast(nMessage: string) {
    const toast = await this.toastController.create({
      message: nMessage,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }


}
