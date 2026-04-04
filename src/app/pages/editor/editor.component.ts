import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Project, ProjectChallenge, ProjectStatus, ProjectType } from '../../interfaces/project.interface';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent implements OnInit {
  private readonly DATA_REPO = 'eb613819/portfolio-site-data';
  private readonly PROJECTS_PATH = 'data/projects.json';
  private readonly IMAGES_PATH = 'images';
  private fileSha: string = '';

  isLoggedIn = false;
  loading = false;
  saving = false;
  error: string | null = null;
  saveSuccess = false;

  projects: Project[] = [];
  selectedProject: Project | null = null;
  originalProject: string = '';
  hasUnsavedChanges = false;

  readonly allTypes: ProjectType[] = [
    '3D Printing / CAD',
    'Electronics / Embedded',
    'Software / Web',
    'Networking / Infrastructure',
    'Home Lab',
    'DevOps / Cloud'
  ];

  readonly allStatuses: ProjectStatus[] = ['Not Started', 'In Progress', 'Completed'];

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      window.history.replaceState({}, '', '/editor');
      this.handleCallback(code);
    } else if (this.auth.isLoggedIn()) {
      this.isLoggedIn = true;
      this.loadProjects();
    }
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
      console.log('Got code, exchanging...');
      await this.auth.handleCallback(code);
      console.log('Token received:', this.auth.getToken());
      this.isLoggedIn = true;
      await this.loadProjects();
    } catch (e) {
      console.error('Callback error:', e);
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
      this.fileSha = file.sha;
      const content = decodeURIComponent(escape(atob(file.content.replace(/\n/g, ''))));
      this.projects = JSON.parse(content);
    } catch {
      this.error = 'Failed to load projects.';
    } finally {
      this.loading = false;
    }
  }

  selectProject(project: Project): void {
    if (this.hasUnsavedChanges) {
      const confirmed = confirm('You have unsaved changes. Discard them and switch projects?');
      if (!confirmed) return;
    }
    this.selectedProject = JSON.parse(JSON.stringify(project));
    this.originalProject = JSON.stringify(this.selectedProject);
    this.hasUnsavedChanges = false;
    this.saveSuccess = false;
  }

  newProject(): void {
    if (this.hasUnsavedChanges) {
      const confirmed = confirm('You have unsaved changes. Discard them and create a new project?');
      if (!confirmed) return;
    }
    const blank: Project = {
      title: '',
      types: [],
      status: 'Not Started',
      overview: '',
      challenges: [],
      tags: [],
      images: [],
    };
    this.selectedProject = blank;
    this.originalProject = JSON.stringify(blank);
    this.hasUnsavedChanges = false;
  }

  onFieldChange(): void {
    this.hasUnsavedChanges = JSON.stringify(this.selectedProject) !== this.originalProject;
  }

  // Types
  toggleType(type: ProjectType): void {
    if (!this.selectedProject) return;
    const types = this.selectedProject.types;
    const idx = types.indexOf(type);
    if (idx > -1) types.splice(idx, 1);
    else types.push(type);
    this.onFieldChange();
  }

  hasType(type: ProjectType): boolean {
    return this.selectedProject?.types.includes(type) ?? false;
  }

  // Tags
  tagInput = '';
  addTag(): void {
    if (!this.selectedProject || !this.tagInput.trim()) return;
    if (!this.selectedProject.tags) this.selectedProject.tags = [];
    this.selectedProject.tags.push(this.tagInput.trim());
    this.tagInput = '';
    this.onFieldChange();
  }

  removeTag(i: number): void {
    this.selectedProject?.tags?.splice(i, 1);
    this.onFieldChange();
  }

  // Challenges
  addChallenge(): void {
    if (!this.selectedProject) return;
    if (!this.selectedProject.challenges) this.selectedProject.challenges = [];
    this.selectedProject.challenges.push({ problem: '', solution: '' });
    this.onFieldChange();
  }

  removeChallenge(i: number): void {
    this.selectedProject?.challenges?.splice(i, 1);
    this.onFieldChange();
  }

  // Hardware
  hardwareInput = '';
  addHardware(): void {
    if (!this.selectedProject || !this.hardwareInput.trim()) return;
    if (!this.selectedProject.hardware) this.selectedProject.hardware = [];
    this.selectedProject.hardware.push(this.hardwareInput.trim());
    this.hardwareInput = '';
    this.onFieldChange();
  }

  removeHardware(i: number): void {
    this.selectedProject?.hardware?.splice(i, 1);
    this.onFieldChange();
  }

  // Features
  featureInput = '';
  addFeature(): void {
    if (!this.selectedProject || !this.featureInput.trim()) return;
    if (!this.selectedProject.features) this.selectedProject.features = [];
    this.selectedProject.features.push(this.featureInput.trim());
    this.featureInput = '';
    this.onFieldChange();
  }

  removeFeature(i: number): void {
    this.selectedProject?.features?.splice(i, 1);
    this.onFieldChange();
  }

  // Images
  async uploadImage(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !this.selectedProject) return;

    const file = input.files[0];
    const filename = file.name.toLowerCase().replace(/\s+/g, '_');
    const base64 = await this.toBase64(file);
    const token = this.auth.getToken();

    const response = await fetch(
      `https://api.github.com/repos/${this.DATA_REPO}/contents/${this.IMAGES_PATH}/${filename}`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
        body: JSON.stringify({
          message: `Add image ${filename}`,
          content: base64,
        }),
      }
    );

    if (response.ok) {
      if (!this.selectedProject.images) this.selectedProject.images = [];
      const imageUrl = `https://raw.githubusercontent.com/${this.DATA_REPO}/main/${this.IMAGES_PATH}/${filename}`;
      this.selectedProject.images.push(imageUrl);
      this.onFieldChange();
    } else {
      this.error = 'Image upload failed.';
    }

    input.value = '';
  }

  removeImage(i: number): void {
    this.selectedProject?.images?.splice(i, 1);
    this.onFieldChange();
  }

  private toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Save
  async save(): Promise<void> {
    if (!this.selectedProject) return;
    if (!this.selectedProject.title.trim()) {
      this.error = 'Project must have a title before saving.';
      return;
    }
    this.saving = true;
    this.error = null;
    this.saveSuccess = false;

    try {
      const isNew = !this.projects.find(p => p.title === this.selectedProject!.title);
      if (isNew) {
        this.projects.push(this.selectedProject);
      } else {
        const idx = this.projects.findIndex(p => p.title === this.selectedProject!.title);
        this.projects[idx] = this.selectedProject;
      }

      const token = this.auth.getToken();
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(this.projects, null, 2))));

      const response = await fetch(
        `https://api.github.com/repos/${this.DATA_REPO}/contents/${this.PROJECTS_PATH}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
          body: JSON.stringify({
            message: isNew 
              ? `Add ${this.selectedProject.title}` 
              : `Update ${this.selectedProject.title} data`,
            content,
            sha: this.fileSha,
          }),
        }
      );

      if (!response.ok) throw new Error('Save failed');

      const result = await response.json();
      this.fileSha = result.content.sha;
      this.originalProject = JSON.stringify(this.selectedProject);
      this.hasUnsavedChanges = false;
      this.saveSuccess = true;
    } catch {
      this.error = 'Failed to save. Please try again.';
      // remove the project we just pushed if it was new
      if (!this.projects.find(p => p.title === this.selectedProject!.title)) {
        this.projects.pop();
      }
    } finally {
      this.saving = false;
    }
  }

  // Helpers
  showPlan(): boolean {
    return this.selectedProject?.status === 'Not Started' || this.selectedProject?.status === 'In Progress';
  }

  showChallenges(): boolean {
    return this.selectedProject?.status === 'In Progress' || this.selectedProject?.status === 'Completed';
  }

  showLearned(): boolean {
    return this.selectedProject?.status === 'Completed';
  }
}
