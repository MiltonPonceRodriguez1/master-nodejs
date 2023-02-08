import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { routing, appRoutingProviders } from "./app.routing";

import { AppComponent } from './app.component';
import { ArticleNewComponent } from './components/article-new/article-new.component';
import { HomeComponent } from './components/home/home.component';
import { ArticleDetailComponent } from './components/article-detail/article-detail.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { ArticleDeleteComponent } from './components/article-delete/article-delete.component';
import { ArticleEditComponent } from './components/article-edit/article-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticleNewComponent,
    HomeComponent,
    ArticleDetailComponent,
    ImageUploadComponent,
    ArticleDeleteComponent,
    ArticleEditComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
