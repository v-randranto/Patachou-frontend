import { Pipe, PipeTransform } from '@angular/core';

// Custom titlecase pour tenir compte des tirets dans les noms
@Pipe({name: 'customTitleCase'})
export class CustomTitleCasePipe implements PipeTransform {
  // static forRoot(): any[] | import("@angular/core").Type<any> | import("@angular/core").ModuleWithProviders<{}> {
  //   throw new Error("Method not implemented.");
  // }
  transform(value: string): string {
    return value.toLowerCase().replace(/(?:^|\s|\/|\-)\w/g, (match) => {
      return match.toUpperCase();
    });
  }
}
