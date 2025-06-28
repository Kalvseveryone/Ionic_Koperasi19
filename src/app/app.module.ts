import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { IonRouterOutlet } from '@ionic/angular';
import { AnimationController, createAnimation } from '@ionic/angular';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Custom animation for page transitions
export const pageTransition = (_: HTMLElement, opts: any) => {
  const animationCtrl = new AnimationController();
  
  if (opts.direction === 'forward') {
    return animationCtrl.create()
      .addElement(opts.enteringEl)
      .duration(300)
      .easing('cubic-bezier(0.36,0.66,0.04,1)')
      .fromTo('opacity', 0.01, 1)
      .fromTo('transform', 'translateX(40px)', 'translateX(0px)');
  } else {
    return animationCtrl.create()
      .addElement(opts.enteringEl)
      .duration(300)
      .easing('cubic-bezier(0.36,0.66,0.04,1)')
      .fromTo('opacity', 0.01, 1)
      .fromTo('transform', 'translateX(-40px)', 'translateX(0px)');
  }
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    HttpClientModule,
    IonicModule.forRoot({
      // Configure smooth animations for page transitions
      navAnimation: pageTransition,
      animated: true,
      rippleEffect: true,
      mode: 'ios', // iOS animations are typically smoother
      scrollAssist: true,
      swipeBackEnabled: true
    }), 
    AppRoutingModule,
    IonicStorageModule.forRoot({
      name: '__koperasi_db',
      driverOrder: ['sqlite', 'indexeddb', 'localstorage']
    })
    
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // HTTP Interceptors
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
