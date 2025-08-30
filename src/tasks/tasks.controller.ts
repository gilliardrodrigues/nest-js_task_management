import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { CreateTaskDTO } from '../tasks/dto/create-task.dto';
import { GetTasksFilterDTO } from '../tasks/dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from '../tasks/dto/update-task-status.dto';
import { Task } from '../tasks/task.entity';
import { User } from '../users/user.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDTO: GetTasksFilterDTO, @GetUser() user: User): Promise<Task[]> {
    this.logger.verbose(
      `User ${user.username} retrieving all tasks. Filters: ${JSON.stringify(filterDTO)}`,
    );
    return this.tasksService.getTasks(filterDTO, user);
  }

  @Post()
  createTask(@Body() createTaskDTO: CreateTaskDTO, @GetUser() user: User): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} creating a new task. Data: ${JSON.stringify(createTaskDTO)}.`,
    );
    return this.tasksService.createTask(createTaskDTO, user);
  }

  @Get(':id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch(':id/status')
  updateField(
    @Param('id') id: string,
    @Body() updateTaskStatusDTO: UpdateTaskStatusDTO,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDTO;
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
