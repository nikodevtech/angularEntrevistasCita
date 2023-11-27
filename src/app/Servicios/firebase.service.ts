import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

/**
 * Servicio para interactuar con la base de datos
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
 
  constructor(private firestore: AngularFirestore) { }

  /**
   * Metodo para insertar un nuevo elemento en una colección determinada
   * @param coleccion de la base de datos en la que se va a insertar
   * @param data elemento a insertar
   * @returns una promesa
   */
  insertar(coleccion: string, data: any): Promise<any> {
    return this.firestore.collection(coleccion).add(data);
  }

  /**
   * Obtiene todos los elementos de una colección determinada
   * @param coleccion de la base de datos que se va a obtener
   * @returns un observable con todos los elementos de la colección 
   */
  obtenerTodos(coleccion: string): Observable<any> {
    return this.firestore.collection(coleccion).snapshotChanges();
  }

  /**
   * Elimina un elemento de una colección determinada
   * @param coleccion de la base de datos que se va a eliminar
   * @param id id del elemento que se va eliminar
   * @returns una promesa
   */
  eliminar(coleccion: string, id: string): Promise<any> {
    return this.firestore.collection(coleccion).doc(id).delete();
  }

  /**
   * Obtiene un elemento de una colección
   * @param coleccion dela base de datos que en la que se va a buscar
   * @param id del elemento que se va a obtener
   * @returns un observable con el elemento
   */
  obtenerPorId(coleccion: string, id: string): Observable<any> {
    return this.firestore.collection(coleccion).doc(id).snapshotChanges();
  }

  /**
   * Modifica un elemento de una colección determinada
   * @param coleccion de la base de datos que se va a modificar
   * @param id del elemento que se va a modificar
   * @param data elemento modificado para ser actualizado
   * @returns una promesa
   */
  actualizar(coleccion: string, id: string, data: any): Promise<any> {
    return this.firestore.collection(coleccion).doc(id).update(data);
  }

  /**
   * Obtiene un elemento de una colección que cumpla con un filtro
   * @param coleccion de la base de datos que se va a buscar
   * @param campo de la colección que se va a filtrar
   * @param valor que se va a filtrar
   * @returns 
   */
  obtenerPorFiltro(coleccion: string, campo: string, valor: any): Observable<any[]> {
    return this.firestore.collection(coleccion, ref => ref.where(campo, "==", valor)).snapshotChanges();
  }
}
