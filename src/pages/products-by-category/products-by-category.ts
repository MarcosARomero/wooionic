import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ProductDetailsPage} from '../product-details/product-details';
import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})
export class ProductsByCategoryPage {

  WooCommerce: any;
  products: any[];
  page: number;
  category: any;
  moreProducts: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams) 
  {
    this.page = 1;

    this.category = this.navParams.get("category");

    this.WooCommerce = WC({
      url: "http://localhost/wordpress",
      consumerKey: "ck_c0833e71a80f25c297095ba39c232857fb4e49a0",
      consumerSecret: "cs_4e5a0cfd2202c69746b4d6b91d13ed3ad71d7e65"
    }); 

    this.WooCommerce.getAsync("products?filter[category]="+this.category.slug).then((data)=>{
      console.log(JSON.parse(data.body));
      this.products = JSON.parse(data.body).products;
    }, (err)=>{
      console.log(err);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategoryPage');
  }

  loadMoreProducts(event){

    this.page++;
    console.log("Getting Page: " + this.page);

    this.WooCommerce.getAsync("products?filter[category]="+this.category.slug + "&page=" + this.page).then((data)=>{

      let temp = (JSON.parse(data.body).products);
      
      this.products = this.products.concat(JSON.parse(data.body).products);
      console.log(this.products);

      event.complete();

      if(temp.lenght < 10)
        event.enable(false);
      

    }, (err)=>{
      console.log(err)
    })
  }

  openProductPage(product){
    this.navCtrl.push(ProductDetailsPage, {"product": product});
  }

}
