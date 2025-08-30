import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from '../tasks/enums/task-status.enum';
import { TasksService } from '../tasks/tasks.service';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './repository/tasks.repository';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findById: jest.fn(),
});

const mockUser = {
  id: 'someId',
  username: 'Gilliard',
  password: 'somePassword',
  tasks: [],
};

const mockTask = {
  id: '5f96b527-7a4f-4b9d-8974-ec9b6e3fbd65',
  title: 'Teach my fish how to swim',
  description: 'Apparently floating in circles doesn’t count as Olympic training.',
  status: 'OPEN',
};

describe('TaskService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    // Initialize a NestJS module with tasksService and tasksRepository
    const module = await Test.createTestingModule({
      providers: [TasksService, { provide: TasksRepository, useFactory: mockTasksRepository }],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      expect(tasksRepository.getTasks).not.toHaveBeenCalled();

      const mockResult = [mockTask];
      tasksRepository.getTasks.mockResolvedValue(mockResult);

      const result = await tasksService.getTasks({}, mockUser);
      expect(tasksRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('throws an error if TasksRepository.getTasks fails', async () => {
      tasksRepository.getTasks.mockRejectedValue(
        new InternalServerErrorException('Database error'),
      );
      await expect(tasksService.getTasks({}, mockUser)).rejects.toThrow('Database error');
    });

    it('calls TasksRepository.getTasks with correct filters and user', async () => {
      const filters: GetTasksFilterDTO = { status: TaskStatus.OPEN, search: 'fish' };

      await tasksService.getTasks(filters, mockUser);

      expect(tasksRepository.getTasks).toHaveBeenCalledWith(filters, mockUser);
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findOneBy and returns the result', async () => {
      tasksRepository.findById.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(mockTask.id, mockUser);

      expect(tasksRepository.findById).toHaveBeenCalled();
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findOneBy and returns an error', async () => {
      const id = '00000000-0000-0000-0000-000000000000';
      tasksRepository.findById.mockResolvedValue(null);

      try {
        await tasksService.getTaskById(id, mockUser);
        fail('Should have thrown NotFoundException');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toContain(`Task with ID "${id}" not found`);
      }
    });
  });
});
