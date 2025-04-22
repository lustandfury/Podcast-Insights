"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Plus } from "lucide-react"
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
}

interface ChatSidebarProps {
  insightId: string
  insightTitle: string
  onChatCreated: (chatId: string) => void
}

export function ChatSidebar({ insightId, insightTitle, onChatCreated }: ChatSidebarProps) {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize with a default chat if none exists
  useEffect(() => {
    if (chats.length === 0) {
      createNewChat()
    }
  }, [])

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chats, activeChatId])

  const createNewChat = () => {
    const newChatId = `chat-${Date.now()}`
    const newChat: Chat = {
      id: newChatId,
      title: "New Chat", // Default title, will be updated after first question
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content: `Hello! I'm your financial insights assistant. Ask me anything about "${insightTitle}" or related financial topics.`,
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    }

    setChats((prevChats) => [...prevChats, newChat])
    setActiveChatId(newChatId)
    onChatCreated(newChatId)
  }

  const updateChatTitle = (chatId: string, userMessage: string) => {
    // Only update title if this is the first user message
    const chat = chats.find((c) => c.id === chatId)
    if (chat && chat.messages.length === 1) {
      // Only welcome message exists
      const title = userMessage.slice(0, 10) + (userMessage.length > 10 ? "..." : "")
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              title,
            }
          }
          return chat
        }),
      )
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeChatId) return

    const activeChat = chats.find((chat) => chat.id === activeChatId)
    if (!activeChat) return

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    // Update chat title based on first question
    updateChatTitle(activeChatId, inputMessage)

    // Update the active chat with the new message
    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, userMessage],
        }
      }
      return chat
    })

    setChats(updatedChats)
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `I understand you're asking about "${inputMessage}". This is related to ${insightTitle}. Let me provide some insights based on the available information.`,
        timestamp: new Date(),
      }

      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              messages: [...chat.messages, assistantMessage],
            }
          }
          return chat
        }),
      )
      setIsTyping(false)
    }, 1500)
  }

  const activeChat = chats.find((chat) => chat.id === activeChatId)

  return (
    <div className="flex flex-col h-full">
      {/* Chat selector */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {chats.map((chat) => (
            <Button
              key={chat.id}
              variant={chat.id === activeChatId ? "secondary" : "outline"}
              size="sm"
              className="whitespace-nowrap"
              onClick={() => setActiveChatId(chat.id)}
            >
              {chat.title}
            </Button>
          ))}
          <Button variant="outline" size="icon" className="shrink-0" onClick={createNewChat}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        {activeChat ? (
          <div className="space-y-4">
            {activeChat.messages.map((message) => (
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
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a chat or create a new one
          </div>
        )}
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
            disabled={!activeChatId || isTyping}
          />
          <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || !activeChatId || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
