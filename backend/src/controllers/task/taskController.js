import asyncHandler from 'express-async-handler';
import TaskModel from '../../models/tasks/TaskModel.js';

export const createTask = asyncHandler(async (req, res) => {
    try {
        const { title, description, dueDate, priority, status } = req.body;

        if(!title || title.trim() === "") {
            res.status(400).json({message: 'Title is required'});
        }
        
        if(!description || description.trim() === "") {
            res.status(400).json({message: 'Description is required'});
        }

        const task = new TaskModel({
            title,
            description,
            dueDate,
            priority,
            status,
            user: req.user._id,
        });

        await task.save();

        res.status(201).json(task);
        
    } catch (error) {
        console.log("Error creating task: ", error.message);
        res.status(500).json({ message: error.message });
    }
});

export const getTasks = asyncHandler(async (req, res) => {
    try {
        const UserId = req.user._id;

        if(!UserId) {
            res.status(400).json({message: 'User not found'});
        }

        const tasks = await TaskModel.find({ user: UserId });

        res.status(200).json(
            {
                length: tasks.length,
                tasks,
            }
        );
    } catch (error) {
        console.log("Error getting tasks: ", error.message);
        res.status(500).json({ message: error.message });
    }
});

export const getTask = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        const { id } = req.params;

        if(!id) {
            res.status(400).json({message: "Please provide a task id"});
        }

        const Task = await TaskModel.findById(id);

        if (!Task) {
            res.status(404).json({ message: "Task not found" });
        }

        if(!Task.user.equals(userId)) {
            res.status(401).json({ message: "You are not authorized to view this task" });
        }

        res.status(200).json(Task);
    } catch (error) {
        console.log("Error getting task: ", error.message);
        res.status(500).json({ message: error.message });
    }
});

export const updateTask = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        const { id } = req.params;

        const { title, description, dueDate, priority, status, completed } = req.body;

        if(!id) {
            res.status(400).json({message: "Please provide a task id"});
        }

        const Task = await TaskModel.findById(id);

        if (!Task) {
            res.status(404).json({ message: "Task not found" });
        }

        if(!Task.user.equals(userId)) {
            res.status(401).json({ message: "You are not authorized to update this task" });
        }

        // update the task with the new data if provided or keep the old data
        Task.title = title || Task.title;
        Task.description = description || Task.description;
        Task.dueDate = dueDate || Task.dueDate;
        Task.priority = priority || Task.priority;
        Task.status = status || Task.status;
        Task.completed = completed || Task.completed;

        await Task.save();

        return res.status(200).json(Task);
    } catch (error) {
        console.log("Error updating task: ", error.message);
        res.status(500).json({ message: error.message });
    }
});

export const deleteTask = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        const { id } = req.params;

        const Task = await TaskModel.findById(id);

        if (!Task) {
            res.status(404).json({ message: "Task not found" });
        }

        if(!Task.user.equals(userId)) {
            res.status(401).json({ message: "You are not authorized to delete this task" });
        }

        await TaskModel.findByIdAndDelete(id);

        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.log("Error deleting task: ", error.message);
        res.status(500).json({ message: error.message });
    }
});