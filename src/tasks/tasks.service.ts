import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from 'src/tasks/dto/create-task.dto';
import { GetTasksFilterDTO } from 'src/tasks/dto/get-tasks-filter.dto';
import { TaskStatus } from 'src/tasks/enums/task-status.enum';
import { TasksRepository } from 'src/tasks/repository/tasks.repository';
import { Task } from 'src/tasks/task.entity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  getTasks(filterDTO: GetTasksFilterDTO): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDTO);
  }

  createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDTO);
  }

  async getTaskById(id: string): Promise<Task> {
    const taskFound = await this.tasksRepository.findById(id);

    if (!taskFound) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return taskFound;
  }

  async deleteTask(id: string): Promise<void> {
    const success = await this.tasksRepository.removeById(id);

    if (!success) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatus(id: string, newStatus: TaskStatus): Promise<Task> {
    const taskFound = await this.getTaskById(id);

    taskFound.status = newStatus;
    return this.tasksRepository.saveTask(taskFound);
  }
}
