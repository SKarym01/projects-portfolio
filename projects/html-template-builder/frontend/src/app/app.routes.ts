import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { OverviewComponent } from './components/views/milestone-overview/overview.component';
import { AddTemplateComponent } from './components/views/add-template/add-template.component';
import { AuthGuard } from './auth copy/auth.guard';

// Application route definitions
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/overview', // Redirect root path to 'overview' page
    pathMatch: 'full', // Ensures full match of the empty path
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard], // Protected route, accessible only if authenticated
  },
  {
    path: 'overview',
    component: OverviewComponent,
    canActivate: [AuthGuard], // Displays list of email templates
  },
  {
    path: 'addnewtemp',
    component: AddTemplateComponent,
    canActivate: [AuthGuard], // Route to add a new email template
  },
  {
    path: 'edit-template/:id',
    component: AddTemplateComponent,
    canActivate: [AuthGuard], // Route to edit an existing template by ID
  },
];
