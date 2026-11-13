import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TaskStatus } from './createTask';

export class CreateTaskDto {
    @IsOptional()
    @IsString({ message: 'Title must be a string'})
    @IsNotEmpty({ message: 'Title is required'})
    @MaxLength(100, { message: 'Titile must not exceed 100 characters'})
    title?: string;

    @IsOptional()
    @IsString({ message: 'Description must be a string'})
    description?: string;

    @IsOptional()
    @IsEnum(TaskStatus, { message: 'Status must be TODO, IN_PROGRESS or DONE'})
    status?: TaskStatus;

    @IsOptional()
    @IsISO8601({}, { message: 'dueDate must be a valid date string' })
    dueDate?: string;
}