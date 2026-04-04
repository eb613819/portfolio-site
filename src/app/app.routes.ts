import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ExperienceComponent } from './pages/experience/experience.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { EditorComponent } from './pages/editor/editor.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'projects', component: ProjectsComponent},
    { path: 'experience', component: ExperienceComponent},
    { path: 'about', component: AboutComponent},
    { path: 'contact', component: ContactComponent},
    { path: 'editor', component: EditorComponent},
];
