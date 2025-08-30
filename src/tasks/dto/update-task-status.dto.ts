import { IsEnum } from 'class-validator';
import { TaskStatus } from '../../tasks/enums/task-status.enum';

export class UpdateTaskStatusDTO {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
