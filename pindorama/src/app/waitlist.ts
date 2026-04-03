import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WaitlistService {
  private readonly apiUrl = 'http://localhost:5000/waitlist';

  constructor(private http: HttpClient) {}

  join(email: string): Observable<unknown> {
    return this.http.post(this.apiUrl, { email });
  }
}
