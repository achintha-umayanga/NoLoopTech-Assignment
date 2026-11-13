"use client";

import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { tasksApi } from "@/api/tasksApi";
import { TaskDashboard } from "@/components/tasks/task-dashboard";
import { CheckSquare } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Task Manager
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage, organize, and track your tasks
            </p>
          </div>
        </div>
      </header>

      {/* Task Dashboard */}
      <ApiProvider api={tasksApi}>
        <TaskDashboard />
      </ApiProvider>
    </main>
  );
}
