import { Component, OnInit } from '@angular/core';
import { ProductService } from './../product.service';
import { Router } from '@angular/router';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {

product: Product = {
  name: '',
  price: null
}


  constructor(private productService: ProductService,
    private router: Router) { }

  ngOnInit(): void {
    
}

createProduct(): void {
 this.productService.create(this.product).subscribe((createdProduct) => {
  if (typeof createdProduct.id === 'string') {
    createdProduct.id = Number(parseInt(createdProduct.id, 16)); 
  }
  if (typeof createdProduct.price === 'string') {
    createdProduct.price = parseFloat(createdProduct.price);
  }
  this.productService.showMessage('Produto criado!')
  this.router.navigate(['/products'])
  }, err => {
      this.productService.showMessage('Erro ao criar o produto');
    });
  }

cancel(): void {
  this.router.navigate(['/products'])
}
}