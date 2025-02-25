import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tarefa } from '../../Tarefa';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = "https://backendangular-wbbi.onrender.com/notes"

  constructor(private http: HttpClient) { }

  getTasks() : Observable<Tarefa[]>{
    return this.http.get<Tarefa[]>(this.apiUrl);
  }

  deleteTask(tarefa: Tarefa): Observable<Tarefa>{
    return this.http.delete<Tarefa>(`${this.apiUrl}/${tarefa._id}`);
  }

  updateTask(tarefa: Tarefa) : Observable<Tarefa>{
    return this.http.put<Tarefa>(`${this.apiUrl}/${tarefa._id}`, tarefa);
  }

  addTask(tarefa: Tarefa) : Observable<Tarefa> {
    const newTarefa = {
      tarefa: tarefa.tarefa,
      categoria: tarefa.categoria,
      concluido: "false"
    };
    return this.http.post<Tarefa>(`${this.apiUrl}`, newTarefa);
  }  
}