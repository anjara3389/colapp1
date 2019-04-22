import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { PdfCarteraComponent } from './pdf-cartera.component';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: PdfCarteraComponent
      }
    ])
  ],
  declarations: [PdfCarteraComponent],
  providers: [AppPreferences,
    FileOpener,
    File]
})
export class PdfCarteraComponentModule { }
