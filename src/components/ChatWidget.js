"use client"

import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HiOutlineChatAlt2, HiOutlineX, HiOutlinePaperAirplane } from "react-icons/hi"

import { API_BASE_URL as API_BASE } from "@/utils/apiConfig"

function getSessionId() {
    if (typeof window === "undefined") return null
    let id = localStorage.getItem("chat_session_id")
    if (!id) {
        id = "sess_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10)
        localStorage.setItem("chat_session_id", id)
    }
    return id
}

export default function ChatWidget() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { sender: "bot", message: "Habari! / Hello! Ask me anything about our products, services, or research — or just say hi." },
    ])
    const [input, setInput] = useState("")
    const [isSending, setIsSending] = useState(false)
    const bottomRef = useRef(null)

    // Never show the widget on admin pages.
    const isAdminRoute = pathname && pathname.startsWith("/admin")

    useEffect(() => {
        if (isAdminRoute) return
        const sessionId = getSessionId()
        if (!sessionId) return
        axios
            .get(`${API_BASE}/chat/history/${sessionId}`)
            .then((res) => {
                if (res.data.messages && res.data.messages.length) {
                    setMessages(
                        res.data.messages.map((m) => ({ sender: m.sender === "visitor" ? "user" : "bot", message: m.message }))
                    )
                }
            })
            .catch(() => {})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isOpen])

    if (isAdminRoute) {
        return null
    }

    const startNewConversation = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("chat_session_id")
        }
        setMessages([
            { sender: "bot", message: "Habari! / Hello! Ask me anything about our products, services, or research — or just say hi." },
        ])
        setInput("")
    }

    const send = async () => {
        const text = input.trim()
        if (!text || isSending) return

        setMessages((prev) => [...prev, { sender: "user", message: text }])
        setInput("")
        setIsSending(true)

        try {
            const response = await axios.post(`${API_BASE}/chat/ask`, {
                session_id: getSessionId(),
                message: text,
                page_url: typeof window !== "undefined" ? window.location.pathname : "",
            })
            setMessages((prev) => [...prev, { sender: "bot", message: response.data.reply }])
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", message: "Sorry, something went wrong. Please try again in a moment." },
            ])
        } finally {
            setIsSending(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            send()
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-80 sm:w-96 h-[28rem] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 flex justify-between items-center">
                            <span className="text-white font-semibold">Chat with us</span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={startNewConversation}
                                    className="text-white/80 hover:text-white text-xs underline"
                                    title="Start a new conversation"
                                >
                                    New chat
                                </button>
                                <button onClick={() => setIsOpen(false)} className="text-white/90 hover:text-white">
                                    <HiOutlineX className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                                        m.sender === "user"
                                            ? "bg-purple-600 text-white ml-auto rounded-br-sm"
                                            : "bg-gray-100 dark:bg-gray-800 dark:text-gray-100 mr-auto rounded-bl-sm"
                                    }`}
                                >
                                    {m.message}
                                </div>
                            ))}
                            {isSending && (
                                <div className="bg-gray-100 dark:bg-gray-800 mr-auto px-3 py-2 rounded-2xl text-sm text-gray-400">
                                    Typing...
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        <div className="p-3 border-t border-gray-200 dark:border-gray-800 flex gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your question..."
                                className="flex-1 px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                onClick={send}
                                disabled={isSending}
                                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 disabled:opacity-50"
                            >
                                <HiOutlinePaperAirplane className="h-5 w-5 rotate-90" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative">
                {!isOpen && (
                    <>
                        <span className="absolute inset-0 rounded-full bg-purple-500 opacity-75 animate-ping" />
                        <span className="absolute inset-0 rounded-full bg-purple-500 opacity-40 animate-pulse" />
                    </>
                )}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen((v) => !v)}
                    className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-4 shadow-xl"
                >
                    {isOpen ? <HiOutlineX className="h-6 w-6" /> : <HiOutlineChatAlt2 className="h-6 w-6" />}
                </motion.button>
            </div>
        </div>
    )
}
