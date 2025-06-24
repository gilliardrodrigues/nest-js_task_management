import { Injectable } from '@nestjs/common';
import { CreateTaskDTO } from 'src/tasks/dto/create-task.dto';
import { GetTasksFilterDTO } from 'src/tasks/dto/get-tasks-filter.dto';
import { TaskStatus } from 'src/tasks/enums/task-status.enum';
import { Task } from 'src/tasks/task.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TasksRepository {
  private readonly repository: Repository<Task>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Task);
  }

  async getTasks(filterDTO: GetTasksFilterDTO): Promise<Task[]> {
    const { status, search } = filterDTO;
    const query = this.repository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        {
          search: `%${search}%`,
        },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    const { title, description } = createTaskDTO;

    const newTask = this.repository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.repository.save(newTask);
    return newTask;
  }

  async findById(id: string): Promise<Task | null> {
    const taskFound = await this.repository.findOneBy({ id });

    return taskFound;
  }

  async removeById(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);

    return (result.affected ?? 0) > 0;
  }

  async saveTask(task: Task): Promise<Task> {
    const savedTask = await this.repository.save(task);

    return savedTask;
  }
}
