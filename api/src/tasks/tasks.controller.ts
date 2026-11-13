import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/createTask';

@Controller('tasks')
export class TasksController {
    constructor(
        private readonly tasksService: TasksService
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() DTO: CreateTaskDto) {
        return this.tasksService.create(DTO);
    }
}
