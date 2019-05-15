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

  months = new Array(['01', 'Ene'], ['02', 'Feb'], ['03', 'Mar'],
    ['04', 'Abr'], ['05', 'May'],
    ['06', 'Jun'], ['07', 'Jul'],
    ['08', 'Ago'], ['09', 'Sep'],
    ['10', 'Oct'], ['11', 'Nov'],
    ['12', 'Dic']);

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

    //ENCABEZADO
    doc.setFont("times");
    doc.setFontSize(10);
    doc.setFontStyle('bold');
    doc.text(116.22, 70.87, 'COOPERATIVA DE PRODUCTOS LACTEOS DE NARIÑO LTDA.');
    doc.text(184.2, 85, 'EXTRACTO CARTERA CLIENTE');
    doc.setFontSize(8);
    doc.setFontStyle('normal');
    doc.text(507.5, 90.71, this.formatFecha(moment()));
    doc.setLineWidth(1.5);
    doc.line(42.51, 113.38, 467.7, 113.385);
    doc.text(472.22, 113.385, 'Página');
    doc.text(524.4, 113.385, '* de');
    doc.text(552.75, 113.385, '*');

    doc.setFontStyle('bold');
    doc.text(45.35, 119.05, data[0]['nombres']);
    doc.text(337.32, 119.05, "NIT");
    doc.setFontStyle('normal');
    doc.text(365.66, 119.05, nit.toString());
    doc.text(399.68, 119.05, data[0]['ciudad']);

    doc.setFontStyle('bold');
    doc.text(45.35, 133.22, 'DIRECCIÓN:');
    doc.text(104.88, 133.22, data[0]['direccion']);
    doc.text(340.15, 133.22, 'TELEFONO:');
    doc.text(385.51, 133.22, !!data[0]['telefono'] ? data[0]['telefono'] : '');

    //FALTA ESTA FILA
    //doc.text(27, 20, 'CÓDIGO: ' + data[0]['telefono']);
    //doc.text(27, 20, 'LISTA: ' + data[0]['telefono']);

    //SUBENCABEZADO LISTA
    doc.setFontStyle('bold');
    doc.text(56.69, 167.244, 'Tipo');
    doc.text(82.204, 167.244, 'Número');
    doc.text(119.055, 167.244, 'Fecha:');
    doc.text(155.90, 167.244, 'Vencimiento');
    doc.text(212.598, 167.244, 'Dias');
    doc.text(232.440, 167.244, 'DOC');
    doc.text(272.125, 167.244, 'Descripcion');
    doc.text(413.85, 167.244, 'Notas');
    doc.text(544.251, 167.244, 'Saldo');
    doc.setLineWidth(1);
    doc.line(34.015, 170.07, 581.102, 170.07);


    //CONTENIDO
    doc.setFontStyle('normal');
    for (i = 0; i < data.length; i++) {
      var space = (28.34 * i) + 185.25;

      doc.text(42.51, space, '*');
      doc.text(53.85, space, data[i]['Tipo'].toString());
      doc.text(85.03, space, data[i]['Numero'].toString());
      doc.text(113.38, space, this.formatFecha(moment(data[i]['Fecha'].toString(), 'MMM-DD-YYYY HH:mm:ssZ')));
      doc.text(161.57, space, this.formatFecha(moment(data[i]['Vencimiento'].toString(), 'MMM-DD-YYYY HH:mm:ssZ')));
      doc.text(215.433, space, data[i]['Dias_Vencido'].toString());
      //doc.text(60, space, data[i]['documento'] != null ? data[i]['documento'].toString() : '');
      if (data[i]['descripcion'] != null) {
        //this.alertUtils.presentOKAlert('!!!!!!!', data[i]['descripcion'].toString().length);
        this.cropRenglones(data[i]['descripcion'], doc, space);

        /*if (data[i]['descripcion'].toString().length > 15) {
          doc.text(280.629, space, data[i]['descripcion'].toString().substring(0, 15));
          doc.text(280.629, (space + 5.67), data[i]['descripcion'].toString().substring(15));
        } else {
          doc.text(280.629, space, data[i]['descripcion'].toString());
        }*/
      }
      //doc.text(90, space, data[i]['notas'] != null ? data[i]['notas'].toString() : '');
      doc.text(535.74, space, data[i]['Saldo'].toString());
    }


    let pdfOutput = doc.output();
    let buffer = new ArrayBuffer(pdfOutput.length);
    let array = new Uint8Array(buffer);
    for (var i = 0; i < pdfOutput.length; i++) {
      array[i] = pdfOutput.charCodeAt(i);
    }

    const directory = this.file.dataDirectory;
    const fileName = "Extracto Cartera.pdf";
    let options2: IWriteOptions = { replace: true };

    this.file.checkFile(directory, fileName).then((success) => {
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

  cropRenglones(text: String, doc, space) {
    if (text.length > 15) {
      doc.text(280.629, space, text.toString().substring(0, 15));
      doc.text(280.629, (space + 5.67), text.toString().substring(15));
    } else {
      doc.text(280.629, space, text.toString());
    }
  }

  formatFecha(fecha) {
    return fecha.format('D-') + this.months.find(m => m[0] == fecha.format('MM'))[1] + fecha.format('-YYYY');
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
