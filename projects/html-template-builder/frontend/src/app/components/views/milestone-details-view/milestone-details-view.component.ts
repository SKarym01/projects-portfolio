import { Component } from '@angular/core';
import { CardListDirective } from '../../elements/card/card-list.directive';
import { CardComponent } from '../../elements/card/card.component';

@Component({
  selector: 'app-milestone-details-view',
  standalone: true,
  imports: [CardListDirective, CardComponent],
  templateUrl: './milestone-details-view.component.html',
  styleUrl: './milestone-details-view.component.scss',
})
export class MilestoneDetailsViewComponent {}
