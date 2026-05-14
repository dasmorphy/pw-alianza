import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, WritableSignal, effect, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
    private readonly http = inject(HttpClient);
    private readonly messageService = inject(MessageService);


    postFormExpo(data: any) {
        return this.http.post(
            `${environment.apiUrl}/rest/zent-logbook-api/v1.0/form-expo`,
            {data}
        );
    }

    getFormExpo() {
        return this.http.get(
            `${environment.apiUrl}/rest/zent-logbook-api/v1.0/form-expo`,
        );
    }

    scanQr(tokenQr: any) {
        return this.http.get(
            `${environment.apiUrl}/rest/zent-logbook-api/v1.0/validate-qr-invitation?qr-token=${tokenQr}`,
        );
    }

    sendEmail(id_form: number) {
        return this.http.get(
            `${environment.apiUrl}/rest/zent-logbook-api/v1.0/send-qr/${id_form}`,
        );
    }

    getReportHistory() {
        return this.http.get(`${environment.apiUrl}/rest/zent-logbook-api/v1.0/generate_report_form`,
            {
                responseType: 'blob',
                observe: 'response'
            }
        )
    }

}