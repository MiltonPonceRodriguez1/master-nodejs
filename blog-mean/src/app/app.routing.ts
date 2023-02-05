// IMPORT DEPENDENCYS
import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// IMPORT COMPONENTS
import { ArticleNewComponent } from "./components/article-new/article-new.component";
import { HomeComponent } from "./components/home/home.component";

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'article-new', component: ArticleNewComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);