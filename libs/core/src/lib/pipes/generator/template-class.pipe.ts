import { Pipe, PipeTransform } from '@angular/core';
import { GeneratorTemplate } from '../../models';

@Pipe({
  name: 'templateClass',
  pure: false,
})
export class TemplateClassPipe implements PipeTransform {
  transform(template: GeneratorTemplate, containerType: string): any {
    if (template != null && containerType) {
      return `${template.toLowerCase().replace('_', '-')} ${containerType}`;
    }
  }
}
