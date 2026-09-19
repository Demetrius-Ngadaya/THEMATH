"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import {
    Card,
    CardBody,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Spinner,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Tabs,
    Tab,
    Textarea,
} from "@nextui-org/react"
import { FiEye, FiCheck, FiTrash2, FiMessageSquare } from "react-icons/fi"
import { showSuccess, showError, showConfirm } from "@/utils/sweetalert"

import { API_BASE_URL as API_BASE } from "@/utils/apiConfig"

export default function AdminChatConversations() {
    const [conversations, setConversations] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState("needs_reply")
    const [page, setPage] = useState(1)
    const [active, setActive] = useState(null)
    const [replyText, setReplyText] = useState("")
    const [isSending, setIsSending] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()

    const authHeaders = () => ({
        headers: { Authorization: `Bearer ${Cookies.get("admin_token")}` },
    })

    useEffect(() => {
        fetchConversations()
        const interval = setInterval(fetchConversations, 20000)
        return () => clearInterval(interval)
    }, [filter, page])

    const fetchConversations = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${API_BASE}/admin/chat/conversations`, {
                ...authHeaders(),
                params: { filter, page },
            })
            setConversations(response.data.data || response.data)
        } catch (error) {
            console.error("Error fetching conversations:", error)
            showError("Error", "Failed to fetch chat conversations")
        } finally {
            setIsLoading(false)
        }
    }

    const openConversation = async (conv) => {
        try {
            const response = await axios.get(`${API_BASE}/admin/chat/conversations/${conv.id}`, authHeaders())
            setActive(response.data)
            setReplyText("")
            onOpen()
        } catch (error) {
            showError("Error", "Failed to load conversation")
        }
    }

    const sendReply = async () => {
        if (!replyText.trim()) return
        setIsSending(true)
        try {
            await axios.post(`${API_BASE}/admin/chat/conversations/${active.id}/reply`, { message: replyText }, authHeaders())
            const response = await axios.get(`${API_BASE}/admin/chat/conversations/${active.id}`, authHeaders())
            setActive(response.data)
            setReplyText("")
            fetchConversations()
        } catch (error) {
            showError("Error", "Failed to send reply")
        } finally {
            setIsSending(false)
        }
    }

    const resolveConversation = async (id) => {
        try {
            await axios.post(`${API_BASE}/admin/chat/conversations/${id}/resolve`, {}, authHeaders())
            showSuccess("Resolved", "Conversation marked as resolved")
            fetchConversations()
            onClose()
        } catch (error) {
            showError("Error", "Failed to resolve conversation")
        }
    }

    const deleteConversation = async (id) => {
        const result = await showConfirm("Delete Conversation", "This will permanently delete this chat history.")
        if (result.isConfirmed) {
            try {
                await axios.delete(`${API_BASE}/admin/chat/conversations/${id}`, authHeaders())
                showSuccess("Deleted", "Conversation deleted")
                fetchConversations()
            } catch (error) {
                showError("Error", "Failed to delete conversation")
            }
        }
    }

    const lastMessage = (conv) => conv.messages && conv.messages.length ? conv.messages[0].message : "—"

    return (
        <div>
            <div className="flex justify-between items-center mb-4 mt-4 px-4">
                <p className="text-gray-500 mt-1">Website chatboard conversations with visitors</p>
                <Tabs selectedKey={filter} onSelectionChange={(k) => { setFilter(k); setPage(1) }}>
                    <Tab key="needs_reply" title="Needs Your Reply" />
                    <Tab key="resolved" title="Resolved" />
                    <Tab key="all" title="All" />
                </Tabs>
            </div>

            <Card>
                <CardBody>
                    <div className="overflow-x-auto">
                        <Table aria-label="Chat conversations table">
                            <TableHeader>
                                <TableColumn>SESSION</TableColumn>
                                <TableColumn>PHONE</TableColumn>
                                <TableColumn>PAGE</TableColumn>
                                <TableColumn>LAST MESSAGE</TableColumn>
                                <TableColumn>MESSAGES</TableColumn>
                                <TableColumn>STATUS</TableColumn>
                                <TableColumn>LAST ACTIVITY</TableColumn>
                                <TableColumn>ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody
                                isLoading={isLoading}
                                loadingContent={<Spinner label="Loading conversations..." />}
                                emptyContent="No conversations found"
                            >
                                {conversations.map((conv) => (
                                    <TableRow key={conv.id}>
                                        <TableCell>
                                            <code className="text-xs">{conv.session_id.slice(0, 12)}...</code>
                                        </TableCell>
                                        <TableCell className="max-w-[160px] truncate">{conv.page_url || "—"}</TableCell>
                                        <TableCell>
                                            {conv.customer_phone ? (
                                                <a href={`tel:${conv.customer_phone}`} className="text-blue-600 font-medium hover:underline">
                                                    {conv.customer_phone}
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-[280px] truncate">{lastMessage(conv)}</TableCell>
                                        <TableCell>{conv.messages_count}</TableCell>
                                        <TableCell>
                                            {conv.needs_admin_reply && !conv.is_resolved && (
                                                <Chip size="sm" color="danger" variant="flat">Needs reply</Chip>
                                            )}
                                            {conv.is_resolved && (
                                                <Chip size="sm" color="success" variant="flat">Resolved</Chip>
                                            )}
                                            {!conv.needs_admin_reply && !conv.is_resolved && (
                                                <Chip size="sm" color="default" variant="flat">Handled by AI</Chip>
                                            )}
                                        </TableCell>
                                        <TableCell>{conv.last_message_at ? new Date(conv.last_message_at).toLocaleString() : "—"}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="light" isIconOnly onPress={() => openConversation(conv)} title="View / Reply">
                                                    <FiEye className="h-4 w-4 text-blue-600" />
                                                </Button>
                                                <Button size="sm" variant="light" isIconOnly onPress={() => deleteConversation(conv.id)} title="Delete">
                                                    <FiTrash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardBody>
            </Card>

            <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
                <ModalContent>
                    <ModalHeader className="flex items-center gap-2">
                        <FiMessageSquare /> Conversation
                        {active?.customer_phone && (
                            <a
                                href={`tel:${active.customer_phone}`}
                                className="ml-2 text-sm font-medium text-blue-600 hover:underline"
                            >
                                📞 {active.customer_phone}
                            </a>
                        )}
                    </ModalHeader>
                    <ModalBody>
                        {active && (
                            <div className="space-y-3">
                                {active.messages.map((m) => (
                                    <div
                                        key={m.id}
                                        className={`max-w-[80%] p-3 rounded-lg text-sm ${
                                            m.sender === "visitor"
                                                ? "bg-gray-100 mr-auto"
                                                : m.sender === "admin"
                                                ? "bg-blue-600 text-white ml-auto"
                                                : "bg-purple-100 ml-auto"
                                        }`}
                                    >
                                        <p className="text-xs opacity-60 mb-1 capitalize">
                                            {m.sender === "bot" ? `AI (${m.source || "auto"})` : m.sender}
                                        </p>
                                        <p>{m.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter className="flex-col items-stretch gap-2">
                        <Textarea
                            placeholder="Type a reply to the visitor..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            minRows={2}
                        />
                        <div className="flex justify-end gap-2">
                            {active && !active.is_resolved && (
                                <Button variant="flat" color="success" startContent={<FiCheck />} onPress={() => resolveConversation(active.id)}>
                                    Mark Resolved
                                </Button>
                            )}
                            <Button color="primary" isLoading={isSending} onPress={sendReply}>
                                Send Reply
                            </Button>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}
