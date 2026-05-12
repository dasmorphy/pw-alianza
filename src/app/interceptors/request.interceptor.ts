import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { Observable } from 'rxjs';
import { v4 as uuidv4} from 'uuid';


export const httpInterceptorRequest: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  let token = "";
  let idGroup = ""
  const user_session = localStorage.getItem('sb_token');
  let  urlPath: any;

  if (req.url != '/assets/encryption_key/public_key_prod.pem') {
    urlPath = new URL(req.url)?.pathname
  }

  if (user_session){
    // const user_session_json: any = JSON.parse(decrypt(user_session));
    token = user_session
    // idGroup = user_session_json?.groups[0]?.id
  }

  const clone = req.clone({
    setHeaders: {
      Token: token,
      channel: 'ZENTINEL_WEB',
      externalTransactionId: uuidv4()
    },
    body: req.method !== 'GET' && req.method !== 'DELETE'
      ? { ...(req.body || {}), channel: "ZENTINEL_WEB", externalTransactionId: uuidv4() }
      : req.body
  });

  return next(clone)
}