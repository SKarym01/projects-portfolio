import { Component, Input } from '@angular/core';
import { IconColors, IconNames } from './icon-names.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icons.component.html',
  styleUrl: './icons.component.scss',
})
export class IconsComponent {
  @Input() name: IconNames = IconNames.Error;
  @Input() size!: number;
  @Input() color: IconColors = IconColors.None;
}
