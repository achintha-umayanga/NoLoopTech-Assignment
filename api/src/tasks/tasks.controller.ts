import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/createTask';
import { UpdateTaskDto } from './dto/updateTask';
import { FilterTasksDto } from './dto/filterTasks';

@Controller('tasks')
export class TasksController {
    constructor(
        private readonly tasksService: TasksService
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    getAllTasks(
        @Query() filter: FilterTasksDto
    ) {
        return this.tasksService.findAll(filter);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    getTask(
        @Param('id') id: string,
    ) {
        return this.tasksService.findOne(id);
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
