import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { ProfileComponent } from '../profile/profile.component';
import { TaskComponent } from '../task/task.component';
import { TaskIdComponent } from '../task-id/task-id.component';
import { TaskAddComponent } from '../task-add/task-add.component';
import { TaskEditComponent } from '../task-edit/task-edit.component';

export const routes: Routes = [
    { path: '', component: TaskComponent },
    { path: "task/:id", component: TaskIdComponent },
    { path: "task/edit/:id", component: TaskEditComponent },
    { path: "addtask", component: TaskAddComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'profile', component: ProfileComponent },
];
