import { Component, OnInit } from '@angular/core';
import { WservConnectService } from '../wserv-connect.service';
import { NavController, MenuController, IonMenu } from '@ionic/angular';
import { AlertUtilsComponent } from '../utils/alert-utils.component';
import { Router } from '@angular/router';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AlertUtilsComponent, AppPreferences]
})
export class LoginComponent implements OnInit {

  txtUsuario: string;
  txtClave: string;
  constructor(private wServConnectService: WservConnectService,
    public alertUtils: AlertUtilsComponent,
    public navCtrl: NavController,
    public router: Router,
    private appPreferences: AppPreferences,
    public menuCtrl: MenuController
  ) {
    console.log("menus ", menuCtrl.getMenus());
    menuCtrl.close('principal');
    menuCtrl.enable(false);
  }

  ngOnInit() {

  }

  login() {
    if (this.txtUsuario != null && this.txtClave != null && this.txtUsuario.trim().length != 0 && this.txtClave.trim().length != 0) {
      var observ = this.wServConnectService.post("SELECT t.nombres,tc.nit,tc.usuario,tc.contrasena " +
        "FROM TercerosContrasena tc " +
        "INNER JOIN Terceros t on t.nit=tc.nit " +
        "WHERE tc.usuario=UPPER('" + this.txtUsuario + "') " +
        "AND tc.contrasena=UPPER('" + this.txtClave + "') ");

      observ.subscribe(data => {
        if (data.length > 0) {
          //this.navCtrl.(HomePage);
          console.log("HEEERE", data);
          this.appPreferences.store('nombres', data[0]['nombres']);
          this.appPreferences.store('usuario', data[0]['usuario']);
          this.appPreferences.store('contrasena', data[0]['contrasena']);
          this.appPreferences.store('nit', data[0]['nit']);

          this.router.navigate(['/home']);
        } else {
          this.alertUtils.presentOKAlert('Error', 'Usuario y/o contraseña incorrectos.');
        }
      });
    } else {
      this.alertUtils.presentOKAlert('Campos incompletos', 'Debe rellenar todos los campos.');
    }
  }
}
