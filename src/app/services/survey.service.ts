import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SurveyTelefonicaResponse } from '../core/interfaces/survey.interface';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private baseUrl = environment.base_url;

  constructor(private http: HttpClient) {}

  getEncuestasTelefonicas(): Observable<SurveyTelefonicaResponse> {
    return this.http.get<SurveyTelefonicaResponse>(`${this.baseUrl}/survey/telefonica`);
  }
}
