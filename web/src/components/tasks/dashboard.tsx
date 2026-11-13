"use client";

import React, { useEffect, useState } from "react";
import {
  Task,
  TaskStatus,
  TaskFilters,
  CreateTaskInput,
  UpdateTaskInput,
} from "@/types/task";
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "@/api/tasksApi";
import { TaskDeleteDialog } from "./deleteModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, isOverdue } from "@/lib/utils";
import { toast } from "sonner";
import {
  CheckCircle2,
  Clock,
  Circle,
  ListTodo,
  AlertTriangle,
  RefreshCw,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  Inbox,
  Loader2,
  Filter,
  ArrowUpDown,
} from "lucide-react";

function TaskStatusBadge({ status }: { status: TaskStatus }) {
  switch (status) {
    case "TODO":
      return (
        <Badge variant="todo" className="gap-1.5 font-medium">
          <Circle className="h-3 w-3 text-slate-500 fill-slate-500/20" />
          To Do
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge variant="in_progress" className="gap-1.5 font-medium">
          <Clock className="h-3 w-3 text-blue-600 animate-spin-slow" />
          In Progress
        </Badge>
      );
    case "DONE":
      return (
        <Badge variant="done" className="gap-1.5 font-medium">
          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          Done
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

interface TaskTableProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function TaskTable({ tasks, isLoading, onEdit, onDelete }: TaskTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Title & Description</TableHead>
              <TableHead className="w-[18%]">Status</TableHead>
              <TableHead className="w-[20%]">Due Date</TableHead>
              <TableHead className="w-[18%]">Created</TableHead>
              <TableHead className="w-[14%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(4)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-3 w-64" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center bg-card/50">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Inbox className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-base font-semibold">No tasks found</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">
          There are no tasks yet. Create a new task to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-[32%] font-semibold">
              Title & Description
            </TableHead>
            <TableHead className="w-[18%] font-semibold">Status</TableHead>
            <TableHead className="w-[20%] font-semibold">Due Date</TableHead>
            <TableHead className="w-[16%] font-semibold">Created</TableHead>
            <TableHead className="w-[14%] text-right font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => {
            const overdue = isOverdue(task.dueDate) && task.status !== "DONE";

            return (
              <TableRow
                key={task.id}
                className="transition-colors hover:bg-muted/50"
              >
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground leading-snug">
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <TaskStatusBadge status={task.status} />
                </TableCell>

                <TableCell>
                  {task.dueDate ? (
                    <div
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        overdue
                          ? "text-red-600 dark:text-red-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {overdue ? (
                        <AlertCircle className="h-3.5 w-3.5" />
                      ) : (
                        <Calendar className="h-3.5 w-3.5" />
                      )}
                      <span>{formatDate(task.dueDate)}</span>
                      {overdue && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-1 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300">
                          Overdue
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground/60">—</span>
                  )}
                </TableCell>

                <TableCell>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(task.createdAt)}
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(task)}
                      title="Edit Task"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(task)}
                      title="Delete Task"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskToEdit?: Task | null;
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => Promise<void>;
}

function TaskDialog({
  open,
  onOpenChange,
  taskToEdit,
  onSubmit,
}: TaskDialogProps) {
  const isEditing = !!taskToEdit;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [dueDate, setDueDate] = useState("");
  const [titleError, setTitleError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setStatus(taskToEdit.status || "TODO");
      setDueDate(
        taskToEdit.dueDate
          ? new Date(taskToEdit.dueDate).toISOString().split("T")[0]
          : ""
      );
    } else {
      setTitle("");
      setDescription("");
      setStatus("TODO");
      setDueDate("");
    }
    setTitleError("");
  }, [taskToEdit, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError("Title is required");
      return;
    }

    if (title.trim().length > 100) {
      setTitleError("Title must not exceed 100 characters");
      return;
    }

    setTitleError("");
    setIsSubmitting(true);

    try {
      const payload: CreateTaskInput = {
        title: title.trim(),
        description: description.trim() ? description.trim() : undefined,
        status,
        dueDate: dueDate
          ? new Date(`${dueDate}T23:59:59.000Z`).toISOString()
          : undefined,
      };

      await onSubmit(payload);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Task" : "Create New Task"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the details of your existing task."
                : "Fill in the details below to add a new task."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title" className="flex items-center gap-1">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="task-title"
                placeholder="e.g. Implement authentication"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (titleError) setTitleError("");
                }}
                disabled={isSubmitting}
                className={
                  titleError
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {titleError && (
                <p className="text-xs text-destructive font-medium">
                  {titleError}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                placeholder="Optional details or acceptance criteria..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(val) => setStatus(val as TaskStatus)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="task-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">To Do</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="DONE">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="task-due-date">Due Date</Label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface TaskToolbarProps {
  filters: TaskFilters;
  onFilterChange: (filters: TaskFilters) => void;
  onOpenCreate: () => void;
}

function TaskToolbar({
  filters,
  onFilterChange,
  onOpenCreate,
}: TaskToolbarProps) {
  const currentStatus = filters.status || "ALL";
  const currentSort =
    filters.sortBy === "dueDate"
      ? filters.sortOrder === "asc"
        ? "due-asc"
        : "due-desc"
      : "default";

  const handleStatusChange = (val: string) => {
    onFilterChange({
      ...filters,
      status: val as TaskStatus | "ALL",
    });
  };

  const handleSortChange = (val: string) => {
    if (val === "due-asc") {
      onFilterChange({
        ...filters,
        sortBy: "dueDate",
        sortOrder: "asc",
      });
    } else if (val === "due-desc") {
      onFilterChange({
        ...filters,
        sortBy: "dueDate",
        sortOrder: "desc",
      });
    } else {
      onFilterChange({
        ...filters,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground hidden sm:inline" />
          <Select value={currentStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-[160px] h-9">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="TODO">To Do</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground hidden sm:inline" />
          <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-[190px] h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Sort by: Default (Newest)</SelectItem>
              <SelectItem value="due-asc">Due Date: Earliest First</SelectItem>
              <SelectItem value="due-desc">Due Date: Latest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={onOpenCreate} className="gap-1.5 self-end sm:self-auto shadow-sm">
        New Task
      </Button>
    </div>
  );
}

export function TaskDashboard() {
  // Filters and sorting
  const [filters, setFilters] = useState<TaskFilters>({
    status: "ALL",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // RTK Query hooks
  const {
    data: tasks = [],
    isLoading,
    isFetching,
    isError,
    error: queryError,
    refetch,
  } = useGetTasksQuery(filters);

  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // Modal dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Task metrics
  const totalCount = tasks.length;
  const todoCount = tasks.filter((t) => t.status === "TODO").length;
  const inProgressCount = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const doneCount = tasks.filter((t) => t.status === "DONE").length;

  const handleCreateOrUpdate = async (
    data: CreateTaskInput | UpdateTaskInput
  ) => {
    try {
      if (taskToEdit) {
        const updated = await updateTask({ id: taskToEdit.id, data }).unwrap();
        toast.success("Task updated successfully", {
          description: `"${updated.title}" has been updated.`,
        });
      } else {
        const created = await createTask(data as CreateTaskInput).unwrap();
        toast.success("Task created successfully", {
          description: `"${created.title}" has been added to your board.`,
        });
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.data?.error || "Error saving task");
      throw err;
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId).unwrap();
      toast.success("Task deleted successfully", {
        description: "The task was permanently removed.",
      });
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.error || "Error deleting task"
      );
      throw err;
    }
  };

  const openCreateDialog = () => {
    setTaskToEdit(null);
    setDialogOpen(true);
  };

  const openEditDialog = (task: Task) => {
    setTaskToEdit(task);
    setDialogOpen(true);
  };

  const openDeleteDialog = (task: Task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top metrics summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Total Tasks
            </p>
            <h3 className="text-2xl font-bold mt-1">{totalCount}</h3>
          </div>
          <div className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            <ListTodo className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">To Do</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-700 dark:text-slate-300">
              {todoCount}
            </h3>
          </div>
          <div className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            <Circle className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              In Progress
            </p>
            <h3 className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
              {inProgressCount}
            </h3>
          </div>
          <div className="p-2.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Completed
            </p>
            <h3 className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
              {doneCount}
            </h3>
          </div>
          <div className="p-2.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main card */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <TaskToolbar
          filters={filters}
          onFilterChange={setFilters}
          onOpenCreate={openCreateDialog}
        />

        {isError && (
          <div className="my-4 flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>
                {(queryError as any)?.data?.message ||
                  (queryError as any)?.data?.error ||
                  "Failed to connect to the API. Ensure the backend server is running."}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-1.5 border-destructive/40 hover:bg-destructive/10 text-destructive text-xs"
            >
              <RefreshCw
                className={`h-3 w-3 ${isFetching ? "animate-spin" : ""}`}
              />
              Retry
            </Button>
          </div>
        )}

        <TaskTable
          tasks={tasks}
          isLoading={isLoading}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
        />
      </div>

      {/* Modals */}
      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        taskToEdit={taskToEdit}
        onSubmit={handleCreateOrUpdate}
      />

      <TaskDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        task={taskToDelete}
        onConfirm={handleDelete}
      />
    </div>
  );
}
