import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { WservConnectService } from '../wserv-connect.service';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';
import { MenuController } from '@ionic/angular';
import { AlertUtilsComponent } from '../utils/alert-utils.component';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { GoogleDriveProviderService } from '../google-drive-provider.service';


@Component({
  selector: 'app-tercero',
  templateUrl: './tercero.component.html',
  styleUrls: ['./tercero.component.scss'],
  providers: [GoogleDriveProviderService]
})
export class TerceroComponent implements OnInit {
  dataForm: FormGroup;

  persons: Array<any>;
  dataId: string;

  constructor(private emailComposer: EmailComposer,
    private formBuilder: FormBuilder,
    private wServConnectService: WservConnectService,
    private appPreferences: AppPreferences,
    public menuCtrl: MenuController,
    public alertUtils: AlertUtilsComponent,
    gDrive: GoogleDriveProviderService) {
    this.dataForm = this.createForm();


    //this.dataId = '15Kndr-OcyCUAkBUcq6X3BMqKa_y2fMAXfPFLiSACiys';
    this.dataId = '1ioSUoE0wAPH6hB7Yv1wyrte83V2-ePnR2r2Fm2xbESQ';
    

    gDrive.load(this.dataId)
      .then((data) => {
        console.log("DATAAAAA" + JSON.stringify(data[0], null, 4));
        this.persons = data;
      }, (error) => {
        console.log(error);
      });

    this.appPreferences.fetch('nit').then((res) => {
      console.log(res);
      //this.nombres = res;
      menuCtrl.enable(true);

      this.wServConnectService.post("SELECT t.nombres,t.direccion,t.telefono_1,t.telefono_2,t.mail " +
        "FROM Terceros t " +
        "WHERE t.nit=" + res).subscribe(data => {
          if (data.length > 0) {
            this.dataForm.controls['nombres'].setValue(data[0]['nombres']);
            this.dataForm.controls['direccion'].setValue(data[0]['direccion']);
            this.dataForm.controls['telefono1'].setValue(data[0]['telefono1']);
            this.dataForm.controls['telefono2'].setValue(data[0]['telefono2']);
            this.dataForm.controls['mail'].setValue(data[0]['mail']);
          } else {
            this.alertUtils.presentOKAlert('Error', 'Hubo un error al traer los datos');
          }
        }, error => {
          this.alertUtils.presentOKAlert('Error', error);
          console.error(error);
        });;
    });
  }

  ngOnInit(): void {

  }

  private createForm() {
    return this.formBuilder.group({
      nombres: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono1: [''],
      telefono2: [''],
      mail: ['', Validators.required],
    });
  }

  sendData() {
    console.log(this.dataForm.value);
    this.appPreferences.fetch('nit').then((res) => {
      /*this.emailComposer.isAvailable().then((available: boolean) => {
        if (available) {*/
      //Now we know we can send

      let email = {
        to: 'anulaciones@colacteos.com',
        cc: 'anulaciones@colacteos.com',
        //bcc: ['john@doe.com', 'jane@doe.com'],
        /*attachments: [
          'file://img/logo.png',
          'res://icon.png',
          'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
          'file://README.pdf'
        ],*/
        subject: 'Solicitud de actualización de datos asociado',
        body: 'El asociado con nit ' + res + ' solicita actualizar sus datos de la siguiente manera: \n\n' +
          'Nombres: ' + this.dataForm.value.nombres + '\n' +
          'Direccion: ' + this.dataForm.value.direccion + '\n' +
          'Telefono1: ' + this.dataForm.value.telefono1 + '\n' +
          'Telefono2: ' + this.dataForm.value.telefono2 + '\n' +
          'Mail: ' + this.dataForm.value.mail + '\n',
        isHtml: true
      }

      // Send a text message using default options
      this.emailComposer.open(email);
      this.alertUtils.presentToast('El correo se ha enviado correctamente');
      /*} else {
            this.alertUtils.presentOKAlert('Error', 'El correo no se ha podido enviar');
          }
        });*/
    });
  }

}
