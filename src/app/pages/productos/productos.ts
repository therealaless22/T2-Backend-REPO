import { Component, OnInit, inject, signal,ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../core/services/producto.service';
import { Producto } from '../../models/producto.model';
import { ProductoForm } from '../product-form/product-form';
@Component({
selector: 'app-productos',
standalone: true,
imports: [CommonModule,ProductoForm],
templateUrl: './productos.html'
})
export class ProductosComponent implements OnInit {
private productoService = inject(ProductoService);
productos = signal<Producto[]>([]);
// Referencia al formulario si está en el mismo HTML
@ViewChild(ProductoForm) formularioProducto!: ProductoForm;
ngOnInit(): void {
this.cargarProductos();
}
cargarProductos(): void {
this.productoService.obtenerProductos()
.subscribe({
next: productos => {
console.log('Datos recibidos1:', productos);
this.productos.set(productos);
//console.log('Datos recibidos2:', productos);
},error: error => {
console.error(error);
}
});
}
// Función que se ejecuta al hacer clic en "Editar"
seleccionarParaEditar(producto: Producto): void {
if (this.formularioProducto) {
this.formularioProducto.editarProducto(producto);
}
}
eliminar(id: number): void {
if (!confirm('¿Eliminar producto?')) {
return;
}
this.productoService.eliminarProducto(id)
.subscribe({
next: () => this.cargarProductos(),
error: error => console.error(error)
});
}
}