import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const message =
          typeof error.error === 'string'
            ? error.error
            : (error.error?.message as string | undefined) ||
              `Erreur API (${error.status || 'network'})`;
        notifications.error(message);
      } else {
        notifications.error('Erreur inattendue.');
      }
      return throwError(() => error);
    }),
  );
};
