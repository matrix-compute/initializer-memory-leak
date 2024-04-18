import { Component, DestroyRef, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgStyle } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgxToastModule } from '@angular-magic/ngx-toast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    NgxToastModule,
    NgStyle,
    RouterOutlet,
  ],
  standalone: true,
})
export class AppComponent implements OnInit {
  isBrowser: boolean;

  private destroyRef = inject(DestroyRef);

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
  }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
}
