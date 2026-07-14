import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    if (['POST','PUT','PATCH','DELETE'].includes(req.method)) {
      return next.handle().pipe(tap(() => {
        console.log(`[AUDIT] ${new Date().toISOString()} ${req.method} ${req.url} by ${req.user?.email || 'anon'}`);
      }));
    }
    return next.handle();
  }
}
