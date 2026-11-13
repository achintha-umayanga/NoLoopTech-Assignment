import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/createTask';
import { UpdateTaskDto } from './dto/updateTask';

@Controller('tasks')
export class TasksController {
    constructor(
        private readonly tasksService: TasksService
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    findAllTasks() {
        return this.tasksService.findAll();
    }
    
    @Post()
    @HttpCode(HttpStatus.CREATED)
    createTask(
        @Body() DTO: CreateTaskDto,
    ) {
        return this.tasksService.create(DTO);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    updateTask(
        @Param('id') id: string,
        @Body() DTO: UpdateTaskDto,
    ) {
        return this.tasksService.update(id, DTO)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    deleteTask(
        @Param('id') id: string,
    ) {
        return this.tasksService.delete(id)
    }

}
