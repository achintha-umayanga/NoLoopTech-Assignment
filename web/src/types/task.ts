export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
}

export interface TaskFilters {
  status?: TaskStatus | 'ALL';
  sortBy?: 'dueDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

