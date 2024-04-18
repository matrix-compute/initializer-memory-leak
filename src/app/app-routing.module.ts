import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'hello-world',
    loadComponent: () => import('./features/hello-world/hello-world.component').then(c => c.HelloWorldComponent),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // relativeLinkResolution: 'legacy',
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
