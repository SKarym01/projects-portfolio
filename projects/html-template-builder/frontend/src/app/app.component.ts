import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HeroBannerComponent } from './components/elements/hero-banner/hero-banner.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { NavigationComponent } from './components/elements/navigation/navigation.component';
import { BodyComponent } from './components/layout/body/body.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddTemplateComponent } from './components/views/add-template/add-template.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    CommonModule,
    RouterOutlet,
    NgOptimizedImage,
    ReactiveFormsModule,
    HeroBannerComponent,
    HeaderComponent,
    NavigationComponent,
    BodyComponent,
    AddTemplateComponent,
  ],
})
export class AppComponent {
  protected appHeader: string | undefined;

  constructor(private titleService: Title) {}
}
