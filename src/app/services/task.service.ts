import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Tarefa } from '../../Tarefa';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = environment.apiUrl;
  private tasksSubject = new BehaviorSubject<Tarefa[]>([]); // Gerencia o estado reativo
  public tasks$ = this.tasksSubject.asObservable(); // Observable para componentes assinarem

  constructor(private http: HttpClient) {}

  // Inicializa as tarefas carregando os dados do servidor
  initializeTasks(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(this.apiUrl).pipe(
      tap((tasks) => {
        this.tasksSubject.next(tasks); // Atualiza o BehaviorSubject com os dados do servidor
      })
    );
  }

  deleteTask(tarefa: Tarefa): Observable<Tarefa> {
    return this.http.delete<Tarefa>(`${this.apiUrl}/${tarefa._id}`).pipe(
      tap(() => {
        this.refreshTasks(); // Atualiza as tarefas após a exclusão
      })
    );
  }

  updateTask(tarefa: Tarefa): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${this.apiUrl}/${tarefa._id}`, tarefa).pipe(
      tap(() => {
        this.refreshTasks(); // Atualiza as tarefas após a edição
      })
    );
  }

  addTask(tarefa: Tarefa): Observable<Tarefa> {
    const newTarefa = {
      tarefa: tarefa.tarefa,
      categoria: tarefa.categoria,
      concluido: 'false',
    };
    return this.http.post<Tarefa>(`${this.apiUrl}`, newTarefa).pipe(
      tap(() => {
        this.refreshTasks(); // Atualiza as tarefas após a criação
      })
    );
  }

  private refreshTasks(): void {
    this.http.get<Tarefa[]>(this.apiUrl).subscribe((tasks) => {
      this.tasksSubject.next(tasks); // Atualiza o BehaviorSubject
    });
  }
}
