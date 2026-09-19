"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { Card, CardBody, Input, Button, Divider } from "@nextui-org/react"
import { FiSave } from "react-icons/fi"
import { showSuccess, showError } from "@/utils/sweetalert"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://backendapi.emcc-lab.com/api"

const emptyForm = {
    phone: "",
    whatsapp: "",
    email: "",
    admin_notification_email: "",
    address: "",
    map_lat: "",
    map_lng: "",
    business_hours: "",
    facebook_url: "",
    twitter_url: "",
    instagram_url: "",
    linkedin_url: "",
    youtube_url: "",
    tiktok_url: "",
}

export default function AdminSettings() {
    const [form, setForm] = useState(emptyForm)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const authHeaders = () => ({
        headers: { Authorization: `Bearer ${Cookies.get("admin_token")}` },
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${API_BASE}/admin/settings`, authHeaders())
            setForm({ ...emptyForm, ...response.data })
        } catch (error) {
            console.error("Error fetching settings:", error)
            showError("Error", "Failed to load settings")
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            await axios.put(`${API_BASE}/admin/settings`, form, authHeaders())
            showSuccess("Saved", "Settings updated successfully")
            fetchSettings()
        } catch (error) {
            console.error("Error saving settings:", error)
            showError("Error", error.response?.data?.error || "Failed to save settings")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading settings...</div>
    }

    return (
        <div className="p-4 space-y-6">
            <div>
                <p className="text-gray-500 mt-1">
                    This contact info is used everywhere — the footer, the Contact page, the contact widget,
                    and the chatboard's answers all pull from here.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardBody className="space-y-4">
                        <h3 className="text-lg font-semibold">Contact Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="Phone" placeholder="+255 717 275 661" value={form.phone} onChange={handleChange("phone")} />
                            <Input label="WhatsApp Number" placeholder="255717275661" value={form.whatsapp} onChange={handleChange("whatsapp")} />
                            <Input label="Public Email" type="email" value={form.email} onChange={handleChange("email")} />
                            <Input
                                label="Contact-form Notification Email"
                                type="email"
                                description="Where messages from the Contact page get sent (in addition to info@emcc-lab.com)"
                                value={form.admin_notification_email}
                                onChange={handleChange("admin_notification_email")}
                            />
                            <Input label="Address" value={form.address} onChange={handleChange("address")} className="sm:col-span-2" />
                            <Input label="Business Hours" placeholder="Mon-Fri: 9AM - 6PM" value={form.business_hours} onChange={handleChange("business_hours")} className="sm:col-span-2" />
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="space-y-4">
                        <h3 className="text-lg font-semibold">Map Location</h3>
                        <p className="text-sm text-gray-500">
                            Find your coordinates on Google Maps: right-click your location → the latitude/longitude
                            numbers appear at the top of the menu.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="Latitude" placeholder="-6.792354" value={form.map_lat ?? ""} onChange={handleChange("map_lat")} />
                            <Input label="Longitude" placeholder="39.208328" value={form.map_lng ?? ""} onChange={handleChange("map_lng")} />
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="space-y-4">
                        <h3 className="text-lg font-semibold">Social Media Links</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="Facebook URL" value={form.facebook_url} onChange={handleChange("facebook_url")} />
                            <Input label="Twitter / X URL" value={form.twitter_url} onChange={handleChange("twitter_url")} />
                            <Input label="Instagram URL" value={form.instagram_url} onChange={handleChange("instagram_url")} />
                            <Input label="LinkedIn URL" value={form.linkedin_url} onChange={handleChange("linkedin_url")} />
                            <Input label="YouTube URL" value={form.youtube_url} onChange={handleChange("youtube_url")} />
                            <Input label="TikTok URL" value={form.tiktok_url} onChange={handleChange("tiktok_url")} />
                        </div>
                        <p className="text-xs text-gray-400">Leave a field blank to hide that icon in the footer.</p>
                    </CardBody>
                </Card>

                <div className="flex justify-end">
                    <Button color="primary" type="submit" isLoading={isSaving} startContent={!isSaving && <FiSave />}>
                        Save Settings
                    </Button>
                </div>
            </form>
        </div>
    )
}
