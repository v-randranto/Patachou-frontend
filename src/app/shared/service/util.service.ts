import { Injectable } from '@angular/core';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  toTitleCase(value:string): string{
    return value.toLowerCase().replace(/(?:^|\s|\/|\-)\w/g, (match) => {
      return match.toUpperCase();
    });
  }

  subtractYears(date: Date, nb: number): string {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let  year = date.getFullYear() - nb;
    const dd = (day < 10 ? "0" : "") + day;
    const mm = (month < 10 ? "0" : "") + month;
    const yyyy = year;
    return `${yyyy}-${mm}-${dd}`;
  }

}
