import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/createTask';
import { UpdateTaskDto } from './dto/updateTask';

@Injectable()
export class TasksService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async findOne(id: string) {
        const task = await this.prisma.task.findUnique({
            where: { id },
        });

        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return task;
    }

    //create
    async create(DTO: CreateTaskDto) {
        return this.prisma.task.create({
            data: {
                title: DTO.title.trim(),
                description: DTO.description?.trim() || null,
                status: DTO.status || 'TODO',
                dueDate: DTO.dueDate ? new Date(DTO.dueDate) : null,
            }
        });
    }

    async update(id: string, DTO: UpdateTaskDto) {
        await this.findOne(id);

        const data: any = {};
        if (DTO.title !== undefined) {
            data.title = DTO.title.trim();
        }
        if (DTO.description !== undefined) {
            data.description = DTO.description?.trim() || null;
        }
        if (DTO.status !== undefined) {
            data.status = DTO.status;
        }
        if (DTO.dueDate !== undefined) {
            data.dueDate = DTO.dueDate ? new Date(DTO.dueDate) : null;
        }

        return this.prisma.task.update({
            where: {id},
            data
        })
    }
}
