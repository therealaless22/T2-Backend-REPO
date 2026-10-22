import { Component, signal, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../core/services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductoForm {
  private productoService = inject(ProductoService);
  productoGuardado = output<void>();

  producto = signal<Producto>({
    precio: 0.01,
    stock: 0,
    descuento: 0,
    categoria: '',
    nombre: ''
  });

  editarProducto(productoSeleccionado: Producto) {
    this.producto.set({ ...productoSeleccionado });
  }

  guardar() {
    const datosProducto = this.producto();
    const descuento = datosProducto.descuento ?? 0;

    if (datosProducto.precio <= 0 || datosProducto.stock < 0 || descuento < 0 || descuento > 100) {
      alert('Por favor verifique que el precio sea mayor a 0, el stock no sea negativo y que el descuento este en un rango de 0 a 100.');
      return;
    }

    if (datosProducto.id) {
      this.productoService.actualizarProducto(datosProducto.id, datosProducto)
        .subscribe({
          next: () => {
            this.productoGuardado.emit();
            this.limpiarFormulario();
          },
          error: (error) => console.error('Error al actualizar el producto', error)
        });
    } else {
      this.productoService.crearProducto(datosProducto)
        .subscribe({
          next: () => {
            this.productoGuardado.emit();
            this.limpiarFormulario();
          },
          error: (error) => console.error('Error al crear el producto', error)
        });
    }
  }

  limpiarFormulario() {
    this.producto.set({
      precio: 0.01,
      stock: 0,
      descuento: 0,
      categoria: '',
      nombre: ''
    });
  }
}