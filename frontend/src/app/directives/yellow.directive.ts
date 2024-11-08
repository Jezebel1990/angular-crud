import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appYellow]'
})
export class YellowDirective {

  constructor(private el: ElementRef) {
    el.nativeElement.style.color = '#ffff00'
   }

}
