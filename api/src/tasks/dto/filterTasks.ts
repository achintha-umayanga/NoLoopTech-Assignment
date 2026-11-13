import { IsEnum, IsIn, IsOptional } from 'class-validator';
import { TaskStatus } from './createTask';

export class FilterTasksDto {
    @IsOptional()
    @IsEnum(TaskStatus, {
        message: 'status filter must be TODO, IN_PROGRESS, or DONE',
    })
    status?: TaskStatus;

    @IsOptional()
    @IsIn(['dueDate', 'createdAt'], {
        message: 'sortBy must be dueDate or createdAt',
    })
    sortBy?: 'dueDate' | 'createdAt';

    @IsOptional()
    @IsIn(['asc', 'desc'], {
        message: 'sortOrder must be asc or desc',
    })
    sortOrder?: 'asc' | 'desc';
}
