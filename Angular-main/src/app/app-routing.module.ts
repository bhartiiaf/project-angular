import { NgModule } from "@angular/core";
import { Routes,RouterModule } from "@angular/router";
import { ApiComponent } from "./dbdinv/api/api.component";
import { AppComponent } from "./dbdinv/app.component";
import { DashboardInventory } from "./dbdinv/dbdinv.component";
const routes:Routes = [
    // {path:'',component:AppComponent},
    {path: 'api', component: ApiComponent},
    {path:'login', component:DashboardInventory},

    { path: '**', redirectTo: '' }

    
];

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]

})
export class AppRoutingModule {}