import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SketchComponent } from './components/sketch/sketch.component';

const routes: Routes = [
  
  { path: '', component: SketchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
