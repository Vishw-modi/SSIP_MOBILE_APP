import express from "express";
import supabase from "../supabaseClient.js";

const router = express.Router();

/**
 * GET /api/daily-tasks/:clerkUserId/:date
 * Get or create a day entry with daily questions and custom tasks
 */
router.get("/daily-tasks/:clerkUserId/:date", async (req, res) => {
  try {
    console.log("request arrived");

    const { clerkUserId, date } = req.params;
    console.log(`📅 Fetching daily tasks for ${clerkUserId} on ${date}`);

    if (!clerkUserId || !date) {
      return res.status(400).json({ error: "Missing clerkUserId or date" });
    }

    // 🔍 Step 1: Get the user record using clerkUserId
    const { data: userRecord, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerkuserid", clerkUserId)
      .single();

    if (userError || !userRecord) {
      console.log("❌ User not found:", userError);
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userRecord.id;

    // 📊 Step 2: Check if day already exists
    const { data: existingDay, error: dayFetchError } = await supabase
      .from("day_data")
      .select("*, daily_questions(*), custom_tasks(*)")
      .eq("user_id", userId)
      .eq("date", date)
      .maybeSingle();

    if (dayFetchError) {
      console.log("❌ Error fetching day:", dayFetchError);
      throw dayFetchError;
    }

    // If day exists, return it
    if (existingDay) {
      console.log(`✅ Day found: ${date}`);
      return res.status(200).json({
        message: "Day data fetched successfully",
        day: existingDay,
      });
    }

    // 📝 Step 3: Create new day entry
    const { data: newDay, error: dayErr } = await supabase
      .from("day_data")
      .insert({
        user_id: userId,
        date,
        mood: 3,
        completion_percentage: 0,
      })
      .select()
      .single();

    if (dayErr) {
      console.log("❌ Error creating new day:", dayErr);
      throw dayErr;
    }

    // ❓ Step 4: Insert default daily questions
    const defaultQuestions = [
      { question: "Did you drink 8 glasses of water?", category: "health" },
      {
        question: "Did you exercise for at least 30 minutes?",
        category: "health",
      },
      {
        question: "Did you complete your most important task?",
        category: "productivity",
      },
      {
        question: "Did you practice gratitude today?",
        category: "mindfulness",
      },
      { question: "Did you learn something new?", category: "learning" },
    ];

    const { error: questionsErr } = await supabase
      .from("daily_questions")
      .insert(
        defaultQuestions.map((q) => ({
          day_id: newDay.id,
          question: q.question,
          category: q.category,
          completed: false,
        }))
      );

    if (questionsErr) {
      console.log("⚠️ Error inserting questions:", questionsErr);
    }

    // 📋 Step 5: Get the full day data with relations
    const { data: finalDay, error: finalErr } = await supabase
      .from("day_data")
      .select("*, daily_questions(*), custom_tasks(*)")
      .eq("id", newDay.id)
      .single();

    if (finalErr) {
      console.log("❌ Error fetching final day:", finalErr);
      throw finalErr;
    }

    console.log(`✅ New day created: ${date}`);
    return res.status(201).json({
      message: "Day created successfully",
      day: finalDay,
    });
  } catch (error) {
    console.error("❌ Error in daily-tasks route:", error);
    res.status(500).json({
      error: "Failed to fetch or create day",
      details: error.message,
    });
  }
});

/**
 * PUT /api/daily-tasks/question/:questionId
 * Update daily question completion
 */
router.put("/daily-tasks/question/:questionId", async (req, res) => {
  try {
    console.log("request arrived for questions");
    const { questionId } = req.params;
    const { completed } = req.body;

    if (!questionId || typeof completed !== "boolean") {
      return res.status(400).json({ error: "Missing questionId or completed" });
    }

    const { data, error } = await supabase
      .from("daily_questions")
      .update({
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      })
      .eq("id", questionId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ message: "Question updated", question: data });
  } catch (error) {
    console.error("❌ Error updating question:", error);
    res.status(500).json({
      error: "Failed to update question",
      details: error.message,
    });
  }
});

/**
 * PUT /api/daily-tasks/task/:taskId
 * Update custom task completion
 */
router.put("/daily-tasks/task/:taskId", async (req, res) => {
  try {
    console.log("request arrived for the tasks");
    const { taskId } = req.params;
    const { completed } = req.body;

    if (!taskId || typeof completed !== "boolean") {
      return res.status(400).json({ error: "Missing taskId or completed" });
    }

    const { data, error } = await supabase
      .from("custom_tasks")
      .update({
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      })
      .eq("id", taskId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ message: "Task updated", task: data });
  } catch (error) {
    console.error("❌ Error updating task:", error);
    res.status(500).json({
      error: "Failed to update task",
      details: error.message,
    });
  }
});

/**
 * DELETE /api/daily-tasks/task/:taskId
 * Delete a custom task
 */
router.delete("/daily-tasks/task/:taskId", async (req, res) => {
  try {
    console.log("request arrived for delete task");
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({ error: "Missing taskId" });
    }

    const { error } = await supabase
      .from("custom_tasks")
      .delete()
      .eq("id", taskId);

    if (error) throw error;

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting task:", error);
    res.status(500).json({
      error: "Failed to delete task",
      details: error.message,
    });
  }
});

/**
 * POST /api/daily-tasks/task
 * Add a new custom task
 */
router.post("/daily-tasks/task", async (req, res) => {
  try {
    console.log("request arrived for new task creation");
    const { day_id, title, description, priority, notify_enabled, tags } =
      req.body;

    if (!day_id || !title) {
      return res.status(400).json({ error: "Missing day_id or title" });
    }

    const { data, error } = await supabase
      .from("custom_tasks")
      .insert({
        day_id,
        title,
        description: description || null,
        priority: priority || "medium",
        notify_enabled: notify_enabled || false,
        tags: tags || null,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Task created", task: data });
  } catch (error) {
    console.error("❌ Error creating task:", error);
    res.status(500).json({
      error: "Failed to create task",
      details: error.message,
    });
  }
});

/**
 * PUT /api/daily-tasks/mood/:dayId
 * Update mood for a day
 */
router.put("/daily-tasks/mood/:dayId", async (req, res) => {
  try {
    console.log("request arrived for mood");
    const { dayId } = req.params;
    const { mood } = req.body;

    if (!dayId || typeof mood !== "number") {
      return res.status(400).json({ error: "Missing dayId or mood" });
    }

    const { data, error } = await supabase
      .from("day_data")
      .update({ mood })
      .eq("id", dayId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ message: "Mood updated", day: data });
  } catch (error) {
    console.error("❌ Error updating mood:", error);
    res.status(500).json({
      error: "Failed to update mood",
      details: error.message,
    });
  }
});

/**
 * PUT /api/daily-tasks/completion/:dayId
 * Update completion percentage
 */
router.put("/daily-tasks/completion/:dayId", async (req, res) => {
  try {
    console.log("request arrived for completion");
    const { dayId } = req.params;
    const { completion_percentage } = req.body;

    if (!dayId || typeof completion_percentage !== "number") {
      return res
        .status(400)
        .json({ error: "Missing dayId or completion_percentage" });
    }

    const { data, error } = await supabase
      .from("day_data")
      .update({ completion_percentage })
      .eq("id", dayId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ message: "Completion updated", day: data });
  } catch (error) {
    console.error("❌ Error updating completion:", error);
    res.status(500).json({
      error: "Failed to update completion",
      details: error.message,
    });
  }
});

export default router;
