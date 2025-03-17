import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Tarefa } from '../../../Tarefa';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from '../task-item/task-item.component';
import { AddTaskComponent } from '../add-task/add-task.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, TaskItemComponent, AddTaskComponent],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  tarefas: Tarefa[] = []; // Lista de tarefas
  loading: boolean = true; // Indicador de carregamento

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loading = true; // Ativa o estado de carregamento
    this.taskService.initializeTasks().subscribe(
      (tasks) => {
        this.tarefas = tasks; // Atualiza a lista inicial de tarefas
        this.loading = false; // Desativa o carregamento
      },
      (error) => {
        console.error('Erro ao carregar tarefas:', error);
        this.loading = false; // Garante que o carregamento será desativado mesmo em caso de erro
      }
    );

    // Atualiza a lista reativamente a partir do BehaviorSubject
    this.taskService.tasks$.subscribe((tasks) => {
      this.tarefas = tasks;
    });
  }

  deleteTask(tarefa: Tarefa): void {
    this.taskService.deleteTask(tarefa).subscribe();
  }

  toggleConcluido(tarefa: Tarefa): void {
    tarefa.concluido = !tarefa.concluido; // Alterna o status de concluído
    this.taskService.updateTask(tarefa).subscribe();
  }

  addTask(tarefa: Tarefa): void {
    this.taskService.addTask(tarefa).subscribe();
  }
}
