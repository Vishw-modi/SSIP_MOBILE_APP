import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export const useRealtimeDay = (refresh) => {
  useEffect(() => {
    const channel = supabase
      .channel("day-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "daily_questions" },
        refresh
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "custom_tasks" },
        refresh
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
};
