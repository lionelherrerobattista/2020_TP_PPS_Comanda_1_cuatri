import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(
    private dataService: DataService
  ) { }

  saveProduct(product){
    return this.dataService.add('productos', product);
  }

  getAllProducts(collection){
    return this.dataService.getAll(collection);
  }

  updateProduct(collection: string, id: string, object: any) {
    return this.dataService.update(collection, id, object);
  }
  getProductById(productId){
    return this.dataService.getOne('productos', productId);
  }

  deleteProduct(productId){
    this.dataService.deleteDocument('productos', productId);
  }


}
