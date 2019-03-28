import { Component, OnInit } from '@angular/core';
import { WservConnectService } from '../wserv-connect.service';
import { AlertController } from '@ionic/angular';
import { AlertUtilsComponent } from '../utils/alert-utils.component';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AlertUtilsComponent]
})
export class LoginComponent implements OnInit {

  txtUsuario: string;
  txtClave: string;
  constructor(private wServConnectService: WservConnectService,
    public alertUtils: AlertUtilsComponent
  ) {

  }

  ngOnInit() {

  }

  login() {
    if (this.txtUsuario != null && this.txtClave != null && this.txtUsuario.trim().length != 0 && this.txtClave.trim().length != 0) {
      var observ = this.wServConnectService.post("SELECT * " +
        "FROM TercerosContrasena " +
        "WHERE usuario=UPPER('" + this.txtUsuario + "') " +
        "AND contrasena=UPPER('" + this.txtClave + "') ");

      observ.subscribe(data => {
        console.log("HEEERE", data)

        //this.respuesta = data[0]['des_usuario'];
      });
    } else {
      //this.presentAlert();
      this.alertUtils.presentOKAlert('Campos incompletos', 'Debe rellenar todos los campos');
    }
  }

  async presentAlert() {
    /* const alert = await this.alertController.create({
       header: 'Campos incompletos',
       //subHeader: 'Campos incompletos',
       message: 'Debe rellenar todos los campos',
       buttons: ['OK']
     });
 
     await alert.present();*/
  }

}
