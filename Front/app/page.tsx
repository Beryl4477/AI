"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  ShoppingCart,
  Package,
  Send,
  Menu,
  ImageIcon,
  X,
  PlusCircle,
  MessageSquare,
  Search,
  User,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "@/hooks/use-mobile"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// 模拟对话数据结构
interface Conversation {
  id: string
  storeName: string
  storeAvatar: string
  lastMessage: string
  unread: number
  products: string[]
}

// 用户数据结构
interface UserProfile {
  name: string
  email: string
  avatar: string
  memberSince: string
}

// 消息数据结构
interface Message {
  text?: string
  image?: string
  sender: "user" | "store" | "amy"
}

export default function CustomerServiceChat() {
  const [showSplash, setShowSplash] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [activeStore, setActiveStore] = useState<Conversation | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [searchQuery, setSearchQuery] = useState("")
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [isChatInputEnabled, setIsChatInputEnabled] = useState(false)

  // 模拟对话数据
  const conversations: Conversation[] = [
    {
      id: "1",
      storeName: "Nautical Treasures",
      storeAvatar: "/placeholder.svg?height=40&width=40&text=NT",
      lastMessage: "Do you have any vintage compasses?",
      unread: 2,
      products: ["Vintage Compass", "Antique Map"],
    },
    {
      id: "2",
      storeName: "Ocean Apparel",
      storeAvatar: "/placeholder.svg?height=40&width=40&text=OA",
      lastMessage: "When will the new swimwear collection arrive?",
      unread: 0,
      products: ["Swimwear", "Beach Towels"],
    },
    {
      id: "3",
      storeName: "Sailor's Delight",
      storeAvatar: "/placeholder.svg?height=40&width=40&text=SD",
      lastMessage: "Is the captain's hat in stock?",
      unread: 1,
      products: ["Captain's Hat", "Sailor's Rope"],
    },
    {
      id: "4",
      storeName: "Voyage Essentials",
      storeAvatar: "/placeholder.svg?height=40&width=40&text=VE",
      lastMessage: "Do you offer waterproof bags?",
      unread: 0,
      products: ["Waterproof Bag", "Travel Journal"],
    },
    {
      id: "5",
      storeName: "Maritime Collectibles",
      storeAvatar: "/placeholder.svg?height=40&width=40&text=MC",
      lastMessage: "I'm looking for model ships.",
      unread: 3,
      products: ["Model Ship", "Nautical Decor"],
    },
  ]

  // 模拟用户数据
  const user: UserProfile = {
    name: "Jack Sparrow",
    email: "jack.sparrow@voyagemart.com",
    avatar: "/placeholder.svg?height=40&width=40",
    memberSince: "May 2021",
  }

  // 客服 Amy 数据
  const amy = {
    name: "Amy",
    avatar: "/placeholder.svg?height=40&width=40&text=Amy",
  }

  useEffect(() => {
    // Hide splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false)
      // 添加 Amy 的欢迎消息
      setMessages([
        {
          text: "Hi there! I'm Amy, your VoyageMart assistant. Choose a merchant to start shopping at VoyageMart!",
          sender: "amy",
        },
      ])
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Scroll to bottom of chat when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setSelectedImages((prev) => [...prev, ...newFiles])
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && selectedImages.length === 0) return

    // Create message objects for each image and text
    const newMessages: Message[] = []

    // Add text message if there's input
    if (input.trim()) {
      newMessages.push({ text: input, sender: "user" })
    }

    // Add image messages
    selectedImages.forEach((file) => {
      const imageUrl = URL.createObjectURL(file)
      newMessages.push({ image: imageUrl, sender: "user" })
    })

    // Update messages state
    setMessages([...messages, ...newMessages])

    // Clear input and selected images
    setInput("")
    setSelectedImages([])

    // Simulate bot response after a short delay
    setTimeout(() => {
      let botResponse = ""
      if (input.toLowerCase().includes("hello") || input.toLowerCase().includes("hi")) {
        botResponse = `Hello! Welcome to ${activeStore?.storeName || "VoyageMart"}. How can I help you today?`
      } else if (input.toLowerCase().includes("shipping")) {
        botResponse = "We offer free shipping on orders over $50. Standard shipping takes 3-5 business days."
      } else if (input.toLowerCase().includes("return")) {
        botResponse = "Our return policy allows returns within 30 days of purchase. Please keep the original packaging."
      } else if (selectedImages.length > 0) {
        botResponse = "Thank you for sharing the image. Our team will review it and get back to you shortly."
      } else {
        botResponse = "Thank you for your message. Our customer service team will get back to you shortly."
      }

      setMessages((prev) => [...prev, { text: botResponse, sender: activeStore ? "store" : "amy" }])
    }, 1000)
  }

  const handleStoreSelect = (storeId: string) => {
    const store = conversations.find((s) => s.id === storeId)
    if (store) {
      setActiveStore(store)
      setMessages([
        {
          text: `Welcome to ${store.storeName} customer service! How can we help you today?`,
          sender: "store",
        },
      ])
      setIsChatInputEnabled(true)
      if (isMobile) {
        setSidebarOpen(false)
      }
    }
  }

  const clearConversation = () => {
    setMessages([
      {
        text: "Hi there! I'm Amy, your VoyageMart assistant. Choose a merchant to start shopping at VoyageMart!",
        sender: "amy",
      },
    ])
    setActiveStore(null)
    setIsChatInputEnabled(false)
  }

  // 搜索功能
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.products.some((product) => product.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  if (showSplash) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-500 to-orange-700 text-white">
        <div className="animate-fade-in text-center p-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">VoyageMart</h1>
          <p className="text-xl md:text-3xl italic font-light">Set Sail for Endless Shopping Adventures</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-0"} bg-gray-900 text-white transition-all duration-300 ease-in-out overflow-hidden flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">VoyageMart</h1>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          className="mx-4 mb-4 text-white border-white/20 hover:bg-gray-800"
          onClick={clearConversation}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New chat
        </Button>
        {/* 搜索框 */}
        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search stores or products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-2 text-xs uppercase text-gray-400 font-semibold">Conversations</div>
          {filteredConversations.map((conv) => (
            <Button
              key={conv.id}
              variant="ghost"
              className={`w-full justify-start rounded-none h-16 px-4 hover:bg-gray-800 text-gray-300 hover:text-white ${
                activeStore?.id === conv.id ? "bg-orange-700 text-white" : ""
              }`}
              onClick={() => handleStoreSelect(conv.id)}
            >
              <Avatar className="h-10 w-10 mr-3">
                <img src={conv.storeAvatar || "/placeholder.svg"} alt={conv.storeName} className="rounded-full" />
              </Avatar>
              <div className="flex flex-col items-start overflow-hidden flex-1">
                <span className="truncate w-full text-left font-medium">{conv.storeName}</span>
                <span className="text-xs text-gray-400 truncate w-full text-left">{conv.lastMessage}</span>
              </div>
              {conv.unread > 0 && <Badge className="ml-2 bg-orange-500 text-white">{conv.unread}</Badge>}
            </Button>
          ))}
        </div>
        <div className="p-4 border-t border-gray-700">
          <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Shopping Cart
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mt-2 text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <Package className="mr-2 h-4 w-4" />
            My Orders
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            {!sidebarOpen && (
              <Button variant="ghost" size="icon" className="mr-2" onClick={() => setSidebarOpen(true)}>
                <Menu />
              </Button>
            )}
            {activeStore ? (
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <img
                    src={activeStore.storeAvatar || "/placeholder.svg"}
                    alt={activeStore.storeName}
                    className="rounded-full"
                  />
                </Avatar>
                <h2 className="font-semibold text-lg">{activeStore.storeName}</h2>
              </div>
            ) : (
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <img src={amy.avatar || "/placeholder.svg"} alt={amy.name} className="rounded-full" />
                </Avatar>
                <h2 className="font-semibold text-lg">Hi! Amy at your service</h2>
              </div>
            )}
          </div>
          {/* 用户头像和下拉菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="rounded-full" />
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowUserProfile(true)}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-end space-x-2`}
              >
                {msg.sender !== "user" && (
                  <Avatar className="h-8 w-8">
                    <img
                      src={msg.sender === "amy" ? amy.avatar : activeStore?.storeAvatar || "/placeholder.svg"}
                      alt={msg.sender === "amy" ? amy.name : activeStore?.storeName || "Store"}
                      className="rounded-full"
                    />
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] p-4 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-orange-100 rounded-br-none"
                      : "bg-white border border-gray-200 rounded-bl-none"
                  }`}
                >
                  {msg.text && <div className="text-sm md:text-base">{msg.text}</div>}
                  {msg.image && (
                    <div className="mt-2">
                      <img
                        src={msg.image || "/placeholder.svg"}
                        alt="User uploaded"
                        className="max-w-full rounded"
                        style={{ maxHeight: "200px" }}
                      />
                    </div>
                  )}
                </div>
                {msg.sender === "user" && (
                  <Avatar className="h-8 w-8">
                    <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="rounded-full" />
                  </Avatar>
                )}
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <MessageSquare className="h-12 w-12 mb-4 text-gray-400" />
              <p className="text-center text-lg font-light mb-2">No messages yet</p>
              <p className="text-center text-sm text-gray-400">Select a store or start a new chat to begin</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-white">
          {selectedImages.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto py-2">
              {selectedImages.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                    alt={`Preview ${index}`}
                    className="h-16 w-16 object-cover rounded-md border"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageSelect}
              ref={fileInputRef}
              disabled={!isChatInputEnabled}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-500 hover:text-orange-600 hover:border-orange-600"
              disabled={!isChatInputEnabled}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isChatInputEnabled ? "Type your message..." : "Choose a merchant to start chatting"}
              className="flex-1"
              disabled={!isChatInputEnabled}
            />
            <Button
              type="submit"
              disabled={!isChatInputEnabled || (input.trim() === "" && selectedImages.length === 0)}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* 用户资料对话框 */}
      <Dialog open={showUserProfile} onOpenChange={setShowUserProfile}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>Your account details and preferences.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="rounded-full" />
              </Avatar>
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Member Since</label>
              <p>{user.memberSince}</p>
            </div>
            {/* 这里可以添加更多用户资料信息 */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

