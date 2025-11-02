// import { useEffect, useMemo, useRef, useState } from "react";
// import {
//   Animated,
//   Easing,
//   FlatList,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
//   Modal,
//   ScrollView,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { palette, spacing } from "@/design/styles";
// import { useChat } from "@/hooks/use-chat";
// import { RestAdapter } from "@/chat/rest-adaptor";
// import type { ChatMessage } from "@/chat/types";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// // Framer Motion-style animations for React Native
// import { MotiView } from "moti";

// const SEVERITY_META: Record<
//   string,
//   {
//     color: string;
//     bg: string;
//     icon: keyof typeof Ionicons.glyphMap;
//     label: string;
//   }
// > = {
//   info: {
//     color: "#0891B2",
//     bg: "rgba(8,145,178,0.08)",
//     icon: "information-circle",
//     label: "INFO",
//   },
//   warning: {
//     color: "#D97706",
//     bg: "rgba(217,119,6,0.08)",
//     icon: "warning",
//     label: "WARNING",
//   },
//   urgent: {
//     color: "#DC2626",
//     bg: "rgba(220,38,38,0.08)",
//     icon: "alert-circle",
//     label: "URGENT",
//   },
// };

// function getSeverityMeta(kind?: string) {
//   const key = (kind || "info").toLowerCase();
//   return SEVERITY_META[key] ?? SEVERITY_META.info;
// }

// interface AnswerType {
//   title?: string;
//   text?: string;
//   details?: string | string[];
//   severity?: "info" | "warning" | "urgent" | string;
//   final?: boolean;
// }

// function AnswerCard({
//   answer,
//   isUser,
//   onExpand,
// }: {
//   answer: AnswerType;
//   isUser: boolean;
//   onExpand?: () => void;
// }) {
//   const meta = getSeverityMeta(answer?.severity);
//   const detailsArray =
//     typeof answer?.details === "string"
//       ? [answer.details]
//       : Array.isArray(answer?.details)
//       ? answer.details
//       : [];

//   return (
//     <MotiView
//       from={{ opacity: 0, translateY: 6, scale: 0.98 }}
//       animate={{ opacity: 1, translateY: 0, scale: 1 }}
//       transition={{ type: "timing", duration: 220 }}
//       style={[
//         styles.answerCard,
//         { borderLeftColor: meta.color, shadowColor: "#000" },
//       ]}
//       accessibilityRole="summary"
//     >
//       <View style={styles.answerHeader}>
//         <View style={[styles.answerIconWrap, { backgroundColor: meta.bg }]}>
//           <Ionicons name={meta.icon} size={18} color={meta.color} />
//         </View>

//         <View style={styles.answerHeaderTextWrap}>
//           {!!answer?.title && (
//             <Text
//               style={[
//                 isUser ? styles.userText : styles.botText,
//                 styles.answerTitleNew,
//               ]}
//             >
//               {answer.title}
//             </Text>
//           )}

//           {!!answer?.text && (
//             <Text
//               style={[
//                 isUser ? styles.userText : styles.botText,
//                 styles.answerTextNew,
//               ]}
//             >
//               {answer.text}
//             </Text>
//           )}
//         </View>

//         <View
//           style={[
//             styles.severityPill,
//             { borderColor: meta.color, backgroundColor: meta.bg },
//           ]}
//         >
//           <Text style={[styles.severityPillText, { color: meta.color }]}>
//             {meta.label}
//           </Text>
//         </View>
//       </View>

//       {detailsArray.length > 0 && (
//         <View style={styles.answerBody}>
//           {detailsArray.map((d, i) => (
//             <View key={`${i}-${d}`} style={styles.detailRow}>
//               <View
//                 style={[styles.detailDot, { backgroundColor: meta.color }]}
//               />
//               <Text
//                 style={[
//                   isUser ? styles.userText : styles.botText,
//                   styles.answerDetailsNew,
//                 ]}
//               >
//                 {d}
//               </Text>
//             </View>
//           ))}
//         </View>
//       )}

//       {onExpand && (
//         <View style={styles.answerActions}>
//           <Pressable
//             onPress={onExpand}
//             accessibilityRole="button"
//             accessibilityLabel="View full answer"
//             android_ripple={{ color: "rgba(0,0,0,0.06)" }}
//             style={({ pressed }) => [
//               styles.expandBtn,
//               pressed &&
//                 Platform.select({ ios: { opacity: 0.9 }, default: {} }),
//             ]}
//           >
//             <Ionicons name="expand" size={14} color={meta.color} />
//             <Text style={[styles.expandText, { color: meta.color }]}>
//               View details
//             </Text>
//           </Pressable>
//         </View>
//       )}
//     </MotiView>
//   );
// }

// function TypingIndicator() {
//   const dots = [
//     useRef(new Animated.Value(0)).current,
//     useRef(new Animated.Value(0)).current,
//     useRef(new Animated.Value(0)).current,
//   ];

//   const makeAnim = (val: Animated.Value, delay: number) =>
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(val, {
//           toValue: -6,
//           duration: 280,
//           easing: Easing.out(Easing.quad),
//           useNativeDriver: true,
//           delay,
//         }),
//         Animated.timing(val, {
//           toValue: 0,
//           duration: 280,
//           easing: Easing.in(Easing.quad),
//           useNativeDriver: true,
//         }),
//       ])
//     );

//   useEffect(() => {
//     const animations = dots.map((v, idx) => makeAnim(v, idx * 120));
//     animations.forEach((a) => a.start());
//     return () => animations.forEach((a) => a.stop());
//   }, []);

//   return (
//     <View
//       style={styles.typingWrap}
//       accessibilityRole="text"
//       accessibilityLabel="Assistant is typing"
//       accessibilityLiveRegion="polite"
//     >
//       {dots.map((val, i) => (
//         <Animated.View
//           key={i}
//           style={[styles.typingDot, { transform: [{ translateY: val }] }]}
//         />
//       ))}
//     </View>
//   );
// }

// function FullScreenAnswerModal({
//   visible,
//   onClose,
//   answer,
// }: {
//   visible: boolean;
//   onClose: () => void;
//   answer: AnswerType | null;
// }) {
//   if (!answer) return null;

//   const meta = getSeverityMeta(answer?.severity);
//   const detailsArray =
//     typeof answer?.details === "string"
//       ? [answer.details]
//       : Array.isArray(answer?.details)
//       ? answer.details
//       : [];

//   return (
//     <Modal
//       animationType="slide"
//       visible={visible}
//       transparent={true}
//       statusBarTranslucent
//       onRequestClose={onClose}
//     >
//       <View style={styles.fsRoot}>
//         <Pressable
//           onPress={onClose}
//           accessibilityRole="button"
//           accessibilityLabel="Close full answer"
//           style={styles.fsBackdrop}
//         />

//         <MotiView
//           from={{ opacity: 0, translateY: 300 }}
//           animate={{ opacity: 1, translateY: 0 }}
//           exit={{ opacity: 0, translateY: 300 }}
//           transition={{ type: "timing", duration: 300 }}
//           style={styles.fsContainer}
//         >
//           <View style={styles.fsHeader}>
//             <View style={[styles.fsIconWrap, { backgroundColor: meta.bg }]}>
//               <Ionicons name={meta.icon} size={20} color={meta.color} />
//             </View>

//             <Text style={styles.fsHeaderTitle}>Medical Assessment</Text>

//             <View
//               style={[
//                 styles.severityPill,
//                 { borderColor: meta.color, backgroundColor: meta.bg },
//               ]}
//             >
//               <Text style={[styles.severityPillText, { color: meta.color }]}>
//                 {meta.label}
//               </Text>
//             </View>

//             <Pressable
//               onPress={onClose}
//               accessibilityRole="button"
//               accessibilityLabel="Close"
//               hitSlop={8}
//               style={styles.fsCloseIconBtn}
//             >
//               <Ionicons name="close" size={18} color="#64748B" />
//             </Pressable>
//           </View>

//           <ScrollView
//             contentContainerStyle={styles.fsScrollContent}
//             keyboardShouldPersistTaps="handled"
//             showsVerticalScrollIndicator={false}
//           >
//             {!!answer?.title && (
//               <Text style={styles.fsTitle}>{answer.title}</Text>
//             )}
//             {!!answer?.text && <Text style={styles.fsText}>{answer.text}</Text>}

//             {detailsArray.length > 0 && (
//               <View style={styles.fsDetails}>
//                 <Text style={styles.fsDetailsHeader}>Details:</Text>
//                 {detailsArray.map((detail, idx) => (
//                   <View key={`${idx}-${detail}`} style={styles.fsDetailRow}>
//                     <Ionicons
//                       name="checkmark-circle"
//                       size={18}
//                       color={meta.color}
//                       style={styles.fsDetailIcon}
//                     />
//                     <Text style={styles.fsDetailText}>{detail}</Text>
//                   </View>
//                 ))}
//               </View>
//             )}
//           </ScrollView>

//           <View style={styles.fsFooter}>
//             <Pressable
//               onPress={onClose}
//               accessibilityRole="button"
//               accessibilityLabel="Close full answer"
//               style={({ pressed }) => [
//                 styles.fsCloseBtn,
//                 pressed &&
//                   Platform.select({ ios: { opacity: 0.9 }, default: {} }),
//               ]}
//               android_ripple={{ color: "rgba(255,255,255,0.2)" }}
//             >
//               <Ionicons name="close" size={18} color="#fff" />
//               <Text style={styles.fsCloseText}>Close</Text>
//             </Pressable>
//           </View>
//         </MotiView>
//       </View>
//     </Modal>
//   );
// }

// export default function ChatBotScreen() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();

//   // Initialize with proper typing
//   const initialMessages = useMemo<ChatMessage[]>(
//     () => [
//       {
//         id: "m1",
//         role: "assistant",
//         content: {
//           response: "Hello there!",
//           question: "I am your health assistant. How can I help you today?",
//           type: "text",
//           answer: null,
//         },
//         createdAt: Date.now() - 600000,
//       },
//     ],
//     []
//   );

//   // Initialize chat hook with error handling
//   const chatAdapter = useMemo(() => new RestAdapter(), []);
//   const { messages, isSending, send } = useChat(chatAdapter, {
//     initialMessages,
//   });

//   const [input, setInput] = useState("");
//   const listRef = useRef<FlatList<ChatMessage>>(null);
//   const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
//   const [fullAnswer, setFullAnswer] = useState<{
//     id: string;
//     answer: AnswerType;
//   } | null>(null);
//   const [shownFullForIds, setShownFullForIds] = useState<Set<string>>(
//     new Set()
//   );

//   // Auto-scroll with error handling
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       try {
//         listRef.current?.scrollToEnd({ animated: true });
//       } catch (error) {
//         console.warn("Auto-scroll failed:", error);
//       }
//     }, 100);
//     return () => clearTimeout(timer);
//   }, [messages.length, isSending]);

//   // Auto-show full answer for final responses
//   useEffect(() => {
//     try {
//       const last = [...messages]
//         .reverse()
//         .find((m) => m.role === "assistant" && (m as any).content?.answer) as
//         | ChatMessage
//         | undefined;

//       const content: any = last?.content ?? {};
//       const ans = content?.answer as AnswerType;

//       if (last && ans && ans.final === true && !shownFullForIds.has(last.id)) {
//         setFullAnswer({ id: last.id, answer: ans });
//         setShownFullForIds((prev) => new Set(prev).add(last.id));
//       }
//     } catch (error) {
//       console.warn("Error processing final answer:", error);
//     }
//   }, [messages, shownFullForIds]);

//   const onSend = async () => {
//     const text = input.trim();
//     if (!text || isSending) return;

//     try {
//       setInput("");
//       await send(text);
//     } catch (error) {
//       console.error("Send error:", error);
//       // Optionally show an error message to the user
//     }
//   };

//   const normalizeType = (t?: string) => {
//     const type = (t || "").toLowerCase().trim();
//     if (type === "yes/no" || type === "yes-no" || type === "boolean")
//       return "yes-no";
//     if (type === "4options" || type === "likert-4" || type === "agree-4")
//       return "likert-4";
//     if (type === "typing") return "typing";
//     return "text";
//   };

//   const markAnswered = (id: string) =>
//     setAnsweredIds((prev) => new Set(prev).add(id));

//   const handleQuickReply = async (messageId: string, value: string) => {
//     if (isSending) return;
//     try {
//       markAnswered(messageId);
//       await send(value);
//     } catch (error) {
//       console.error("Quick reply error:", error);
//     }
//   };

//   const QuickReplies = ({ item }: { item: ChatMessage }) => {
//     const t = normalizeType((item as any).content?.type);
//     const isAssistant = item.role === "assistant";
//     if (!isAssistant) return null;
//     if (answeredIds.has(item.id)) return null;

//     if (t === "yes-no") {
//       const options = ["Yes", "No"];
//       return (
//         <MotiView
//           from={{ opacity: 0, translateY: 6 }}
//           animate={{ opacity: 1, translateY: 0 }}
//           transition={{ type: "timing", duration: 200 }}
//           accessibilityRole="menu"
//           style={styles.quickWrap}
//         >
//           {options.map((opt, idx) => (
//             <MotiView
//               key={opt}
//               from={{ opacity: 0, translateY: 6, scale: 0.98 }}
//               animate={{ opacity: 1, translateY: 0, scale: 1 }}
//               transition={{ type: "timing", duration: 220, delay: idx * 40 }}
//             >
//               <Pressable
//                 accessibilityRole="button"
//                 accessibilityLabel={`Choose ${opt}`}
//                 onPress={() => handleQuickReply(item.id, opt)}
//                 disabled={isSending}
//                 android_ripple={{ color: "rgba(0,0,0,0.06)" }}
//                 style={({ pressed }) => [
//                   styles.chip,
//                   pressed &&
//                     Platform.select({ ios: { opacity: 0.9 }, default: {} }),
//                 ]}
//               >
//                 <Text style={styles.chipText}>{opt}</Text>
//               </Pressable>
//             </MotiView>
//           ))}
//         </MotiView>
//       );
//     }

//     if (t === "likert-4") {
//       const options = [
//         "Strongly agree",
//         "Agree",
//         "Disagree",
//         "Strongly disagree",
//       ];
//       return (
//         <MotiView
//           from={{ opacity: 0, translateY: 6 }}
//           animate={{ opacity: 1, translateY: 0 }}
//           transition={{ type: "timing", duration: 200 }}
//           accessibilityRole="menu"
//           style={styles.quickWrap}
//         >
//           {options.map((opt, idx) => (
//             <MotiView
//               key={opt}
//               from={{ opacity: 0, translateY: 6, scale: 0.98 }}
//               animate={{ opacity: 1, translateY: 0, scale: 1 }}
//               transition={{ type: "timing", duration: 220, delay: idx * 40 }}
//               style={styles.chipWide}
//             >
//               <Pressable
//                 accessibilityRole="button"
//                 accessibilityLabel={`Choose ${opt}`}
//                 onPress={() => handleQuickReply(item.id, opt)}
//                 disabled={isSending}
//                 android_ripple={{ color: "rgba(0,0,0,0.06)" }}
//                 style={({ pressed }) => [
//                   styles.chip,
//                   pressed &&
//                     Platform.select({ ios: { opacity: 0.9 }, default: {} }),
//                 ]}
//               >
//                 <Text numberOfLines={1} style={styles.chipText}>
//                   {opt}
//                 </Text>
//               </Pressable>
//             </MotiView>
//           ))}
//         </MotiView>
//       );
//     }

//     return null;
//   };

//   const renderItem = ({
//     item,
//     index,
//   }: {
//     item: ChatMessage;
//     index: number;
//   }) => {
//     const isUser = item.role === "user";
//     const content: any = (item as any).content ?? {};
//     const typeBadge = normalizeType(content.type);

//     if (!isUser && typeBadge === "typing") {
//       return (
//         <MotiView
//           from={{ opacity: 0, translateX: -20 }}
//           animate={{ opacity: 1, translateX: 0 }}
//           transition={{ type: "timing", duration: 220 }}
//           style={[styles.bubbleWrap, styles.bubbleLeft]}
//         >
//           <View style={[styles.bubble, styles.botBubble]}>
//             <TypingIndicator />
//           </View>
//         </MotiView>
//       );
//     }

//     return (
//       <MotiView
//         from={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ type: "timing", duration: 240 }}
//         style={[
//           styles.bubbleWrap,
//           isUser ? styles.bubbleRight : styles.bubbleLeft,
//         ]}
//       >
//         <View
//           style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}
//         >
//           {!isUser && typeBadge !== "text" ? (
//             <View style={styles.typeBadge}>
//               <Text style={styles.typeBadgeText}>
//                 {typeBadge === "yes-no"
//                   ? "Yes / No"
//                   : typeBadge === "likert-4"
//                   ? "4-point scale"
//                   : typeBadge}
//               </Text>
//             </View>
//           ) : null}

//           {content.response ? (
//             <Text
//               style={[
//                 isUser ? styles.userText : styles.botText,
//                 styles.responseText,
//               ]}
//             >
//               {content.response}
//             </Text>
//           ) : null}

//           {content.answer && typeof content.answer === "object" ? (
//             <AnswerCard
//               answer={content.answer}
//               isUser={isUser}
//               onExpand={() =>
//                 setFullAnswer({ id: item.id, answer: content.answer })
//               }
//             />
//           ) : null}

//           {content.question ? (
//             <Text
//               style={[
//                 isUser ? styles.userText : styles.botText,
//                 styles.questionText,
//               ]}
//             >
//               {content.question}
//             </Text>
//           ) : null}

//           {!isUser ? <QuickReplies item={item} /> : null}
//         </View>
//       </MotiView>
//     );
//   };

//   const dataWithTyping = useMemo(() => {
//     if (!isSending) return messages;
//     const typingMessage: ChatMessage = {
//       id: "typing",
//       role: "assistant",
//       content: { type: "typing" } as any,
//       createdAt: Date.now(),
//     };
//     return [...messages, typingMessage];
//   }, [isSending, messages]);

//   return (
//     <KeyboardAvoidingView
//       style={styles.root}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       keyboardVerticalOffset={Platform.select({
//         ios: insets.top + 8,
//         android: insets.bottom + 20,
//         default: 0,
//       })}
//     >
//       <View style={styles.header}>
//         <Pressable
//           onPress={() => router.back()}
//           style={styles.backBtn}
//           hitSlop={10}
//           android_ripple={{ color: "rgba(0,0,0,0.06)" }}
//         >
//           <Ionicons name="chevron-back" size={22} color="#111827" />
//         </Pressable>

//         <View style={styles.titleWrap}>
//           <Image
//             source={require("../../../assets/images/nutrizy-logo.png")}
//             style={styles.avatar}
//           />
//           <Text style={styles.title}>Laso-AI</Text>
//         </View>

//         <View style={{ width: 36 }} />
//       </View>

//       <FlatList
//         ref={listRef}
//         data={dataWithTyping}
//         keyExtractor={(m) => m.id}
//         renderItem={renderItem}
//         contentContainerStyle={[
//           styles.listContent,
//           { paddingBottom: insets.bottom + 72 },
//         ]}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//         onScrollToIndexFailed={() => {
//           // Handle scroll failure gracefully
//         }}
//       />

//       <View
//         style={[
//           styles.composer,
//           { paddingBottom: Math.max(spacing.md, insets.bottom) },
//         ]}
//       >
//         <View style={styles.composerInner}>
//           <View style={styles.leadingIcon}>
//             <Ionicons name="create-outline" size={18} color={palette.primary} />
//           </View>
//           <TextInput
//             style={styles.input}
//             placeholder="Write a message"
//             placeholderTextColor="#94A3B8"
//             value={input}
//             onChangeText={setInput}
//             editable={!isSending}
//             onSubmitEditing={onSend}
//             returnKeyType="send"
//           />
//           <Pressable
//             onPress={onSend}
//             disabled={isSending || !input.trim()}
//             style={({ pressed }) => [
//               styles.sendBtn,
//               (isSending || !input.trim()) && styles.sendBtnDisabled,
//               pressed &&
//                 Platform.select({
//                   ios: { opacity: 0.85 },
//                   default: { opacity: 0.9 },
//                 }),
//             ]}
//             accessibilityRole="button"
//             accessibilityLabel={isSending ? "Sending..." : "Send"}
//           >
//             <Ionicons name="send" size={18} color="#fff" />
//           </Pressable>
//         </View>
//       </View>

//       <FullScreenAnswerModal
//         visible={!!fullAnswer}
//         onClose={() => setFullAnswer(null)}
//         answer={fullAnswer?.answer ?? null}
//       />
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: "#F5F7FB" },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: spacing.xl,
//     paddingTop: spacing.lg,
//     paddingBottom: spacing.md,
//     backgroundColor: "#FFFFFF",
//     borderBottomColor: "#E7EBF3",
//     borderBottomWidth: 1,
//   },

//   backBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 12,
//     backgroundColor: "#FFFFFF",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },

//   titleWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
//   avatar: { width: 28, height: 28, borderRadius: 14 },
//   title: { fontSize: 16, fontWeight: "800", color: "#111827" },

//   listContent: {
//     paddingHorizontal: spacing.xl,
//     paddingVertical: spacing.md,
//     paddingBottom: 100,
//     gap: 10,
//   },

//   bubbleWrap: { flexDirection: "row" },
//   bubbleLeft: { justifyContent: "flex-start" },
//   bubbleRight: { justifyContent: "flex-end" },

//   bubble: {
//     maxWidth: "78%",
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 16,
//     gap: 6,
//   },

//   botBubble: {
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#EEF2F7",
//     borderBottomLeftRadius: 8,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 1,
//   },

//   userBubble: {
//     backgroundColor: "#6EA8FE",
//     borderBottomRightRadius: 8,
//     shadowColor: "#000",
//     shadowOpacity: 0.04,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 1 },
//     elevation: 1,
//   },

//   botText: { color: "#111827" },
//   userText: { color: "#fff" },

//   responseText: { fontSize: 15, lineHeight: 22 },
//   questionText: { marginTop: 2, opacity: 0.85, fontStyle: "italic" },

//   typeBadge: {
//     alignSelf: "flex-start",
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 999,
//     backgroundColor: "#F1F5F9",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//   },

//   typeBadgeText: { fontSize: 11, color: "#334155", fontWeight: "600" },

//   quickWrap: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//     marginTop: 4,
//   },

//   chip: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 999,
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//   },

//   chipWide: { maxWidth: "100%" },

//   chipText: { color: "#111827", fontSize: 13, fontWeight: "600" },

//   composer: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     paddingHorizontal: spacing.xl,
//     paddingBottom: Math.max(spacing.md, 0),
//     backgroundColor: "transparent",
//   },

//   composerInner: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "rgba(255, 255, 255, 0.7)",
//     borderRadius: 28,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     paddingLeft: 44,
//     paddingRight: 8,
//     height: 52,
//   },

//   leadingIcon: {
//     position: "absolute",
//     left: 10,
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "rgba(79, 70, 229, 0.06)",
//     borderWidth: 1,
//     borderColor: "rgba(79, 70, 229, 0.25)",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   input: {
//     flex: 1,
//     color: "#111827",
//     backgroundColor: "transparent",
//   },

//   sendBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: palette.primary,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   sendBtnDisabled: { opacity: 0.6 },

//   // Typing indicator
//   typingWrap: {
//     flexDirection: "row",
//     alignItems: "flex-end",
//     gap: 6,
//     paddingVertical: 2,
//   },

//   typingDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: "#94A3B8",
//   },

//   answerCard: {
//     marginTop: 6,
//     backgroundColor: "#F8FAFC",
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     borderLeftWidth: 4,
//     padding: 12,
//     gap: 8,
//     shadowOpacity: 0.04,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 1,
//   },
//   answerHeader: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     justifyContent: "space-between",
//     gap: 10,
//   },
//   answerIconWrap: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   answerHeaderTextWrap: {
//     flex: 1,
//     gap: 2,
//   },
//   answerTitleNew: {
//     fontSize: 16,
//     fontWeight: "800",
//     lineHeight: 20,
//     color: "#0F172A",
//   },
//   answerTextNew: {
//     fontSize: 14,
//     lineHeight: 20,
//     color: "#111827",
//     opacity: 0.95,
//   },
//   answerBody: {
//     marginTop: 4,
//   },
//   answerDetailsNew: {
//     fontSize: 13,
//     lineHeight: 18,
//     color: "#334155",
//     opacity: 0.9,
//     fontStyle: "italic",
//   },
//   severityPill: {
//     alignSelf: "flex-start",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 999,
//     borderWidth: 1,
//   },
//   severityPillText: {
//     fontSize: 11,
//     fontWeight: "700",
//   },
//   detailRow: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 8,
//     marginTop: 2,
//   },
//   detailDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     marginTop: 6,
//   },
//   answerActions: {
//     marginTop: 4,
//     flexDirection: "row",
//     justifyContent: "flex-end",
//   },
//   expandBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 999,
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     alignSelf: "flex-end",
//   },
//   expandText: {
//     fontSize: 12,
//     fontWeight: "700",
//   },

//   // Full-screen answer modal styles
//   fsRoot: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },

//   fsBackdrop: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },

//   fsContainer: {
//     width: "100%",
//     maxWidth: 400,
//     maxHeight: "80%",
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     overflow: "hidden",
//     elevation: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.25,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 4 },
//   },

//   fsHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E2E8F0",
//     backgroundColor: "#FFFFFF",
//   },

//   fsHeaderTitle: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#0F172A",
//     textAlign: "center",
//     marginHorizontal: 8,
//   },

//   fsIconWrap: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   fsCloseIconBtn: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "#F1F5F9",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   fsScrollView: {
//     flex: 1,
//   },

//   fsScrollContent: {
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     paddingBottom: 24,
//   },

//   fsTitle: {
//     fontSize: 20,
//     fontWeight: "800",
//     color: "#0F172A",
//     lineHeight: 26,
//     marginBottom: 8,
//   },

//   fsText: {
//     fontSize: 16,
//     color: "#334155",
//     lineHeight: 24,
//     marginBottom: 16,
//   },

//   fsDetails: {
//     marginTop: 8,
//   },

//   fsDetailsHeader: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#0F172A",
//     marginBottom: 12,
//   },

//   fsDetailRow: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     marginBottom: 8,
//     paddingLeft: 4,
//   },

//   fsDetailIcon: {
//     marginTop: 2,
//     marginRight: 2,
//   },

//   fsDetailText: {
//     flex: 1,
//     marginLeft: 8,
//     fontSize: 15,
//     lineHeight: 22,
//     color: "#475569",
//   },

//   fsFooter: {
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     borderTopWidth: 1,
//     borderTopColor: "#E2E8F0",
//     alignItems: "center",
//     backgroundColor: "#F8FAFC",
//   },

//   fsCloseBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#0F172A",
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 10,
//     minWidth: 120,
//     justifyContent: "center",
//   },

//   fsCloseText: {
//     color: "#FFFFFF",
//     fontSize: 15,
//     fontWeight: "600",
//     marginLeft: 6,
//   },
// });

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  Modal,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { spacing } from "@/design/styles";
import { useTheme } from "@/context/theme-context"; // added useTheme hook import
import { useChat } from "@/hooks/use-chat";
import { RestAdapter } from "@/chat/rest-adaptor";
import type { ChatMessage } from "@/chat/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Framer Motion-style animations for React Native
import { MotiView } from "moti";

const SEVERITY_META: Record<
  string,
  {
    color: string;
    bg: string;
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
  }
> = {
  info: {
    color: "#0891B2",
    bg: "rgba(8,145,178,0.08)",
    icon: "information-circle",
    label: "INFO",
  },
  warning: {
    color: "#D97706",
    bg: "rgba(217,119,6,0.08)",
    icon: "warning",
    label: "WARNING",
  },
  urgent: {
    color: "#DC2626",
    bg: "rgba(220,38,38,0.08)",
    icon: "alert-circle",
    label: "URGENT",
  },
};

function getSeverityMeta(kind?: string) {
  const key = (kind || "info").toLowerCase();
  return SEVERITY_META[key] ?? SEVERITY_META.info;
}

interface AnswerType {
  title?: string;
  text?: string;
  details?: string | string[];
  severity?: "info" | "warning" | "urgent" | string;
  final?: boolean;
}

function AnswerCard({
  answer,
  isUser,
  onExpand,
  themeColors, // added theme colors prop
}: {
  answer: AnswerType;
  isUser: boolean;
  onExpand?: () => void;
  themeColors: any; // added
}) {
  const meta = getSeverityMeta(answer?.severity);
  const detailsArray =
    typeof answer?.details === "string"
      ? [answer.details]
      : Array.isArray(answer?.details)
      ? answer.details
      : [];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 6, scale: 0.98 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ type: "timing", duration: 220 }}
      style={[
        {
          marginTop: 6,
          backgroundColor: themeColors.cardSecondary,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: themeColors.border,
          borderLeftWidth: 4,
          borderLeftColor: meta.color,
          padding: 12,
          gap: 8,
          shadowOpacity: 0.04,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
          elevation: 1,
        },
      ]}
      accessibilityRole="summary"
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <View
          style={[
            {
              width: 28,
              height: 28,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
            },
            { backgroundColor: meta.bg },
          ]}
        >
          <Ionicons name={meta.icon} size={18} color={meta.color} />
        </View>

        <View style={{ flex: 1, gap: 2 }}>
          {!!answer?.title && (
            <Text
              style={[
                { color: isUser ? "#fff" : themeColors.text },
                { fontSize: 16, fontWeight: "800", lineHeight: 20 },
              ]}
            >
              {answer.title}
            </Text>
          )}

          {!!answer?.text && (
            <Text
              style={[
                { color: isUser ? "#fff" : themeColors.text },
                { fontSize: 14, lineHeight: 20, opacity: 0.95 },
              ]}
            >
              {answer.text}
            </Text>
          )}
        </View>

        <View
          style={[
            {
              alignSelf: "flex-start",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: meta.color,
              backgroundColor: meta.bg,
            },
          ]}
        >
          <Text
            style={[{ fontSize: 11, fontWeight: "700", color: meta.color }]}
          >
            {meta.label}
          </Text>
        </View>
      </View>

      {detailsArray.length > 0 && (
        <View style={{ marginTop: 4 }}>
          {detailsArray.map((d, i) => (
            <View
              key={`${i}-${d}`}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 8,
                marginTop: 2,
              }}
            >
              <View
                style={[
                  { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
                  { backgroundColor: meta.color },
                ]}
              />
              <Text
                style={[
                  { color: isUser ? "#fff" : themeColors.textSecondary },
                  {
                    fontSize: 13,
                    lineHeight: 18,
                    opacity: 0.9,
                    fontStyle: "italic",
                  },
                ]}
              >
                {d}
              </Text>
            </View>
          ))}
        </View>
      )}

      {onExpand && (
        <View
          style={{
            marginTop: 4,
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Pressable
            onPress={onExpand}
            accessibilityRole="button"
            accessibilityLabel="View full answer"
            android_ripple={{ color: "rgba(0,0,0,0.06)" }}
            style={({ pressed }) => [
              {
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 999,
                backgroundColor: themeColors.card,
                borderWidth: 1,
                borderColor: themeColors.border,
                alignSelf: "flex-end",
              },
              pressed &&
                Platform.select({ ios: { opacity: 0.9 }, default: {} }),
            ]}
          >
            <Ionicons name="expand" size={14} color={meta.color} />
            <Text
              style={[{ fontSize: 12, fontWeight: "700", color: meta.color }]}
            >
              View details
            </Text>
          </Pressable>
        </View>
      )}
    </MotiView>
  );
}

function TypingIndicator() {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  const makeAnim = (val: Animated.Value, delay: number) =>
    Animated.loop(
      Animated.sequence([
        Animated.timing(val, {
          toValue: -6,
          duration: 280,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
          delay,
        }),
        Animated.timing(val, {
          toValue: 0,
          duration: 280,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

  useEffect(() => {
    const animations = dots.map((v, idx) => makeAnim(v, idx * 120));
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 6,
        paddingVertical: 2,
      }}
      accessibilityRole="text"
      accessibilityLabel="Assistant is typing"
      accessibilityLiveRegion="polite"
    >
      {dots.map((val, i) => (
        <Animated.View
          key={i}
          style={[
            {
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: "#94A3B8",
            },
            { transform: [{ translateY: val }] },
          ]}
        />
      ))}
    </View>
  );
}

function FullScreenAnswerModal({
  visible,
  onClose,
  answer,
  themeColors, // added theme colors
}: {
  visible: boolean;
  onClose: () => void;
  answer: AnswerType | null;
  themeColors: any; // added
}) {
  if (!answer) return null;

  const meta = getSeverityMeta(answer?.severity);
  const detailsArray =
    typeof answer?.details === "string"
      ? [answer.details]
      : Array.isArray(answer?.details)
      ? answer.details
      : [];

  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent={true}
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View
        style={[
          {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          },
        ]}
      >
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close full answer"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        <MotiView
          from={{ opacity: 0, translateY: 300 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: 300 }}
          transition={{ type: "timing", duration: 300 }}
          style={{
            width: "100%",
            maxWidth: 400,
            maxHeight: "80%",
            backgroundColor: themeColors.card,
            borderRadius: 16,
            overflow: "hidden",
            elevation: 10,
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: themeColors.border,
              backgroundColor: themeColors.card,
            }}
          >
            <View
              style={[
                {
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                },
                { backgroundColor: meta.bg },
              ]}
            >
              <Ionicons name={meta.icon} size={20} color={meta.color} />
            </View>

            <Text
              style={{
                flex: 1,
                fontSize: 16,
                fontWeight: "700",
                color: themeColors.text,
                textAlign: "center",
                marginHorizontal: 8,
              }}
            >
              Medical Assessment
            </Text>

            <View
              style={[
                {
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: meta.color,
                  backgroundColor: meta.bg,
                },
              ]}
            >
              <Text
                style={[{ fontSize: 11, fontWeight: "700", color: meta.color }]}
              >
                {meta.label}
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: themeColors.bgSecondary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="close" size={18} color={themeColors.textMuted} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingVertical: 16,
              paddingBottom: 24,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {!!answer?.title && (
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "800",
                  color: themeColors.text,
                  lineHeight: 26,
                  marginBottom: 8,
                }}
              >
                {answer.title}
              </Text>
            )}
            {!!answer?.text && (
              <Text
                style={{
                  fontSize: 16,
                  color: themeColors.textSecondary,
                  lineHeight: 24,
                  marginBottom: 16,
                }}
              >
                {answer.text}
              </Text>
            )}

            {detailsArray.length > 0 && (
              <View style={{ marginTop: 8 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: themeColors.text,
                    marginBottom: 12,
                  }}
                >
                  Details:
                </Text>
                {detailsArray.map((detail, idx) => (
                  <View
                    key={`${idx}-${detail}`}
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      marginBottom: 8,
                      paddingLeft: 4,
                    }}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={meta.color}
                      style={{ marginTop: 2, marginRight: 2 }}
                    />
                    <Text
                      style={{
                        flex: 1,
                        marginLeft: 8,
                        fontSize: 15,
                        lineHeight: 22,
                        color: themeColors.textSecondary,
                      }}
                    >
                      {detail}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderTopWidth: 1,
              borderTopColor: themeColors.border,
              alignItems: "center",
              backgroundColor: themeColors.bgSecondary,
            }}
          >
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close full answer"
              style={({ pressed }) => [
                {
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: themeColors.text,
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 10,
                  minWidth: 120,
                  justifyContent: "center",
                },
                pressed &&
                  Platform.select({
                    ios: { opacity: 0.85 },
                    default: { opacity: 0.9 },
                  }),
              ]}
            >
              <Ionicons
                name="close"
                size={18}
                color={themeColors.textInverse}
              />
              <Text
                style={{
                  color: themeColors.textInverse,
                  fontSize: 15,
                  fontWeight: "600",
                  marginLeft: 6,
                }}
              >
                Close
              </Text>
            </Pressable>
          </View>
        </MotiView>
      </View>
    </Modal>
  );
}

export default function ChatBotScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { palette: themeColors } = useTheme(); // get theme palette

  const initialMessages = useMemo<ChatMessage[]>(
    () => [
      {
        id: "m1",
        role: "assistant",
        content: {
          response: "Hello there!",
          question: "I am your health assistant. How can I help you today?",
          type: "text",
          answer: null,
        },
        createdAt: Date.now() - 600000,
      },
    ],
    []
  );

  const chatAdapter = useMemo(() => new RestAdapter(), []);
  const { messages, isSending, send } = useChat(chatAdapter, {
    initialMessages,
  });

  const [input, setInput] = useState("");
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
  const [fullAnswer, setFullAnswer] = useState<{
    id: string;
    answer: AnswerType;
  } | null>(null);
  const [shownFullForIds, setShownFullForIds] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        listRef.current?.scrollToEnd({ animated: true });
      } catch (error) {
        console.warn("Auto-scroll failed:", error);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [messages.length, isSending]);

  useEffect(() => {
    try {
      const last = [...messages]
        .reverse()
        .find((m) => m.role === "assistant" && (m as any).content?.answer) as
        | ChatMessage
        | undefined;

      const content: any = last?.content ?? {};
      const ans = content?.answer as AnswerType;

      if (last && ans && ans.final === true && !shownFullForIds.has(last.id)) {
        setFullAnswer({ id: last.id, answer: ans });
        setShownFullForIds((prev) => new Set(prev).add(last.id));
      }
    } catch (error) {
      console.warn("Error processing final answer:", error);
    }
  }, [messages, shownFullForIds]);

  const onSend = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    try {
      setInput("");
      await send(text);
    } catch (error) {
      console.error("Send error:", error);
    }
  };

  const normalizeType = (t?: string) => {
    const type = (t || "").toLowerCase().trim();
    if (type === "yes/no" || type === "yes-no" || type === "boolean")
      return "yes-no";
    if (type === "4options" || type === "likert-4" || type === "agree-4")
      return "likert-4";
    if (type === "typing") return "typing";
    return "text";
  };

  const markAnswered = (id: string) =>
    setAnsweredIds((prev) => new Set(prev).add(id));

  const handleQuickReply = async (messageId: string, value: string) => {
    if (isSending) return;
    try {
      markAnswered(messageId);
      await send(value);
    } catch (error) {
      console.error("Quick reply error:", error);
    }
  };

  const QuickReplies = ({ item }: { item: ChatMessage }) => {
    const t = normalizeType((item as any).content?.type);
    const isAssistant = item.role === "assistant";
    if (!isAssistant) return null;
    if (answeredIds.has(item.id)) return null;

    if (t === "yes-no") {
      const options = ["Yes", "No"];
      return (
        <MotiView
          from={{ opacity: 0, translateY: 6 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 200 }}
          accessibilityRole="menu"
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 4,
          }}
        >
          {options.map((opt, idx) => (
            <MotiView
              key={opt}
              from={{ opacity: 0, translateY: 6, scale: 0.98 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{ type: "timing", duration: 220, delay: idx * 40 }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Choose ${opt}`}
                onPress={() => handleQuickReply(item.id, opt)}
                disabled={isSending}
                android_ripple={{ color: "rgba(0,0,0,0.06)" }}
                style={({ pressed }) => [
                  {
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor: themeColors.card,
                    borderWidth: 1,
                    borderColor: themeColors.border,
                  },
                  pressed &&
                    Platform.select({ ios: { opacity: 0.9 }, default: {} }),
                ]}
              >
                <Text
                  style={{
                    color: themeColors.text,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  {opt}
                </Text>
              </Pressable>
            </MotiView>
          ))}
        </MotiView>
      );
    }

    if (t === "likert-4") {
      const options = [
        "Strongly agree",
        "Agree",
        "Disagree",
        "Strongly disagree",
      ];
      return (
        <MotiView
          from={{ opacity: 0, translateY: 6 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 200 }}
          accessibilityRole="menu"
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 4,
          }}
        >
          {options.map((opt, idx) => (
            <MotiView
              key={opt}
              from={{ opacity: 0, translateY: 6, scale: 0.98 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{ type: "timing", duration: 220, delay: idx * 40 }}
              style={{ maxWidth: "100%" }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Choose ${opt}`}
                onPress={() => handleQuickReply(item.id, opt)}
                disabled={isSending}
                android_ripple={{ color: "rgba(0,0,0,0.06)" }}
                style={({ pressed }) => [
                  {
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor: themeColors.card,
                    borderWidth: 1,
                    borderColor: themeColors.border,
                  },
                  pressed &&
                    Platform.select({ ios: { opacity: 0.9 }, default: {} }),
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    color: themeColors.text,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  {opt}
                </Text>
              </Pressable>
            </MotiView>
          ))}
        </MotiView>
      );
    }

    return null;
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: ChatMessage;
    index: number;
  }) => {
    const isUser = item.role === "user";
    const content: any = (item as any).content ?? {};
    const typeBadge = normalizeType(content.type);

    if (!isUser && typeBadge === "typing") {
      return (
        <MotiView
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: "timing", duration: 220 }}
          style={[{ flexDirection: "row" }, { justifyContent: "flex-start" }]}
        >
          <View
            style={[
              {
                maxWidth: "78%",
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: 16,
                gap: 6,
              },
              {
                backgroundColor: themeColors.card,
                borderWidth: 1,
                borderColor: themeColors.border,
                borderBottomLeftRadius: 8,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
                elevation: 1,
              },
            ]}
          >
            <TypingIndicator />
          </View>
        </MotiView>
      );
    }

    return (
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 240 }}
        style={[
          { flexDirection: "row" },
          isUser
            ? { justifyContent: "flex-end" }
            : { justifyContent: "flex-start" },
        ]}
      >
        <View
          style={[
            {
              maxWidth: "78%",
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 16,
              gap: 6,
            },
            isUser
              ? {
                  backgroundColor: themeColors.primary,
                  borderBottomRightRadius: 8,
                  shadowColor: "#000",
                  shadowOpacity: 0.04,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 1 },
                  elevation: 1,
                }
              : {
                  backgroundColor: themeColors.card,
                  borderWidth: 1,
                  borderColor: themeColors.border,
                  borderBottomLeftRadius: 8,
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 1,
                },
          ]}
        >
          {!isUser && typeBadge !== "text" ? (
            <View
              style={{
                alignSelf: "flex-start",
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 999,
                backgroundColor: themeColors.bgSecondary,
                borderWidth: 1,
                borderColor: themeColors.border,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: themeColors.textMuted,
                  fontWeight: "600",
                }}
              >
                {typeBadge === "yes-no"
                  ? "Yes / No"
                  : typeBadge === "likert-4"
                  ? "4-point scale"
                  : typeBadge}
              </Text>
            </View>
          ) : null}

          {content.response ? (
            <Text
              style={{
                color: isUser ? themeColors.textInverse : themeColors.text,
                fontSize: 15,
                lineHeight: 22,
              }}
            >
              {content.response}
            </Text>
          ) : null}

          {content.answer && typeof content.answer === "object" ? (
            <AnswerCard
              answer={content.answer}
              isUser={isUser}
              themeColors={themeColors}
              onExpand={() =>
                setFullAnswer({ id: item.id, answer: content.answer })
              }
            />
          ) : null}

          {content.question ? (
            <Text
              style={{
                color: isUser ? themeColors.textInverse : themeColors.text,
                fontSize: 15,
                marginTop: 2,
                opacity: 0.85,
                fontStyle: "italic",
              }}
            >
              {content.question}
            </Text>
          ) : null}

          {!isUser ? <QuickReplies item={item} /> : null}
        </View>
      </MotiView>
    );
  };

  const dataWithTyping = useMemo(() => {
    if (!isSending) return messages;
    const typingMessage: ChatMessage = {
      id: "typing",
      role: "assistant",
      content: { type: "typing" } as any,
      createdAt: Date.now(),
    };
    return [...messages, typingMessage];
  }, [isSending, messages]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: themeColors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.select({
        ios: insets.top + 8,
        android: insets.bottom + 20,
        default: 0,
      })}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.lg,
          paddingBottom: spacing.md,
          backgroundColor: themeColors.card,
          borderBottomColor: themeColors.border,
          borderBottomWidth: 1,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            backgroundColor: themeColors.card,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: themeColors.border,
          }}
          hitSlop={10}
          android_ripple={{ color: "rgba(0,0,0,0.06)" }}
        >
          <Ionicons name="chevron-back" size={22} color={themeColors.text} />
        </Pressable>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Image
            source={require("../../../assets/images/nutrizy-logo.png")}
            style={{ width: 28, height: 28, borderRadius: 14 }}
          />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "800",
              color: themeColors.text,
            }}
          >
            Laso-AI
          </Text>
        </View>

        <View style={{ width: 36 }} />
      </View>

      <FlatList
        ref={listRef}
        data={dataWithTyping}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.md,
          paddingBottom: 100,
          gap: 10,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScrollToIndexFailed={() => {}}
      />

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: spacing.xl,
          paddingBottom: Math.max(spacing.md, insets.bottom),
          backgroundColor: "transparent",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: themeColors.card,
            borderRadius: 28,
            borderWidth: 1,
            borderColor: themeColors.border,
            paddingLeft: 44,
            paddingRight: 8,
            height: 52,
            opacity: 0.95,
          }}
        >
          <View
            style={{
              position: "absolute",
              left: 10,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: themeColors.primaryBg,
              borderWidth: 1,
              borderColor: themeColors.primaryBorder,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={themeColors.primary}
            />
          </View>
          <TextInput
            style={{
              flex: 1,
              color: themeColors.text,
              backgroundColor: "transparent",
            }}
            placeholder="Write a message"
            placeholderTextColor={themeColors.textMuted}
            value={input}
            onChangeText={setInput}
            editable={!isSending}
            onSubmitEditing={onSend}
            returnKeyType="send"
          />
          <Pressable
            onPress={onSend}
            disabled={isSending || !input.trim()}
            style={({ pressed }) => [
              {
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: themeColors.primary,
                alignItems: "center",
                justifyContent: "center",
              },
              (isSending || !input.trim()) && { opacity: 0.6 },
              pressed &&
                Platform.select({
                  ios: { opacity: 0.85 },
                  default: { opacity: 0.9 },
                }),
            ]}
            accessibilityRole="button"
            accessibilityLabel={isSending ? "Sending..." : "Send"}
          >
            <Ionicons name="send" size={18} color={themeColors.textInverse} />
          </Pressable>
        </View>
      </View>

      <FullScreenAnswerModal
        visible={!!fullAnswer}
        onClose={() => setFullAnswer(null)}
        answer={fullAnswer?.answer ?? null}
        themeColors={themeColors}
      />
    </KeyboardAvoidingView>
  );
}
