import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(
    private dataService: DataService
  ) { }

  modifyProduct(productId, product) {
    return this.dataService.update('productos', productId, product);
  }
  saveProduct(producto){
    console.log("guardo producto", producto)
    return this.dataService.setData('productos', `${producto.nombre}_${producto.descripcion}`.toLowerCase(), producto);
    
  }

  getAllProductos(collection){
    console.log(collection)
    return this.dataService.getAll(collection); 
  }

  updateProduct(collection: string, id: string, object: any) {
    return this.dataService.update(collection, id, object);
  }

  getProduct(productId) {
    return this.dataService.getOneProducto('productos', productId);
  }

  getProductById(productId){
    return this.dataService.getOneProducto('productos', productId);
  }

  deleteProduct(productId){
    this.dataService.deleteDocument('productos', productId);
  }


}
