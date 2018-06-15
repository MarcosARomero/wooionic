import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import {ProductsByCategoryPage} from '../products-by-category/products-by-category';

import * as WC from 'woocommerce-api';


@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  homePage: any;
  WooCommerce: any;
  categories: any[];
  @ViewChild('content') childNavCtrl: NavController;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.homePage = HomePage;
    this.categories = [];

    this.WooCommerce = WC({
      url: "http://localhost/wordpress",
      consumerKey: "ck_c0833e71a80f25c297095ba39c232857fb4e49a0",
      consumerSecret: "cs_4e5a0cfd2202c69746b4d6b91d13ed3ad71d7e65"
    });

    this.WooCommerce.getAsync("products/categories").then((data)=>{

      console.log(JSON.parse(data.body).product_categories);

      let temp: any[] = JSON.parse(data.body).product_categories;

      for(let i = 0; i < temp.length; i++)
      {
        if(temp[i].parent == 0)
        {
          if(temp[i].slug == "tshirts")
            temp[i].icon = "shirt";
  
          if(temp[i].slug == "accessories")
            temp[i].icon = "shirt"; 

          if(temp[i].slug == "hoodies")
            temp[i].icon = "shirt"; 

          if(temp[i].slug == "uncategorized")
            temp[i].icon = "shirt"; 

          this.categories.push(temp[i]);
        }
      }

    }, (err)=>{
      console.log(err);
    })

  }

  openCategoryPage(category){
    this.childNavCtrl.setRoot(ProductsByCategoryPage, {"category":category});
  }


}
