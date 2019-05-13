import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController } from '@ionic/angular';
import * as jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { WservConnectService } from '../wserv-connect.service';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';
import { AlertUtilsComponent } from '../utils/alert-utils.component';

@Component({
  selector: 'app-pdf-cartera',
  templateUrl: './pdf-cartera.component.html',
  styleUrls: ['./pdf-cartera.component.scss'],
  providers: [AlertUtilsComponent]
})
export class PdfCarteraComponent implements OnInit {

  loading: any;
  nombres: any;
  fecha: any;
  ciudad: any;
  direccion: any;
  telefono: any;
  codigo: any;
  lista: any;



  constructor(public loadingCtrl: LoadingController,
    private file: File,
    private fileOpener: FileOpener,
    private wServConnectService: WservConnectService,
    private appPreferences: AppPreferences,
    public menuCtrl: MenuController,
    private alertUtils: AlertUtilsComponent) { }

  ngOnInit() { }

  async presentLoading(msg) {
    const loading = await this.loadingCtrl.create({
      message: msg
    });
    return await loading.present();
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
    this.presentLoading('Creando archivo PDF...');

    //var doc = new jsPDF("p", "mm", [215.9, 279.4]);
    var doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'letter'
    })
    

    doc.setFont("times");
    doc.setFontSize(8);
    doc.setFontStyle('bold');

    doc.text(78, 21, 'COOPERATIVA DE PRODUCTOS LACTEOS DE NARIÑO LTDA.');
    doc.text(45, 11, 'EXTRACTO CARTERA CLIENTE');
    doc.setFontSize(6);
    doc.text(370, 34, '0-Mes-0000');
    doc.text(7, 20, data[0]['nombres']);
    doc.text(105, 20, data[0]['ciudad']);
    doc.text(80, 20, nit.toString());
    //console.log("nit", nit);

    doc.setFontStyle('normal');
    doc.text(6, 24, 'DIRECCIÓN: ' + data[0]['direccion']);
    doc.text(88, 24, 'TELEFONO: ' + data[0]['telefono']);
    //doc.text(27, 20, 'CÓDIGO: ' + data[0]['telefono']);
    //doc.text(27, 20, 'LISTA: ' + data[0]['telefono']);

    for (i = 0; i < data.length; i++) {
      var space = (10 * i) + 37;

      doc.text(9, space, data[i]['Tipo'].toString());

      doc.text(19, space, data[i]['Numero'].toString());
      doc.text(26, space, data[i]['Fecha'].toString());
      doc.text(39, space, data[i]['Vencimiento'].toString());
      doc.text(53, space, data[i]['Dias_Vencido'].toString());
      doc.text(60, space, data[i]['documento'] != null ? data[i]['documento'].toString() : '');
      doc.text(68, space, data[i]['descripcion'] != null ? data[i]['descripcion'].toString() : '');
      doc.text(90, space, data[i]['notas'] != null ? data[i]['notas'].toString() : '');
      doc.text(141, space, data[i]['Saldo'].toString());
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
          //this.loading.dismiss();
          console.log("Creado exitosamente" + JSON.stringify(success));
          this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
            .then(() => console.log('El archivo está abierto'))
            .catch(e => console.log('Error al abril el archivo', e));
        })
        .catch((error) => {
          //this.loading.dismiss();
          console.log("No se puede crear el archivo " + JSON.stringify(error));
        });
    })
      .catch((error) => {
        //Writing File to Device
        this.file.writeFile(directory, fileName, buffer)
          .then((success) => {
            //this.loading.dismiss();
            console.log("Creado exitosamente" + JSON.stringify(success));
            this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
              .then(() => console.log('El archivo está abierto'))
              .catch(e => console.log('Error al abril el archivo', e));
          })
          .catch((error) => {
            // this.loading.dismiss();
            console.log("No se puede crear el archivo " + JSON.stringify(error));
          });
      });



    /*
    
        domtoimage.toPng(div, options).then((dataUrl)=> {
          
        })
        .catch(function (error) {
         // this.loading.dismiss();
          console.error('oops, something went wrong!', error);
        });*/
  }

}
