import {
    Component,
    inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { TimelineModule } from 'primeng/timeline';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { NgxTippyModule } from 'ngx-tippy-wrapper';

import {
    ZXingScannerModule
} from '@zxing/ngx-scanner';


import { DashboardService } from 'src/app/services/dashboard.service';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
    selector: 'app-table-register',
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        FormsModule,
        ButtonModule,
        ProgressSpinnerModule,
        ToastModule,
        DropdownModule,
        TableModule,
        InputTextModule,
        ReactiveFormsModule,
        TagModule,
        CalendarModule,
        MultiSelectModule,
        TimelineModule,
        SplitButtonModule,
        NgxTippyModule,
        TieredMenuModule,
        OverlayPanelModule,
        ZXingScannerModule
    ],
    providers: [MessageService],
    templateUrl: './table-register.component.html',
    styleUrls: ['./table-register.component.sass'],
})
export class TableRegisterComponent {

    public readonly dashboardService = inject(DashboardService);
    public readonly messageService = inject(MessageService);
    public readonly utilsService = inject(UtilsService);
    private readonly router = inject(Router)

    isLoading: boolean = false;

    registrations: any[] = [];

    scannerEnabled: boolean = false;
    scannerReady: boolean = false;

    scannerError: string = '';

    selectedRegister: any;

    availableDevices: MediaDeviceInfo[] = [];

    currentDevice: MediaDeviceInfo | undefined;

    hasScanned: boolean = false;

    items: any = [
        {
            label: 'Enviar QR',
            icon: 'pi pi-qrcode',
            visible: () => !this.selectedRegister?.token_qr,
        },
    ];

    constructor() {}

    ngOnInit(): void {
        this.askCredentials();
    }

    askCredentials() {

        const username = window.prompt('Usuario:');

        if (!username) {
            return;
        }

        const password = window.prompt('Contraseña:');

        if (!password) {
            return;
        }

        if (username === 'admin' && password === '1234') {
            this.loadRegistrations();

        } else {

            this.messageService.add({
                severity: 'error',
                summary: 'Acceso denegado',
                detail: 'Usuario o contraseña incorrectos'
            });

            this.router.navigate(['/']);

        }
    }

    fetchReportHistory() {
        this.isLoading = true;

        this.dashboardService.getReportHistory().subscribe({
            next: (data: any) => {
                this.isLoading = false;
                this.utilsService.downloadFile(data, 'reporte_excel');
            },
            error: (error: any) => {
                this.isLoading = false;
                console.log(error)
            }
        })
    }

    optionsRegister(register: any) {
        this.selectedRegister = register;
    }

    generateExcel() {
        this.fetchReportHistory();
    }

    scanQr() {

        this.scannerError = '';

        this.hasScanned = false;

        this.scannerEnabled = true;

    }

    onScannerDialogShow() {

        setTimeout(() => {

            this.scannerReady = true;

        }, 300);

    }

    closeScanner() {

        this.scannerEnabled = false;

        this.scannerReady = false;

    }

    onCamerasFound(devices: MediaDeviceInfo[]) {

        this.availableDevices = devices;

        if (!devices || devices.length === 0) {

            this.scannerError = 'No se encontró ninguna cámara disponible en este dispositivo.';

            this.messageService.add({
                severity: 'error',
                summary: 'Cámara no encontrada',
                detail: 'No se detectaron cámaras disponibles.'
            });

            return;

        }

        const backCamera = devices.find(device =>
            device.label.toLowerCase().includes('back')
            ||
            device.label.toLowerCase().includes('rear')
        );

        this.currentDevice = backCamera || devices[0];

    }

    onHasPermission(hasPermission: boolean) {

        if (!hasPermission) {

            this.scannerError = 'No se otorgaron permisos para acceder a la cámara.';

            this.messageService.add({
                severity: 'warn',
                summary: 'Permisos requeridos',
                detail: 'Debes permitir acceso a la cámara.'
            });

        }

    }

    onScannerError(error: any) {

        console.error(error);

        if (
            error?.name === 'NotFoundError'
        ) {

            this.scannerError = 'No se encontró ninguna cámara compatible.';

        }
        else if (
            error?.name === 'NotAllowedError'
        ) {

            this.scannerError = 'El navegador bloqueó el acceso a la cámara.';

        }
        else if (
            error?.name === 'NotReadableError'
        ) {

            this.scannerError = 'La cámara está siendo usada por otra aplicación.';

        }
        else {

            this.scannerError = 'Ocurrió un error al iniciar la cámara.';

        }

        this.messageService.add({
            severity: 'error',
            summary: 'Error de cámara',
            detail: this.scannerError
        });

    }

    onScan(qr: string) {

        if (this.hasScanned) return;

        this.hasScanned = true;

        this.closeScanner();

        this.isLoading = true;

        this.dashboardService.scanQr(qr).subscribe({

            next: (data: any) => {

                this.isLoading = false;

                console.log(data);

                this.messageService.add({
                    severity: 'success',
                    summary: 'QR válido',
                    detail: 'Código QR escaneado correctamente.'
                });

            },

            error: (error: any) => {

                this.isLoading = false;

                console.error(error);

                this.messageService.add({
                    severity: 'error',
                    summary: 'QR inválido',
                    detail: 'No se pudo validar el código QR.'
                });

            }

        });

    }

    getSeverity(status: string) {
        switch (status) {
        case "Enviado":
            return 'success';
        case "Pendiente":
            return 'warning';
        default:
            return 'info';
        }
    }

    loadRegistrations() {

        this.isLoading = true;

        this.dashboardService.getFormExpo().subscribe({

            next: (data: any) => {

                this.isLoading = false;

                this.registrations = data?.data;

            },

            error: (error: any) => {

                this.isLoading = false;

                console.error(error);

            }

        });

    }

}