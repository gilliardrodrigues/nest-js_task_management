import { IsEnum } from 'class-validator';
import { TaskStatus } from 'src/tasks/enums/task-status.enum';

export class UpdateTaskStatusDTO {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
