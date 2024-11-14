
export interface ITask {
    _id: string;
    title: string;
    description: string;
    dueDate: Date;
    priority?: 'low' | 'medium' | 'high';
    status?: 'not started' | 'in progress' | 'completed' | 'delayed';
    assignedTo: string;
    completionPercentage: number;
    author_id: string;
    createdAt: Date;
    updatedAt: Date;
}
