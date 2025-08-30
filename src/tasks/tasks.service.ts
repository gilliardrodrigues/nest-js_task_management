import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from '../tasks/dto/create-task.dto';
import { GetTasksFilterDTO } from '../tasks/dto/get-tasks-filter.dto';
import { TaskStatus } from '../tasks/enums/task-status.enum';
import { TasksRepository } from '../tasks/repository/tasks.repository';
import { Task } from '../tasks/task.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  getTasks(filterDTO: GetTasksFilterDTO, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDTO, user);
  }

  createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDTO, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const taskFound = await this.tasksRepository.findById(id, user);

    if (!taskFound) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return taskFound;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const success = await this.tasksRepository.removeById(id, user);

    if (!success) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatus(id: string, newStatus: TaskStatus, user: User): Promise<Task> {
    const taskFound = await this.getTaskById(id, user);

    taskFound.status = newStatus;
    return this.tasksRepository.saveTask(taskFound);
  }
}
