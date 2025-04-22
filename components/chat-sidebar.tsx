"use client"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface Chat {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  hasUserMessage: boolean
}

interface ChatSidebarProps {
  insightId: string
  insightTitle: string
  onChatCreated: (chatId: string, hasUserMessage: boolean) => void
}

export function ChatSidebar({ insightId, insightTitle, onChatCreated }: ChatSidebarProps) {
  const [chat, setChat] = useState<Chat | null>(null)
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize with a default chat if none exists
  useEffect(() => {
    if (!chat) {
      createNewChat()
    }
  }, [])

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chat])

  const createNewChat = () => {
    const newChatId = `chat-${Date.now()}`
    const newChat: Chat = {
      id: newChatId,
      title: "Chat", // Default title
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content: `Hello! I'm your financial insights assistant. Ask me anything about "${insightTitle}" or related financial topics.`,
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      hasUserMessage: false,
    }

    setChat(newChat)
    onChatCreated(newChatId, false) // Initially no user messages
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !chat) return

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    // Update the chat with the new message and mark as having user message
    const updatedChat = {
      ...chat,
      messages: [...chat.messages, userMessage],
      hasUserMessage: true,
    }

    setChat(updatedChat)
    setInputMessage("")
    setIsTyping(true)

    // Notify parent that this chat now has a user message
    onChatCreated(chat.id, true)

    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `I understand you're asking about "${inputMessage}". This is related to ${insightTitle}. Let me provide some insights based on the available information.`,
        timestamp: new Date(),
      }

      setChat((prevChat) => {
        if (!prevChat) return null
        return {
          ...prevChat,
          messages: [...prevChat.messages, assistantMessage],
        }
      })
      setIsTyping(false)
    }, 1500)
  }

  if (!chat) return null

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b">
        <h2 className="font-medium">Chat about this insight</h2>
      </div>

      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {chat.messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                <p>Typing...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            placeholder="Ask about this insight..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            className="resize-none min-h-[44px] max-h-[120px]"
            rows={1}
            disabled={isTyping}
          />
          <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
