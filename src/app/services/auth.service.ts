import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly WORKER_URL = 'https://portfolio-oauth.eb613819.workers.dev';
  private readonly CLIENT_ID = 'Ov23liPk49fPrfRTRyzH';
  private readonly REDIRECT_URI = 'https://evanbrooks.me/editor';
  private readonly TOKEN_KEY = 'gh_token';

  login(): void {
    const params = new URLSearchParams({
      client_id: this.CLIENT_ID,
      redirect_uri: this.REDIRECT_URI,
      scope: 'repo',
    });
    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
  }

  async handleCallback(code: string): Promise<void> {
    const response = await fetch(`${this.WORKER_URL}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    sessionStorage.setItem(this.TOKEN_KEY, data.access_token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }
}
