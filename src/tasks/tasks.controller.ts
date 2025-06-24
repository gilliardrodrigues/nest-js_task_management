import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { CreateTaskDTO } from 'src/tasks/dto/create-task.dto';
import { GetTasksFilterDTO } from 'src/tasks/dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from 'src/tasks/dto/update-task-status.dto';
import { Task } from 'src/tasks/task.entity';
import { User } from 'src/users/user.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDTO: GetTasksFilterDTO, @GetUser() user: User): Promise<Task[]> {
    return this.tasksService.getTasks(filterDTO, user);
  }

  @Post()
  createTask(@Body() createTaskDTO: CreateTaskDTO, @GetUser() user: User): Promise<Task> {
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
