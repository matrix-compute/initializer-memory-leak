import { enableProdMode } from '@angular/core';
import * as Sentry from "@sentry/angular-ivy";
import { environment } from './environments/environment';
import 'hammerjs';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import posthog from 'posthog-js';
import { register as registerSwiperElements } from 'swiper/element/bundle';

if (environment.production) {
  enableProdMode();
}

if (environment.name === 'production') {
  Sentry.init({
    dsn: environment.sentryDsn,
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.routingInstrumentation,
      }),
      new Sentry.Replay(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

posthog.init(environment.posthogDsn, { api_host: environment.posthogHost, autocapture: false });

registerSwiperElements();
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
