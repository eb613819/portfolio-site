import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Project } from '../../interfaces/project.interface';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent implements OnInit {
  private readonly DATA_REPO = 'eb613819/portfolio-site-data';
  private readonly PROJECTS_PATH = 'data/projects.json';

  isLoggedIn = false;
  loading = false;
  error: string | null = null;

  projects: Project[] = [];
  selectedProject: Project | null = null;

  constructor(private auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    // handle OAuth callback
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      // clean the code out of the URL immediately
      window.history.replaceState({}, '', '/editor');
      this.handleCallback(code);
    } else if (this.auth.isLoggedIn()) {
      this.loadProjects();
    }

    this.isLoggedIn = this.auth.isLoggedIn();
  }

  login(): void {
    this.auth.login();
  }

  logout(): void {
    this.auth.logout();
    this.isLoggedIn = false;
    this.projects = [];
    this.selectedProject = null;
  }

  private async handleCallback(code: string): Promise<void> {
    this.loading = true;
    try {
      await this.auth.handleCallback(code);
      this.isLoggedIn = true;
      await this.loadProjects();
    } catch (e) {
      this.error = 'Login failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  private async loadProjects(): Promise<void> {
    this.loading = true;
    try {
      const token = this.auth.getToken();
      const response = await fetch(
        `https://api.github.com/repos/${this.DATA_REPO}/contents/${this.PROJECTS_PATH}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } }
      );
      const file = await response.json();
      const content = atob(file.content.replace(/\n/g, ''));
      this.projects = JSON.parse(content);
    } catch (e) {
      this.error = 'Failed to load projects.';
    } finally {
      this.loading = false;
    }
  }

  selectProject(project: Project): void {
    this.selectedProject = { ...project };
  }
}
