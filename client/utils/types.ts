interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  completed: boolean;
  dueDate: string;
  prioriy: string; // typo dari be nya
  createdAt: string;
  updatedAt: string;
}

export type { Task };
