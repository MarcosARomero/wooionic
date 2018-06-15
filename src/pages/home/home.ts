import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ToastController } from 'ionic-angular';
import { ProductDetailsPage } from '../product-details/product-details';

import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  WooCommerce: any;
  products: any[];
  page: number;
  moreProducts: any[];
  

  @ViewChild('productsSlides') productSlides: Slides;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController) {

    this.page = 1;

    this.WooCommerce = WC({
      url: "http://localhost/wordpress",
      consumerKey: "ck_c0833e71a80f25c297095ba39c232857fb4e49a0",
      consumerSecret: "cs_4e5a0cfd2202c69746b4d6b91d13ed3ad71d7e65"
    });

    this.loadMoreProducts(null);

    this.WooCommerce.getAsync("products").then((data)=>{
      console.log(JSON.parse(data.body));
      this.products = JSON.parse(data.body).products;
    }, (err)=>{
      console.log(err);
    });
  }

  ionViewDidLoad(){
    setInterval(()=>{
      if(this.productSlides.getActiveIndex() == this.productSlides.length() -1)
        this.productSlides.slideTo(0);

      this.productSlides.slideNext();
    },3000)
  }

  loadMoreProducts(event){

    if(event == null)
    {
      this.page = 1;
      this.moreProducts = [];
    }
    else
      this.page++;

    this.WooCommerce.getAsync("products?page="+this.page).then((data)=>{
      console.log(JSON.parse(data.body));
      this.moreProducts = this.moreProducts.concat(JSON.parse(data.body).products);

      if(event != null)
      {
        event.complete;
      }

      if(JSON.parse(data.body).products.length < 10)
      {
        event.enable(false);
        this.toastCtrl.create({
          message: "No more products!",
          duration: 3500
        }).present();
      }

    }, (err)=>{
      console.log(err)
    })
  }

  openProductPage(product){
    this.navCtrl.push(ProductDetailsPage, {"product": product});
  }

} 
