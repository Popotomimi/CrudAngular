// task.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Tarefa } from '../../Tarefa';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = "https://backendangular-wbbi.onrender.com/notes";
  private tasksSubject = new BehaviorSubject<Tarefa[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(this.apiUrl).pipe(
      tap(tasks => this.tasksSubject.next(tasks))
    );
  }

  deleteTask(tarefa: Tarefa): Observable<Tarefa> {
    return this.http.delete<Tarefa>(`${this.apiUrl}/${tarefa._id}`).pipe(
      tap(() => this.refreshTasks())
    );
  }

  updateTask(tarefa: Tarefa): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${this.apiUrl}/${tarefa._id}`, tarefa).pipe(
      tap(() => this.refreshTasks())
    );
  }

  addTask(tarefa: Tarefa): Observable<Tarefa> {
    const newTarefa = {
      tarefa: tarefa.tarefa,
      categoria: tarefa.categoria,
      concluido: "false"
    };
    return this.http.post<Tarefa>(`${this.apiUrl}`, newTarefa).pipe(
      tap(() => this.refreshTasks())
    );
  }

  private refreshTasks() {
    this.getTasks().subscribe();
  }
}
