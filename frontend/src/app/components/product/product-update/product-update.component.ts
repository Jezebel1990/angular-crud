import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css']
})
export class ProductUpdateComponent implements OnInit {
  product: Product = { id: 0, name: '', price: 0 }; // Inicialização padrão

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    if (isNaN(id)) {
      this.productService.showMessage('ID inválido!');
      this.router.navigate(['/products']);
      return;
    }
    this.productService.readById(id).subscribe({
      next: (product) => (this.product = product),
      error: () => {
        this.productService.showMessage('Erro ao carregar o produto.');
        this.router.navigate(['/products']);
      },
    });
  }

  updateProduct(): void {
    this.productService.update(this.product).subscribe({
      next: () => {
        this.productService.showMessage('Produto atualizado com sucesso!');
        this.router.navigate(['/products']);
      },
      error: () => {
        this.productService.showMessage('Erro ao atualizar o produto.');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
}
