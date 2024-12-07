import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from './product.model';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly BASE_URL = `${environment.API}${environment.BASE_URL}`;

  constructor(private snackBar: MatSnackBar, private http: HttpClient) { }
  

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: isError ? ['msg-error'] : ['msg-success']
    });
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.BASE_URL, product).pipe(
    map((obj) => obj),
    catchError((e) => this.errorHandler(e))
    );
  }

  read(): Observable<Product[]> {
    return this.http.get<Product[]>(this.BASE_URL).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  readById(id: number): Observable<Product> {
  const url = `${this.BASE_URL}/${id}`;
  return this.http.get<Product>(url).pipe(
    map((obj) => obj),
    catchError((e) => this.errorHandler(e))
  );
  }

  update(product: Product): Observable<Product> {
    const url = `${this.BASE_URL}/${product.id}`
    return this.http.put<Product>(url, product).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  delete(id: number): Observable<Product> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.delete<Product>(url).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  errorHandler(e: any): Observable<any> {
    // console.error('Erro na requisição:', e);
    this.showMessage('Ocorreu um erro!', true)
    return EMPTY;
  }
}
