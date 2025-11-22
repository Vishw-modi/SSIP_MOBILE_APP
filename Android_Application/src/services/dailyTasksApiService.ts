import { BACKEND_URL } from "@/chat/config";
import axios from "axios";

// Types
export interface DailyQuestion {
  id: string;
  question: string;
  completed: boolean;
  category: "health" | "productivity" | "mindfulness" | "learning";
  completed_at?: string;
}

export interface CustomTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  notify_enabled: boolean;
  priority: "low" | "medium" | "high";
  created_at: string;
  completed_at?: string;
  tags?: string[];
}

export interface DayData {
  id: string;
  date: string;
  daily_questions: DailyQuestion[];
  custom_tasks: CustomTask[];
  completion_percentage: number;
  mood: number;
}

// API calls
export const getDailyTasks = async (
  clerkUserId: string,
  date: string
): Promise<DayData | null> => {
  try {
    const response = await axios.get<{ day: DayData }>(
      `${BACKEND_URL}/api/daily-tasks/${clerkUserId}/${date}`
    );
    return response.data.day;
  } catch (error) {
    console.error("Error fetching daily tasks:", error);
    return null;
  }
};

export const updateQuestion = async (
  questionId: string,
  completed: boolean
) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/api/daily-tasks/question/${questionId}`,
      { completed }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
};

export const updateCustomTask = async (taskId: string, completed: boolean) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/api/daily-tasks/task/${taskId}`,
      { completed }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    const response = await axios.delete(
      `${BACKEND_URL}/api/daily-tasks/task/${taskId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const addTask = async (task: {
  day_id: string;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high";
  notify_enabled: boolean;
  tags: string[] | null;
}) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/daily-tasks/task`,
      task
    );
    return { task: response.data.task, error: null };
  } catch (error) {
    console.error("Error adding task:", error);
    return { task: null, error };
  }
};

export const updateMood = async (dayId: string, mood: number) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/api/daily-tasks/mood/${dayId}`,
      { mood }
    );
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Error updating mood:", error);
    return { data: null, error };
  }
};

export const updateCompletion = async (
  dayId: string,
  completion_percentage: number
) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/api/daily-tasks/completion/${dayId}`,
      { completion_percentage }
    );
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Error updating completion:", error);
    return { data: null, error };
  }
};
