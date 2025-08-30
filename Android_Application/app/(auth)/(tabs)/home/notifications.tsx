import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { spacing, radii } from "@/design/styles";
import { useTheme } from "@/context/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

type Notice = {
  id: string;
  title: string;
  body: string;
  time: string;
  unread?: boolean;
  icon: keyof typeof Ionicons.glyphMap;
};

const DATA: Notice[] = [
  {
    id: "1",
    title: "Meal logged",
    body: "You added Breakfast: Oatmeal and Berries.",
    time: "2m ago",
    unread: true,
    icon: "fast-food",
  },
  {
    id: "2",
    title: "Goal reminder",
    body: "Drink 2 more cups of water today.",
    time: "1h ago",
    icon: "water",
  },
  {
    id: "3",
    title: "Coach message",
    body: "Your plan was updated for next week.",
    time: "Yesterday",
    icon: "chatbubbles",
  },
];

export default function NotificationsScreen() {
  const { palette } = useTheme();
  const [listData, setListData] = useState(DATA);

  // Helper to map icon bg colors using theme palette
  function getIconBackgroundColor(iconName: string): string {
    switch (iconName) {
      case "fast-food":
        return palette.success;
      case "water":
        return palette.info;
      case "chatbubbles":
        return palette.primary;
      default:
        return palette.primary;
    }
  }

  const handleDelete = (rowKey: string) => {
    const newData = listData.filter((item) => item.id !== rowKey);
    setListData(newData);
  };

  // Create dynamic styles that use the current palette
  const dynamicStyles = StyleSheet.create({
    rowFront: {
      ...styles.rowFront,
      backgroundColor: palette.card,
      borderBottomColor: palette.border,
    },
    titleText: {
      ...styles.titleText,
      color: palette.text,
    },
    titleTextUnread: {
      ...styles.titleText,
      color: palette.text,
      fontWeight: "700",
    },
    bodyText: {
      ...styles.bodyText,
      color: palette.textSecondary,
    },
    timeText: {
      ...styles.timeText,
      color: palette.textMuted,
    },
    rowBack: {
      ...styles.rowBack,
      backgroundColor: palette.dangerBg,
    },
    backBtn: {
      ...styles.backBtn,
      backgroundColor: palette.danger,
    },
    unreadDot: {
      ...styles.unreadDot,
      backgroundColor: palette.accent,
    },
  });

  const renderItem = ({ item }: { item: Notice }) => (
    <View style={dynamicStyles.rowFront}>
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: getIconBackgroundColor(item.icon) },
        ]}
      >
        <Ionicons name={item.icon} size={16} color={palette.textInverse} />
      </View>

      <View style={styles.contentContainer}>
        <Text
          style={
            item.unread
              ? dynamicStyles.titleTextUnread
              : dynamicStyles.titleText
          }
        >
          {item.title}
        </Text>
        <Text style={dynamicStyles.bodyText}>{item.body}</Text>
        <Text style={dynamicStyles.timeText}>{item.time}</Text>
      </View>

      {item.unread && <View style={dynamicStyles.unreadDot} />}
    </View>
  );

  const renderHiddenItem = (data: { item: Notice }) => (
    <View style={dynamicStyles.rowBack}>
      <TouchableOpacity
        style={dynamicStyles.backBtn}
        onPress={() => handleDelete(data.item.id)}
      >
        <Ionicons name="trash" size={20} color={palette.textInverse} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg }}>
      <SwipeListView
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-70}
        disableRightSwipe
        contentContainerStyle={{ backgroundColor: palette.bg, flexGrow: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rowFront: {
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md,
    alignItems: "flex-start",
    borderBottomWidth: 1,
  },
  rowBack: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 15,
  },
  backBtn: {
    width: 70,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: radii.circle,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    gap: spacing.xxs,
  },
  titleText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
  },
  timeText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "400",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: radii.circle,
    marginLeft: spacing.xs,
    marginTop: spacing.xs,
  },
});
