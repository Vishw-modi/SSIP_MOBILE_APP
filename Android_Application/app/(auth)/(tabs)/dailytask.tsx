import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  memo,
  useEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Switch,
  Alert,
  FlatList,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Types
interface DailyQuestion {
  id: string;
  question: string;
  completed: boolean;
  category: "health" | "productivity" | "mindfulness" | "learning";
  completedAt?: string;
}

interface CustomTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  notifyEnabled: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
  completedAt?: string;
  tags?: string[];
}

interface DayData {
  date: string;
  dailyQuestions: DailyQuestion[];
  customTasks: CustomTask[];
  completionPercentage: number;
  mood: number;
}

interface AllData {
  [date: string]: DayData;
}

// Theme
const palette = {
  bg: "#f8f9fa",
  card: "#ffffff",
  text: "#212529",
  textMuted: "#6c757d",
  border: "#dee2e6",
  primary: "#4a90e2",
  success: "#28a745",
  warning: "#ffc107",
  error: "#dc3545",
};

// Constants
const CATEGORY_ICONS = {
  health: "heart",
  productivity: "trending-up",
  mindfulness: "leaf",
  learning: "book",
} as const;

const CATEGORY_COLORS = {
  health: "#ff6b6b",
  productivity: "#4ecdc4",
  mindfulness: "#45b7d1",
  learning: "#96ceb4",
} as const;

const PRIORITY_COLORS = {
  low: "#28a745",
  medium: "#ffc107",
  high: "#dc3545",
} as const;

const MOOD_EMOJIS = [
  { emoji: "😢", icon: "sad-outline", label: "Very Bad" },
  { emoji: "😕", icon: "sad", label: "Bad" },
  { emoji: "😐", icon: "remove-circle-outline", label: "Okay" },
  { emoji: "😊", icon: "happy-outline", label: "Good" },
  { emoji: "😄", icon: "happy", label: "Great" },
];

// Utility functions
const generateSampleData = (date: string): DayData => {
  const dailyQuestions: DailyQuestion[] = [
    {
      id: "1",
      question: "Did you drink 8 glasses of water?",
      completed: false,
      category: "health",
    },
    {
      id: "2",
      question: "Did you exercise for at least 30 minutes?",
      completed: false,
      category: "health",
    },
    {
      id: "3",
      question: "Did you complete your most important task?",
      completed: false,
      category: "productivity",
    },
    {
      id: "4",
      question: "Did you practice gratitude today?",
      completed: false,
      category: "mindfulness",
    },
    {
      id: "5",
      question: "Did you learn something new?",
      completed: false,
      category: "learning",
    },
  ];

  return {
    date,
    dailyQuestions,
    customTasks: [],
    completionPercentage: 0,
    mood: 3,
  };
};

const formatDateDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === -1) return "Yesterday";
  if (diffDays === 1) return "Tomorrow";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};

const getDateString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const calculateStreak = (allData: AllData, currentDate: string): number => {
  let streak = 0;
  const today = new Date(currentDate);

  // Start from yesterday and go backwards
  for (let i = 1; i <= 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = getDateString(checkDate);

    const dayData = allData[dateStr];
    if (dayData && dayData.completionPercentage > 0) {
      streak++;
    } else {
      break;
    }
  }

  // Check if today has any completion
  const todayData = allData[currentDate];
  if (todayData && todayData.completionPercentage > 0) {
    streak++;
  }

  return streak;
};

// Components
const Icon = ({ name, size = 20, color = palette.text, style = {} }: any) => {
  return <Ionicons name={name} size={size} color={color} style={style} />;
};

const MoodTracker = memo<{
  mood: number;
  onMoodChange: (mood: number) => void;
}>(({ mood, onMoodChange }) => (
  <View style={[styles.moodTracker, { backgroundColor: palette.card }]}>
    <Text style={[styles.moodTitle, { color: palette.text }]}>
      How are you feeling?
    </Text>
    <View style={styles.moodEmojis}>
      {MOOD_EMOJIS.map((moodItem, index) => {
        const isSelected = mood === index + 1;
        const colors = ["#dc3545", "#fd7e14", "#ffc107", "#20c997", "#28a745"];
        return (
          <Pressable
            key={index}
            style={[
              styles.moodEmoji,
              isSelected && {
                backgroundColor: colors[index] + "20",
                borderColor: colors[index],
                borderWidth: 2,
              },
            ]}
            onPress={() => onMoodChange(index + 1)}
          >
            <Ionicons
              name={moodItem.icon as any}
              size={28}
              color={isSelected ? colors[index] : palette.textMuted}
            />
            <Text
              style={[
                styles.moodLabel,
                { color: isSelected ? colors[index] : palette.textMuted },
              ]}
            >
              {moodItem.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  </View>
));

const InsightsPanel = memo<{ dayData: DayData }>(({ dayData }) => {
  const completedTasks =
    dayData.dailyQuestions.filter((q) => q.completed).length +
    dayData.customTasks.filter((t) => t.completed).length;
  const totalTasks = dayData.dailyQuestions.length + dayData.customTasks.length;

  return (
    <View style={[styles.insightsPanel, { backgroundColor: palette.card }]}>
      <Text style={[styles.insightsTitle, { color: palette.text }]}>
        Today's Overview
      </Text>
      <View style={styles.insightsGrid}>
        <View style={styles.insightItem}>
          <Icon name="checkmark" size={24} color={palette.primary} />
          <Text style={[styles.insightValue, { color: palette.primary }]}>
            {dayData.completionPercentage}%
          </Text>
          <Text style={[styles.insightLabel, { color: palette.textMuted }]}>
            Complete
          </Text>
        </View>

        <View style={styles.insightItem}>
          <Text style={[styles.insightValue, { color: palette.success }]}>
            {completedTasks}/{totalTasks}
          </Text>
          <Text style={[styles.insightLabel, { color: palette.textMuted }]}>
            Tasks Done
          </Text>
        </View>

        <View style={styles.insightItem}>
          <Text style={[styles.insightValue, { color: palette.warning }]}>
            <Ionicons
              name={MOOD_EMOJIS[dayData.mood - 1]?.icon as any}
              size={24}
              color={palette.warning}
            />
          </Text>
          <Text style={[styles.insightLabel, { color: palette.textMuted }]}>
            Mood
          </Text>
        </View>
      </View>
    </View>
  );
});

const DailyQuestionItem = memo<{
  question: DailyQuestion;
  onToggle: (id: string) => void;
}>(({ question, onToggle }) => {
  const handlePress = useCallback(
    () => onToggle(question.id),
    [question.id, onToggle]
  );

  return (
    <View style={styles.questionItemWrapper}>
      <Pressable
        style={[
          styles.questionItem,
          {
            backgroundColor: palette.card,
            borderColor: palette.border,
          },
        ]}
        onPress={handlePress}
      >
        <View style={styles.questionContent}>
          <View
            style={[
              styles.categoryIcon,
              { backgroundColor: CATEGORY_COLORS[question.category] + "20" },
            ]}
          >
            <Icon
              name={CATEGORY_ICONS[question.category]}
              size={16}
              color={CATEGORY_COLORS[question.category]}
            />
          </View>
          <Text
            style={[
              styles.questionText,
              { color: palette.text },
              question.completed && styles.completedText,
            ]}
          >
            {question.question}
          </Text>
        </View>
        <Pressable
          onPress={handlePress}
          style={[
            styles.checkbox,
            { borderColor: palette.border },
            question.completed && {
              backgroundColor: palette.primary,
              borderColor: palette.primary,
            },
          ]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {question.completed && (
            <Icon name="checkmark" size={16} color="white" />
          )}
        </Pressable>
      </Pressable>
    </View>
  );
});

const CustomTaskItem = memo<{
  task: CustomTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}>(({ task, onToggle, onDelete }) => {
  const handleToggle = useCallback(
    () => onToggle(task.id),
    [task.id, onToggle]
  );
  const handleDelete = useCallback(
    () => onDelete(task.id),
    [task.id, onDelete]
  );

  return (
    <View style={styles.taskItemWrapper}>
      <Pressable
        style={[
          styles.taskItem,
          {
            backgroundColor: palette.card,
            borderColor: palette.border,
            borderLeftColor: PRIORITY_COLORS[task.priority],
          },
        ]}
        onPress={handleToggle}
      >
        <View style={styles.taskContent}>
          <View style={styles.taskHeader}>
            <Text
              style={[
                styles.taskTitle,
                { color: palette.text },
                task.completed && styles.completedText,
              ]}
            >
              {task.title}
            </Text>
            <Pressable
              onPress={handleDelete}
              style={styles.deleteBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="trash-outline" size={18} color={palette.error} />
            </Pressable>
          </View>

          {task.description && (
            <Text
              style={[styles.taskDescription, { color: palette.textMuted }]}
            >
              {task.description}
            </Text>
          )}

          {task.tags && task.tags.length > 0 && (
            <View style={styles.taskTags}>
              {task.tags.map((tag, index) => (
                <View
                  key={index}
                  style={[
                    styles.tag,
                    { backgroundColor: palette.primary + "20" },
                  ]}
                >
                  <Text style={[styles.tagText, { color: palette.primary }]}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <Pressable
          onPress={handleToggle}
          style={[
            styles.checkbox,
            { borderColor: palette.border },
            task.completed && {
              backgroundColor: palette.primary,
              borderColor: palette.primary,
            },
          ]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {task.completed && <Icon name="checkmark" size={16} color="white" />}
        </Pressable>
      </Pressable>
    </View>
  );
});

// Main Component
const SimplifiedDailyTaskScreen: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>(() =>
    getDateString(new Date())
  );
  const [allData, setAllData] = useState<AllData>({});
  const [showAddTask, setShowAddTask] = useState(false);

  // Form state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskNotify, setNewTaskNotify] = useState(false);
  const [newTaskPriority, setNewTaskPriority] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [newTaskTags, setNewTaskTags] = useState("");

  // Get current day data
  const currentDayData = useMemo(() => {
    if (!allData[currentDate]) {
      const newData = generateSampleData(currentDate);
      setAllData((prev) => ({ ...prev, [currentDate]: newData }));
      return newData;
    }
    return allData[currentDate];
  }, [currentDate, allData]);

  // Calculate streak
  const streak = useMemo(
    () => calculateStreak(allData, currentDate),
    [allData, currentDate]
  );

  // Log data changes
  useEffect(() => {
    console.log("All Data Updated:", JSON.stringify(allData, null, 2));
  }, [allData]);

  // Navigation handlers
  const goToPreviousDay = useCallback(() => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 1);
    setCurrentDate(getDateString(date));
  }, [currentDate]);

  const goToNextDay = useCallback(() => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    setCurrentDate(getDateString(date));
  }, [currentDate]);

  const goToToday = useCallback(() => {
    setCurrentDate(getDateString(new Date()));
  }, []);

  // Handlers
  const handleQuestionToggle = useCallback(
    (questionId: string) => {
      setAllData((prev) => {
        const newData = { ...prev };
        const dayData = newData[currentDate];

        if (!dayData) return prev;

        // Create new arrays and objects to trigger re-render
        const newDayData = {
          ...dayData,
          dailyQuestions: dayData.dailyQuestions.map((q) => {
            if (q.id === questionId) {
              return {
                ...q,
                completed: !q.completed,
                completedAt: !q.completed
                  ? new Date().toISOString()
                  : undefined,
              };
            }
            return q;
          }),
        };

        // Recalculate completion percentage
        const completedCount =
          newDayData.dailyQuestions.filter((q) => q.completed).length +
          newDayData.customTasks.filter((t) => t.completed).length;
        const totalCount =
          newDayData.dailyQuestions.length + newDayData.customTasks.length;
        newDayData.completionPercentage =
          totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return {
          ...newData,
          [currentDate]: newDayData,
        };
      });
    },
    [currentDate]
  );

  const handleTaskToggle = useCallback(
    (taskId: string) => {
      setAllData((prev) => {
        const newData = { ...prev };
        const dayData = newData[currentDate];

        if (!dayData) return prev;

        // Create new arrays and objects to trigger re-render
        const newDayData = {
          ...dayData,
          customTasks: dayData.customTasks.map((t) => {
            if (t.id === taskId) {
              return {
                ...t,
                completed: !t.completed,
                completedAt: !t.completed
                  ? new Date().toISOString()
                  : undefined,
              };
            }
            return t;
          }),
        };

        // Recalculate completion percentage
        const completedCount =
          newDayData.dailyQuestions.filter((q) => q.completed).length +
          newDayData.customTasks.filter((t) => t.completed).length;
        const totalCount =
          newDayData.dailyQuestions.length + newDayData.customTasks.length;
        newDayData.completionPercentage =
          totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return {
          ...newData,
          [currentDate]: newDayData,
        };
      });
    },
    [currentDate]
  );

  const handleMoodChange = useCallback(
    (mood: number) => {
      setAllData((prev) => ({
        ...prev,
        [currentDate]: { ...prev[currentDate], mood },
      }));
    },
    [currentDate]
  );

  const handleTaskDelete = useCallback(
    (taskId: string) => {
      Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setAllData((prev) => {
              const updatedData = { ...prev };
              const dayData = { ...updatedData[currentDate] };
              dayData.customTasks = dayData.customTasks.filter(
                (t) => t.id !== taskId
              );

              const completedCount =
                dayData.dailyQuestions.filter((q) => q.completed).length +
                dayData.customTasks.filter((t) => t.completed).length;
              const totalCount =
                dayData.dailyQuestions.length + dayData.customTasks.length;
              dayData.completionPercentage =
                totalCount > 0
                  ? Math.round((completedCount / totalCount) * 100)
                  : 0;

              updatedData[currentDate] = dayData;
              return updatedData;
            });
          },
        },
      ]);
    },
    [currentDate]
  );

  const handleAddTask = useCallback(() => {
    if (!newTaskTitle.trim()) {
      alert("Please enter a task title");
      return;
    }

    const newTask: CustomTask = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim() || undefined,
      completed: false,
      notifyEnabled: newTaskNotify,
      priority: newTaskPriority,
      createdAt: new Date().toISOString(),
      tags: newTaskTags
        ? newTaskTags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag)
        : undefined,
    };

    setAllData((prev) => {
      const updatedData = { ...prev };
      const dayData = { ...updatedData[currentDate] };
      dayData.customTasks.push(newTask);

      const completedCount =
        dayData.dailyQuestions.filter((q) => q.completed).length +
        dayData.customTasks.filter((t) => t.completed).length;
      const totalCount =
        dayData.dailyQuestions.length + dayData.customTasks.length;
      dayData.completionPercentage =
        totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      updatedData[currentDate] = dayData;
      return updatedData;
    });

    // Reset form
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskNotify(false);
    setNewTaskPriority("medium");
    setNewTaskTags("");
    setShowAddTask(false);
  }, [
    newTaskTitle,
    newTaskDescription,
    newTaskNotify,
    newTaskPriority,
    newTaskTags,
    currentDate,
  ]);

  const isToday = currentDate === getDateString(new Date());

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: palette.card, borderBottomColor: palette.border },
        ]}
      >
        <View style={styles.headerContent}>
          <Pressable onPress={goToPreviousDay} style={styles.navButton}>
            <Icon name="chevron-back" size={24} color={palette.primary} />
          </Pressable>

          <View style={styles.dateContainer}>
            <Text style={[styles.dateText, { color: palette.text }]}>
              {formatDateDisplay(currentDate)}
            </Text>
            <Text style={[styles.dateSubtext, { color: palette.textMuted }]}>
              {new Date(currentDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </View>

          <Pressable onPress={goToNextDay} style={styles.navButton}>
            <Icon name="chevron-forward" size={24} color={palette.primary} />
          </Pressable>
        </View>

        <View style={styles.streakContainer}>
          <Text style={[styles.streakText, { color: palette.warning }]}>
            🔥 {streak} day streak
          </Text>
        </View>

        {!isToday && (
          <Pressable
            onPress={goToToday}
            style={[styles.todayButton, { backgroundColor: palette.primary }]}
          >
            <Text style={styles.todayButtonText}>Go to Today</Text>
          </Pressable>
        )}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <MoodTracker
          mood={currentDayData.mood}
          onMoodChange={handleMoodChange}
        />
        <InsightsPanel dayData={currentDayData} />

        {/* Daily Questions Section */}
        <View style={[styles.section, { backgroundColor: palette.card }]}>
          <View style={styles.sectionHeader}>
            <Icon name="help-circle" size={20} color={palette.primary} />
            <Text style={[styles.sectionTitle, { color: palette.text }]}>
              Daily Check-ins
            </Text>
            <Text style={[styles.progressText, { color: palette.textMuted }]}>
              {currentDayData.dailyQuestions.filter((q) => q.completed).length}/
              {currentDayData.dailyQuestions.length}
            </Text>
          </View>
          {currentDayData.dailyQuestions.map((question) => (
            <DailyQuestionItem
              key={question.id}
              question={question}
              onToggle={handleQuestionToggle}
            />
          ))}
        </View>

        {/* Custom Tasks Section */}
        <View style={[styles.section, { backgroundColor: palette.card }]}>
          <View style={styles.sectionHeader}>
            <Icon name="list" size={20} color={palette.primary} />
            <Text style={[styles.sectionTitle, { color: palette.text }]}>
              Your Tasks
            </Text>
            <Text style={[styles.progressText, { color: palette.textMuted }]}>
              {currentDayData.customTasks.filter((t) => t.completed).length}/
              {currentDayData.customTasks.length}
            </Text>
          </View>
          {currentDayData.customTasks.map((task) => (
            <CustomTaskItem
              key={task.id}
              task={task}
              onToggle={handleTaskToggle}
              onDelete={handleTaskDelete}
            />
          ))}

          <Pressable
            style={[styles.addTaskBtn, { backgroundColor: palette.primary }]}
            onPress={() => setShowAddTask(true)}
          >
            <Icon name="add" size={20} color="white" />
            <Text style={styles.addTaskText}>Add Task</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Add Task Modal */}
      <Modal visible={showAddTask} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContainer, { backgroundColor: palette.card }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: palette.text }]}>
                Add New Task
              </Text>
              <Pressable onPress={() => setShowAddTask(false)}>
                <Icon name="close" size={24} color={palette.textMuted} />
              </Pressable>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={[styles.inputLabel, { color: palette.text }]}>
                Task Title *
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: palette.bg,
                    color: palette.text,
                    borderColor: palette.border,
                  },
                ]}
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                placeholder="What needs to be done?"
                placeholderTextColor={palette.textMuted}
              />

              <Text style={[styles.inputLabel, { color: palette.text }]}>
                Description
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  styles.textArea,
                  {
                    backgroundColor: palette.bg,
                    color: palette.text,
                    borderColor: palette.border,
                  },
                ]}
                value={newTaskDescription}
                onChangeText={setNewTaskDescription}
                placeholder="Add details (optional)"
                placeholderTextColor={palette.textMuted}
                multiline
                numberOfLines={3}
              />

              <Text style={[styles.inputLabel, { color: palette.text }]}>
                Tags (comma separated)
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: palette.bg,
                    color: palette.text,
                    borderColor: palette.border,
                  },
                ]}
                value={newTaskTags}
                onChangeText={setNewTaskTags}
                placeholder="work, urgent, personal"
                placeholderTextColor={palette.textMuted}
              />

              <Text style={[styles.inputLabel, { color: palette.text }]}>
                Priority
              </Text>
              <View style={styles.priorityContainer}>
                {(["low", "medium", "high"] as const).map((priority) => (
                  <Pressable
                    key={priority}
                    style={[
                      styles.priorityBtn,
                      { borderColor: palette.border },
                      newTaskPriority === priority && {
                        backgroundColor: palette.primary,
                      },
                    ]}
                    onPress={() => setNewTaskPriority(priority)}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        {
                          color:
                            newTaskPriority === priority
                              ? "white"
                              : palette.text,
                        },
                      ]}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View style={styles.switchContainer}>
                <Text style={[styles.inputLabel, { color: palette.text }]}>
                  Enable Notifications
                </Text>
                <Switch
                  value={newTaskNotify}
                  onValueChange={setNewTaskNotify}
                />
              </View>

              <Pressable
                style={[styles.addBtn, { backgroundColor: palette.primary }]}
                onPress={handleAddTask}
              >
                <Icon name="add" size={20} color="white" />
                <Text style={styles.addBtnText}>Add Task</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navButton: { padding: 8 },
  dateContainer: { flex: 1, alignItems: "center" },
  dateText: { fontSize: 24, fontWeight: "600" },
  dateSubtext: { fontSize: 14, marginTop: 4 },
  streakContainer: { alignItems: "center", marginTop: 12 },
  streakText: { fontSize: 16, fontWeight: "600" },
  todayButton: {
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 8,
  },
  todayButtonText: { color: "white", fontSize: 14, fontWeight: "600" },
  content: { flex: 1, padding: 16 },
  moodTracker: { padding: 16, borderRadius: 12, marginBottom: 16 },
  moodTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  moodEmojis: { flexDirection: "row", justifyContent: "space-around" },
  moodEmoji: {
    width: 60,
    height: 70,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  moodLabel: { fontSize: 10, marginTop: 4, fontWeight: "500" },
  emojiText: { fontSize: 24 },
  insightsPanel: { padding: 16, borderRadius: 12, marginBottom: 16 },
  insightsTitle: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
  insightsGrid: { flexDirection: "row", justifyContent: "space-around" },
  insightItem: { alignItems: "center" },
  insightValue: { fontSize: 20, fontWeight: "bold", marginTop: 8 },
  insightLabel: { fontSize: 12, marginTop: 4 },
  section: { borderRadius: 12, padding: 16, marginBottom: 16 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginLeft: 8, flex: 1 },
  progressText: { fontSize: 14, fontWeight: "500" },
  questionItemWrapper: { marginBottom: 8 },
  questionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  questionContent: { flex: 1, flexDirection: "row", alignItems: "center" },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  questionText: { fontSize: 16, flex: 1 },
  completedText: { textDecorationLine: "line-through", opacity: 0.6 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  taskItemWrapper: { marginBottom: 8 },
  taskItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderLeftWidth: 4,
    flexDirection: "row",
  },
  taskContent: { flex: 1 },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  taskTitle: { fontSize: 16, fontWeight: "500", flex: 1 },
  deleteBtn: { padding: 4, marginLeft: 8 },
  taskDescription: { fontSize: 14, marginTop: 4, lineHeight: 20 },
  taskTags: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: { fontSize: 10, fontWeight: "500" },
  addTaskBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  addTaskText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: "600" },
  modalContent: { maxHeight: 500 },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16 },
  textArea: { height: 80, textAlignVertical: "top" },
  priorityContainer: { flexDirection: "row", justifyContent: "space-between" },
  priorityBtn: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  priorityText: { fontSize: 14, fontWeight: "500" },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  addBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

MoodTracker.displayName = "MoodTracker";
InsightsPanel.displayName = "InsightsPanel";
DailyQuestionItem.displayName = "DailyQuestionItem";
CustomTaskItem.displayName = "CustomTaskItem";

export default SimplifiedDailyTaskScreen;
