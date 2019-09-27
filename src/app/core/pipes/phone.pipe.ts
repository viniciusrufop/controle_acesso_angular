import { Pipe, PipeTransform } from '@angular/core';


@Pipe({name: 'phone'})
export class PhonePipe implements PipeTransform {

  transform(value: string): string {
    value = value.replace(/\D/g,'');
    if(value){
      let lengthValue = value.length;
      switch (lengthValue) {
        case 8:
          return `${value.slice(0, 4)}-${value.slice(4,8)}`;
        case 9:
          return `${value.slice(0, 1)} ${value.slice(1, 5)}-${value.slice(5,9)}`;
        case 10:
          return `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6,10)}`;
        case 11:
          return `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(3, 7)}-${value.slice(7,11)}`;
        default:
          return value;
      }
    } else {
      return value;
    }

  }
}