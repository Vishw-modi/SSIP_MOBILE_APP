import express from "express";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.post("/register", async (req, res) => {
  console.log("Incoming request:", req.body);

  const { clerkUserId, name, email, imageUrl } = req.body;

  if (!clerkUserId || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // ✅ Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("clerkuserid", clerkUserId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existingUser) {
      console.log("User Already exists");

      return res
        .status(200)
        .json({ message: "User already exists", user: existingUser });
    }

    // ✅ Insert new user (must use lowercase column names)
    const { data, error } = await supabase
      .from("users")
      .insert([{ clerkuserid: clerkUserId, name, email, imageurl: imageUrl }])
      .select()
      .single();

    if (error) throw error;
    console.log("New User created");

    return res.status(201).json({ message: "User created", user: data });
  } catch (error) {
    if (error.message?.includes("duplicate key value")) {
      console.warn("Duplicate insert avoided");
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("clerkuserid", clerkUserId)
        .maybeSingle();
      return res
        .status(200)
        .json({ message: "User already exists", user: existingUser });
    }

    console.error("Error creating user:", error.message || error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
