import { Routes } from '@angular/router';

import { FormExpoComponent } from './components/form_expo/form-expo.component';
import { TableRegisterComponent } from './components/table-register/table-register.component';

export const routes: Routes = [
    {
        path: "",
        component: FormExpoComponent,
    },

    {
        path: "data-registros",
        component: TableRegisterComponent
    },
    {
        path: "**",
        redirectTo: "",
    },

];
