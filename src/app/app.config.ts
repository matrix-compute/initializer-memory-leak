import { APP_ID, APP_INITIALIZER, ApplicationConfig, ErrorHandler, importProvidersFrom } from '@angular/core';
import { provideRouter, Router } from '@angular/router';

import { routes } from './app-routing.module';
import { HammerModule, provideClientHydration } from '@angular/platform-browser';
import { MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppMissingTranslationHandler } from '@core/translate/missing-translation-handler';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { IConfig, provideEnvironmentNgxMask } from 'ngx-mask';
import * as Sentry from '@sentry/angular-ivy';
import { NgxsModule } from '@ngxs/store';
import { ngxsConfig } from '../ngxs.config';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { environment } from '@environments/environment';
import { NgxToastModule } from '@angular-magic/ngx-toast';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { StarRatingModule } from 'angular-star-rating';
import { registerLocaleData } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import localeRoMd from '@angular/common/locales/ro-MD';
import localeEn from '@angular/common/locales/en';
import localeRu from '@angular/common/locales/ru-MD';
import localeIt from '@angular/common/locales/it';
import { ConfigService } from '@core/services/config.service';

registerLocaleData(localeRoMd, 'ro-MD');
registerLocaleData(localeEn, 'en');
registerLocaleData(localeRu, 'ru-MD');
registerLocaleData(localeIt, 'it');

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json?v=' + environment.version);
}

export const provideTranslation = () => ({
  missingTranslationHandler: {
    provide: MissingTranslationHandler,
    useClass: AppMissingTranslationHandler,
  },
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient],
  },
});

const maskConfig: Partial<IConfig> = {
  showMaskTyped: false,
};
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideClientHydration(),
    provideEnvironmentNgxMask(maskConfig),
    provideAnimationsAsync(),
    importProvidersFrom([
      TranslateModule.forRoot(provideTranslation()),
      HammerModule,
      NgxsModule.forRoot([], ngxsConfig),
      NgxsReduxDevtoolsPluginModule.forRoot({ disabled: environment.production }),
      NgxToastModule,
      StarRatingModule.forRoot(),
    ]),
    { provide: APP_ID, useValue: 'serverApp' },
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: false,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {
      },
      deps: [Sentry.TraceService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (translate: TranslateService) => () => {
        translate.setDefaultLang('en');
      },
      deps: [TranslateService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (configService: ConfigService) => () => {
        return configService.extractConfig()
      },
      deps: [ConfigService],
    },
  ],
};
