import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false,
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], accessor: string, value: string): any {
    if (!items || !accessor || !value) {
      return items;
    }

    return items.filter(
      (item) => item[accessor].toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
}
