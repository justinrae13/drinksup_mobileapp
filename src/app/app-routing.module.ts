import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'custom-splashscreen', pathMatch: 'full' },
    { path: 'login', loadChildren: '../pages/login/login.module#LoginPageModule' },
    { path: 'register/:email', loadChildren: '../pages/register/register.module#RegisterPageModule' },
    { path: 'settings', loadChildren: '../pages/settings/settings.module#SettingsPageModule' },
    { path: 'tabs', loadChildren: '../pages/tabs/tabs.module#TabsPageModule' },
    { path: 'tabsadmin', loadChildren: '../pages/tabsadmin/tabsadmin.module#TabsadminPageModule' },
    { path: 'tabsproprio', loadChildren: '../pages/tabsproprio/tabsproprio.module#TabsproprioPageModule' },
    { path: 'faq', loadChildren: '../pages/faq/faq.module#FaqPageModule' },
    { path: 'abonnement', loadChildren: '../pages/abonnement/abonnement.module#AbonnementPageModule' },
    { path: 'registerthirdparty/:name/:email/:id', loadChildren: '../pages/registerthirdparty/registerthirdparty.module#RegisterthirdpartyPageModule' },
    { path: 'forgot-password', loadChildren: '../pages/forgot-password/forgot-password.module#ForgotPasswordPageModule' },
    { path: 'forgot-password/:email', loadChildren: '../pages/forgot-password/forgot-password.module#ForgotPasswordPageModule' },
    { path: 'bar-user/:id', loadChildren: '../pages/bar-user/bar-user.module#BarUserPageModule'},
    { path: 'bar-user/:id/:idOffer', loadChildren: '../pages/bar-user/bar-user.module#BarUserPageModule'},
    { path: 'search-a-bar', loadChildren: '../pages/search-a-bar/search-a-bar.module#SearchABarPageModule'},
    { path: 'bar/:id_partenaire', loadChildren: '../pages/bar/bar.module#BarPageModule'},
    { path: 'cgu', loadChildren: '../pages/cgu/cgu.module#CguPageModule' },
    { path: 'parrainage', loadChildren: '../pages/parrainage/parrainage.module#ParrainagePageModule' },
    { path: 'custom-splashscreen', loadChildren: '../pages/custom-splashscreen/custom-splashscreen.module#CustomSplashscreenPageModule' },  { path: 'show-map', loadChildren: './show-map/show-map.module#ShowMapPageModule' },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
