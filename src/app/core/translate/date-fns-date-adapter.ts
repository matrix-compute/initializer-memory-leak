import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

const WEEK_STARTS_ON = 1; // 0 sunday, 1 monday...

@Injectable()
export class DateFnsDateAdapter extends NativeDateAdapter {
  getFirstDayOfWeek(): number {
    return WEEK_STARTS_ON;
  }
}
