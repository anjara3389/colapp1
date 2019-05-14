import { Component } from '@angular/core';
import * as jsPDF from 'jspdf';
import { Platform, MenuController, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { WservConnectService } from './wserv-connect.service';
import { AlertUtilsComponent } from './utils/alert-utils.component';
import { Router } from '@angular/router';

import * as moment from 'moment';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [AlertUtilsComponent, File, FileOpener]
})
export class AppComponent {
  private addMenu: boolean = false;

  loading: any;

  public appPages = [
    {
      title: 'Inicio',
      url: '/home',
      icon: 'home',
    },
    {
      title: 'Pagos',
      url: '/list',
      icon: 'cash',
    },
    {
      title: 'Captación',
      url: '/list',
      icon: 'bookmarks',
    },
    {
      title: 'Actualiz. Datos',
      url: '/tercero',
      icon: 'person',
    },
    {
      title: 'Cartera',
      icon: 'wallet',
    },
    {
      title: 'Novedades',
      url: '/novedades',
      icon: 'book',
    },
    {
      title: 'Cerrar Sesión',
      icon: 'log-out',
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private appPreferences: AppPreferences,
    private file: File,
    private fileOpener: FileOpener,
    private wServConnectService: WservConnectService,
    public menuCtrl: MenuController,
    private alertUtils: AlertUtilsComponent,
    public loadingCtrl: LoadingController,
    public router: Router,

  ) {
    /* this.appPreferences.fetch('nombres').then((res) => {
       console.log("RESPUSTA", res);
       this.addMenu = res != null;
       //
     });*/
    this.initializeApp();
    //moment.locale('es');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  getExtractos() {
    this.appPreferences.fetch('nit').then((res) => {
      console.log(res);
      //this.nombres = res;
      this.menuCtrl.enable(true);

      this.wServConnectService.post("SELECT " +
        "v_cartera_edades_cxc.Sw, " +
        "v_cartera_edades_cxc.Tipo, " +
        "v_cartera_edades_cxc.Numero, " +
        "v_cartera_edades_cxc.Fecha, " +
        "v_cartera_edades_cxc.Vencimiento, " +
        "v_cartera_edades_cxc.Saldo, " +
        "v_cartera_edades_cxc.Dias_Vencido, " +
        "v_cartera_edades_cxc.Sin_Vencer, " +
        "v_cartera_edades_cxc.de_1_a_30, " +
        "v_cartera_edades_cxc.de_31_a_60, " +
        "v_cartera_edades_cxc.de_61_a_90, " +
        "v_cartera_edades_cxc.de_91_a_120, " +
        "v_cartera_edades_cxc.Mas_de_120, " +
        "v_cartera_edades_cxc.documento, " +
        "terceros.nit, " +
        "terceros.nombres, " +
        "terceros.direccion, " +
        "terceros.ciudad, " +
        "terceros.telefono_1, " +
        "terceros.apartado_aereo, " +
        "terceros.lista, " +
        "terceros.concepto_3, " +
        "terceros.concepto_4, " +
        "documentos.modelo, " +
        "documentos.notas, " +
        "documentos.prefijo, " +
        "tipo_transacciones.descripcion, " +
        "terceros_3.descripcion as descripciont, " +
        "{ fn IFNULL(terceros.concepto_3, '' )}" +
        "FROM " +
        "{ oj(((colacteos.dbo.v_cartera_edades_cxc v_cartera_edades_cxc INNER JOIN colacteos.dbo.terceros terceros ON " +
        "v_cartera_edades_cxc.Nit = terceros.nit) " +
        "LEFT OUTER JOIN colacteos.dbo.documentos documentos ON " +
        "v_cartera_edades_cxc.Tipo = documentos.tipo AND " +
        "v_cartera_edades_cxc.Numero = documentos.numero) " +
        "INNER JOIN colacteos.dbo.tipo_transacciones tipo_transacciones ON " +
        "documentos.tipo = tipo_transacciones.tipo) " +
        "LEFT OUTER JOIN colacteos.dbo.terceros_3 terceros_3 ON " +
        "terceros.concepto_3 = terceros_3.concepto_3 } " +
        "WHERE v_cartera_edades_cxc.vencimiento >= '20190501' " +
        "AND v_cartera_edades_cxc.vencimiento <= '20190530' " +
        "AND v_cartera_edades_cxc.nit = '" + res + "' ").subscribe(data => {
          if (data.length > 0) {
            console.log("DATOS LISTOS", data);
            this.exportPdf(data, res);


            /*this.dataForm.controls['nombres'].setValue(data[0]['nombres']);
            this.dataForm.controls['direccion'].setValue(data[0]['direccion']);
            this.dataForm.controls['telefono1'].setValue(data[0]['telefono1']);
            this.dataForm.controls['telefono2'].setValue(data[0]['telefono2']);
            this.dataForm.controls['mail'].setValue(data[0]['mail']);*/
          } else {
            this.alertUtils.presentOKAlert('Error', 'Hubo un error al traer los datos');
          }
        }, error => {
          this.alertUtils.presentOKAlert('Error', error);
          console.error(error);
        });;
    });
  }

  exportPdf(data, nit) {
    //this.presentLoading('Creando archivo PDF...');

    //var doc = new jsPDF("p", "mm", [215.9, 279.4]);
    var doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'letter'
    })


    doc.setFont("times");
    doc.setFontSize(8);
    doc.setFontStyle('bold');

    doc.text(116.22, 70.87, 'COOPERATIVA DE PRODUCTOS LACTEOS DE NARIÑO LTDA.');
    doc.text(184.2, 85, 'EXTRACTO CARTERA CLIENTE');
    doc.setFontSize(6);
    doc.text(507.5, 90.71, '0-Mes-0000');
    doc.text(45.35, 119.05, data[0]['nombres']);
    doc.text(399.68, 119.05, data[0]['ciudad']);
    doc.text(80, 20, nit.toString());
    //console.log("nit", nit);

    doc.setFontStyle('normal');
    doc.text(45.35, 133.22, 'DIRECCIÓN: ' + data[0]['direccion']);
    doc.text(340.15, 133.22, 'TELEFONO: ' + data[0]['telefono']);
    //doc.text(27, 20, 'CÓDIGO: ' + data[0]['telefono']);
    //doc.text(27, 20, 'LISTA: ' + data[0]['telefono']);

    for (i = 0; i < data.length; i++) {
      var space = (28.34 * i) + 185.25;
      console.log('aqui', data[i]['Fecha'].toString());

      moment.locale('en-US');
      //Apr 26 2019 12:00:00:000AM
      const venc = moment(data[i]['Vencimiento'].toString(), 'MMM-DD-YYYY HH:mm:ssZ');
      const fecha = moment(data[i]['Fecha'].toString(), 'MMM-DD-YYYY HH:mm:ssZ');

      moment.locale('es');
      

      doc.text(53.85, space, data[i]['Tipo'].toString());
      doc.text(85.03, space, data[i]['Numero'].toString());
      
      const fFecha = fecha.format('D-MMM-YYYY');
      const fVenc = venc.format('D-MMM-YYYY');
      console.log('aqui2', fFecha);
      doc.text(113.38, space, fFecha);
      doc.text(161.57, space, fVenc);
      doc.text(215.433, space, data[i]['Dias_Vencido'].toString());
      //doc.text(60, space, data[i]['documento'] != null ? data[i]['documento'].toString() : '');
      if (data[i]['descripcion'] != null) {
        //this.alertUtils.presentOKAlert('!!!!!!!', data[i]['descripcion'].toString().length);
        if (data[i]['descripcion'].toString().length > 15) {
          doc.text(280.629, space, data[i]['descripcion'].toString().substring(0, 15));
          doc.text(280.629, (space + 5.67), data[i]['descripcion'].toString().substring(15));
        } else {
          doc.text(280.629, space, data[i]['descripcion'].toString());
        }
      }
      //doc.text(90, space, data[i]['notas'] != null ? data[i]['notas'].toString() : '');
      doc.text(535.74, space, data[i]['Saldo'].toString());
    }


    let pdfOutput = doc.output();
    // using ArrayBuffer will allow you to put image inside PDF
    let buffer = new ArrayBuffer(pdfOutput.length);
    let array = new Uint8Array(buffer);


    for (var i = 0; i < pdfOutput.length; i++) {
      array[i] = pdfOutput.charCodeAt(i);
    }

    //This is where the PDF file will stored , you can change it as you like
    // for more information please visit https://ionicframework.com/docs/native/file/
    const directory = this.file.dataDirectory;
    const fileName = "Extracto Cartera.pdf";
    let options2: IWriteOptions = { replace: true };

    this.file.checkFile(directory, fileName).then((success) => {
      //Writing File to Device
      this.file.writeFile(directory, fileName, buffer, options2)
        .then((success) => {
          // this.loading.dismiss();
          console.log("Creado exitosamente" + JSON.stringify(success));
          this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
            .then(() => console.log('El archivo está abierto'))
            .catch(e => {
              console.log('Error al abril el archivo', e);
              this.alertUtils.presentOKAlert('Error', e);
            });
        })
        .catch((error) => {
          //this.loading.dismiss();
          console.log("No se puede crear el archivo " + JSON.stringify(error));
          this.alertUtils.presentOKAlert('Error', error);
        });
    })
      .catch((error) => {
        //Writing File to Device
        this.file.writeFile(directory, fileName, buffer)
          .then((success) => {
            // this.loading.dismiss();
            console.log("Creado exitosamente" + JSON.stringify(success));
            this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
              .then(() => console.log('El archivo está abierto'))
              .catch(e => {
                console.log('Error al abrir el archivo', e);
                this.alertUtils.presentOKAlert('Error', e);

              });
          })
          .catch((error) => {
            // this.loading.dismiss();
            this.alertUtils.presentOKAlert('Error', error);
            console.log("No se puede crear el archivo " + JSON.stringify(error));
          });
      });
  }

  cerrarSesion() {
    this.appPreferences.clearAll().then((data) => {
      this.router.navigate(['/login']);
    })
      .catch((error) => {
        this.alertUtils.presentOKAlert('Error', error);
      });
  }

  async presentLoading(msg) {
    const loading = await this.loadingCtrl.create({
      message: msg
    });
    return await loading.present();
  }

}
