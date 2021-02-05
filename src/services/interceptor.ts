import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
// import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class Interceptor implements HttpInterceptor {
//   private router;
token='nDdeTvPTWnuYO8qd9Y7Pu4SZNwZpB4AR';
  constructor() {
    // private authenticationService: AuthService
    // this.router = inj.get(AuthService);
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
      request = request.clone({
        setHeaders: {
            AuthToken : this.token,
        },
      });
    return next.handle(request).pipe(
        
      catchError(error => {
          console.log(error);
        if (error instanceof HttpErrorResponse && error.status === 401) {
        //   this.router.logout();
          return throwError(error);
        } else {
          return throwError(error);
        }
      }),
    );
  }
}
// import { Injectable, Injector } from '@angular/core';
// import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders} from '@angular/common/http';
// import { Observable } from 'rxjs';
// import 'rxjs/add/observable/throw'
// import 'rxjs/add/operator/catch';
// @Injectable()
// export class Interceptor implements HttpInterceptor {
//   constructor() {}
//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
// //  if(localStorage.getItem('access-token') != null) 
// // {
// const token ='nDdeTvPTWnuYO8qd9Y7Pu4SZNwZpB4AR';

// //    const token =  localStorage.getItem('access-token');
// // if the token is  stored in localstorage add it to http header
// const headers = new HttpHeaders().set("AuthToken", token);
//    //clone http to the custom AuthRequest and send it to the server 
// const AuthRequest = request.clone( { headers: headers});
// return next.handle(AuthRequest)
// //    }else {
// //      return next.handle(request);
// //    }
//   }
// }