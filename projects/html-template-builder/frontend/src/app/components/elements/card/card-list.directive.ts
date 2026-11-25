import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[appCardList]',
  standalone: true,
})
export class CardListDirective {
  @HostBinding('style.display')
  display = 'flex';

  @HostBinding('style.flex-direction')
  flexDirection = 'column';

  @HostBinding('style.gap')
  gap = '1rem';
}
