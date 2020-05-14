import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let duplicate;
    if (!req.params.get('anon')) {
      duplicate = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${this.authService.token || ''}`)
      });
    } else {
      duplicate = req.clone({
        headers: req.headers.delete('anon')
      });
    }

    return next.handle(duplicate).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
}
