import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, startWith } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MarketService } from '@core/services/market.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  currentLang$: Observable<string>;
  config$: Observable<any>;
  config: any;
  headers: Record<string, string>;
  private _config: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private translateService: TranslateService,
    private httpClient: HttpClient,
    private marketService: MarketService
  ) {
    this.config$ = this._config.asObservable();
  }

  isSupportedLanguage(language: string): boolean {
    return this.config.languages.includes(language);
  }

  extractOrGetConfig(): Observable<any> {
    if (!this._config.value) {
      return this.extractConfig();
    }

    return this.config$;
  }

  extractConfig(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Accept', 'application/json');

    return this.httpClient.get('./market.json', { headers }).pipe(
      tap((config) => {
        this._config.next(config);
        this.config = config;
        this.marketService.currentMarket = this.config.market;

        this.setInternalizationSettings();
      })
    );
  }

  setInternalizationSettings(): void {
    this.translateService.addLangs(this.config.languages);
    this.translateService.setDefaultLang(this.config.defaultLanguage);
    this.translateService.use(this.config.defaultLanguage);
    this.currentLang$ = this.translateService.onLangChange.pipe(
      startWith(this.translateService.defaultLang),
      map(() => this.translateService.currentLang)
    );
  }
}
