import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsComponent } from '../icons/icons.component';
import { IconColors, IconNames } from '../icons/icon-names.enum';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/enviroment/environment';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule, IconsComponent],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss',
})
export class ErrorComponent implements OnInit {
  @Input() errorMessage: string | null = null;
  IconNames = IconNames;
  IconColors = IconColors;
  mailAddress: string = environment.admin_mail;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.errorMessage = params['errorMsg'] ? params['errorMsg'] : null;
    });
  }
}
