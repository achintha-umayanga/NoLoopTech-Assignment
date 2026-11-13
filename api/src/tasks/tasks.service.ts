import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/createTask';

@Injectable()
export class TasksService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    //create
    async create(DTO: CreateTaskDto) {
        return this.prisma.task.create({
            data: {
                title: DTO.title.trim(),
                description: DTO.description?.trim() || null,
                status: DTO.status || 'TODO',
                dueDate: DTO.dueDate ? new Date(DTO.dueDate) : null,
            },
        });
    }
}
