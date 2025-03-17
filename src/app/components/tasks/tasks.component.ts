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
    this.fetchTasks(); // Busca as tarefas ao carregar o componente
  }

  fetchTasks(): void {
    this.loading = true; // Ativa o estado de carregamento
    this.taskService.getTasks().subscribe(
      (tasks) => {
        this.tarefas = tasks; // Atualiza as tarefas com os dados do servidor
        this.loading = false; // Finaliza o carregamento
      },
      (error) => {
        console.error('Erro ao carregar tarefas:', error);
        this.loading = false; // Finaliza o carregamento em caso de erro
      }
    );
  }

  deleteTask(tarefa: Tarefa): void {
    this.taskService.deleteTask(tarefa).subscribe(() => {
      this.fetchTasks(); // Recarrega os dados após deletar
    });
  }

  toggleConcluido(tarefa: Tarefa): void {
    tarefa.concluido = !tarefa.concluido; // Alterna o status de concluído
    this.taskService.updateTask(tarefa).subscribe(() => {
      this.fetchTasks(); // Recarrega os dados após atualizar
    });
  }

  addTask(tarefa: Tarefa): void {
    this.taskService.addTask(tarefa).subscribe(() => {
      this.fetchTasks(); // Recarrega os dados após adicionar
    });
  }
}
