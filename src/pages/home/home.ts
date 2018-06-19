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
      url: "http://marcosromero.me",
      consumerKey: "ck_4097cf951f70534c48ff238a1ce57e84fcd37fb6",
      consumerSecret: "cs_a65579f29bc27a84d9c9e5ac2d43cfddf647f3f7"
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
