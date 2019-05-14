import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {
    path: '',
    redirectTo:'splash',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginComponentModule'
  },
  {
    path: 'tercero',
    loadChildren: './tercero/tercero.module#TerceroComponentModule'
  },
  {
    path: 'pdf-cartera',
    loadChildren: './pdf-cartera/pdf-cartera.module#PdfCarteraComponentModule'
  },
  {
    path: 'novedades',
    loadChildren: './novedades/novedades.module#NovedadesComponentModule'
  },
  {
    path: 'splash',
    loadChildren: './splash/splash.module#SplashComponentModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
