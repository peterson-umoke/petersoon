import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const optimize = document.createElement('script');
optimize.innerHTML = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-75285505-5', { 'optimize_id': '${environment.GOOGLE_OPTIMIZE_ID}'});
`;
document.head.appendChild(optimize);

const antiFlicker = document.createElement('script');
antiFlicker.innerHTML = `
  (function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;
  h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};
  (a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;
  })(window,document.documentElement,'async-hide','dataLayer',4000,
  {'${environment.GOOGLE_OPTIMIZE_ID}':true});
`;
document.head.appendChild(antiFlicker);

const googleMaps = document.createElement('script');
googleMaps.src = `https://maps.googleapis.com/maps/api/js?key=${environment.GOOGLE_JS_MAPS_KEY}&libraries=geocoding,places,visualization`;
googleMaps.async = true;
googleMaps.defer = true;
document.head.appendChild(googleMaps);

const typography = document.createElement('link');
typography.rel = 'stylesheet';
typography.type = 'text/css';
typography.href = `${environment.TYPOGRAPHY_URL}`;
document.head.appendChild(typography);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));
