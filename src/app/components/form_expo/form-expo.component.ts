import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { DropdownModule } from 'primeng/dropdown';
import { DashboardService } from 'src/app/services/dashboard.service';
import { CalendarModule } from 'primeng/calendar';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { UtilsService } from 'src/app/services/utils.service';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CLIENT_OPTIONS, POSITION_BY_CLIENT } from 'src/app/services/clients_form';

@Component({
  selector: 'app-form-expo',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule,
    FormsModule,
    DialogModule,
    OverlayPanelModule,
    MultiSelectModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ToastModule,
    RadioButtonModule
  ],
  templateUrl: './form-expo.component.html',
  styleUrls: ['./form-expo.component.sass'],
})
export class FormExpoComponent {

  private utilsService = new UtilsService();
  public readonly dashboardService = inject(DashboardService);

  isAssisting: boolean = false;
  otherIndustry: any = '';
  otherBusiness: any = '';
  otherPosition: any = '';
  registrationForm: FormGroup;
  positions: any[] = [];

  clientOptions = CLIENT_OPTIONS;

  typeIndustry: string[] = [
    "Ninguna", 
    "Camaronera", 
    "Industrial", 
    "Bananera", 
    "Minera", 
    "Urbanizaciones / Inmobiliario", 
    "Seguridad", 
    "Otro"
  ];

  constructor(private fb: FormBuilder,) {
    this.registrationForm = this.fb.group({
      names: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$")]],
      business: ['', Validators.required],
      position: ['', Validators.required],
      phone: ['', Validators.required],
      type_industry: ['', Validators.required],
      is_assist: [null, Validators.required],
    });
  }


  onSubmit() {
    if (this.registrationForm.get("phone")?.value?.length !== 10) {
      this.utilsService.onWarn("Por favor, ingrese un número de celular válido de 10 dígitos.");
      return;
    }

    if (this.registrationForm.valid) {
      let formValue = { ...this.registrationForm.value };


      if (formValue.type_industry === 'Otro' && !this.otherIndustry) {
        this.utilsService.onWarn("Por favor, ingrese el nombre de la industria.");
        return;
      }

      if (formValue.position === 'Otro' && !this.otherPosition) {
        this.utilsService.onWarn("Por favor, ingrese el nombre del cargo.");
        return;
      }

      if (formValue.business === 'Otro' && !this.otherBusiness) {
        this.utilsService.onWarn("Por favor, ingrese el nombre de la empresa.");
        return;
      }

      if (formValue.business != 'Otro' && formValue.position != 'Otro') {
        formValue.is_coincidence = true;
      }

      if (formValue.type_industry === 'Otro') {
        formValue.type_industry = this.otherIndustry;
      }

      if (formValue.position === 'Otro') {
        formValue.position = this.otherPosition;
      }

      if (formValue.business === 'Otro') {
        formValue.business = this.otherBusiness;
      }

      console.log(formValue);
      this.dashboardService.postFormExpo(formValue).subscribe({
        next: (response) => {
          this.utilsService.onSuccess("Formulario enviado exitosamente.");  
          this.registrationForm.reset();
          this.otherIndustry = null;
          this.otherPosition = null;
          this.otherBusiness = null;
        },
        error: (error) => {
          console.log(error);
          const message_error = error?.error?.message;
          this.utilsService.onError(message_error ?? "Error al enviar el formulario. Por favor, inténtelo de nuevo.");
        }
      });


    } else {
      this.utilsService.onWarn("Por favor, complete todos los campos requeridos.");
    }
  }


  onChangeClient(client: string) {
    this.positions = POSITION_BY_CLIENT[client] || [];
  }
    
}