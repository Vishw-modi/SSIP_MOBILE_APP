import { useCallback, useState } from "react"
import { ID } from "react-native-appwrite"
import type { ChatAdapter, ChatMessage } from "@/chat/types"

type Options = {
  initialMessages?: ChatMessage[]
}

export function useChat(adapter: ChatAdapter, options?: Options) {
  const [messages, setMessages] = useState<ChatMessage[]>(options?.initialMessages ?? [])
  const [isSending, setIsSending] = useState(false)

  const send = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = {
        id: ID.unique(),
        role: "user",
        content: {response: text, question: null, type: null, answer: null },
        createdAt: Date.now(),
      }
      setMessages((prev) => [...prev, userMsg])

      setIsSending(true)
      try {
        const reply = await adapter.send([...messages, userMsg])
        const botMsg: ChatMessage = {
          id: ID.unique(),
          role: "assistant",
          content: {response: reply.response, question: reply.question, type: reply.type, answer: reply.answer },
          createdAt: Date.now(),
        }
        setMessages((prev) => [...prev, botMsg])
      } finally {
        setIsSending(false)
      }
    },
    [adapter, messages],
  )

  return { messages, isSending, send, setMessages }
}
