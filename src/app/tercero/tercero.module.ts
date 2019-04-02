import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TerceroComponent } from './tercero.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';
import { AlertUtilsComponent } from '../utils/alert-utils.component';
import { EmailComposer } from '@ionic-native/email-composer/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,

    RouterModule.forChild([
      {
        path: '',
        component: TerceroComponent
      }
    ])
  ],
  declarations: [TerceroComponent],
  providers: [AppPreferences, AlertUtilsComponent, EmailComposer]
})
export class TerceroComponentModule { }
