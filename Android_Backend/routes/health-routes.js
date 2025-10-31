import express from "express";
import supabase from "../supabaseClient.js";

const router = express.Router();

/**
 * GET /api/health-records/:clerkUserId
 * Fetch all health records for a given Clerk user
 */
router.get("/health-records/:clerkUserId", async (req, res) => {
  try {
    const { clerkUserId } = req.params;
    console.log(clerkUserId);

    if (!clerkUserId) {
      return res.status(400).json({ error: "Missing Clerk User ID" });
    }

    // 🔍 Step 1: Get the user record from Supabase using clerkUserId
    const { data: userRecord, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerkuserid", clerkUserId)
      .single();

    if (userError || !userRecord) {
      console.log("userRecord", userError, userRecord);
      return res.status(404).json({ error: "User not found" });
    }

    // 📊 Step 2: Fetch all health scores for that user
    const { data: healthRecords, error: healthError } = await supabase
      .from("health_scores")
      .select("*")
      .eq("user_id", userRecord.id)
      .order("created_at", { ascending: false }); // latest first

    if (healthError) {
      throw healthError;
    }

    // ✅ Step 3: Return the records
    console.log("Health Report send");

    res.status(200).json({
      message: "Health records fetched successfully",
      records: healthRecords,
    });
  } catch (error) {
    console.error("Error fetching health records:", error);
    res.status(500).json({
      error: "Failed to fetch health records",
      details: error.message,
    });
  }
});

export default router;
