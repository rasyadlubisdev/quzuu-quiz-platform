"use client"

import React, { useState, useEffect } from "react"
import NavEvent from "@/components/NavEvent"
import { useParams } from "next/navigation"
import { getEventDetails, getUserProfile } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

const EventOverview = () => {
    const { id } = useParams()
    const { user } = useAuth() // Get user data from auth context
    const [eventData, setEventData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return

        const fetchEventDetails = async () => {
            setLoading(true)
            setError(null)
            try {
                // First get the current user's account ID if not available in auth context
                let accountId = user?.id

                if (!accountId) {
                    try {
                        const userProfile: any = await getUserProfile()
                        accountId = userProfile.id
                    } catch (profileError) {
                        console.error(
                            "Error fetching user profile:",
                            profileError,
                        )
                        // Continue with null accountId as a fallback
                    }
                }

                if (!accountId) {
                    throw new Error(
                        "User account ID is required to fetch event details",
                    )
                }

                // Get event details with both the event ID and account ID
                const response = await getEventDetails(id as string, accountId)
                console.log("Event Details:", response)

                // Since the API now returns the data directly (after being processed by handleApiResponse)
                setEventData(response)
            } catch (err: any) {
                console.error("Error fetching event details:", err)
                setError(err.message || "Failed to fetch event details")
            } finally {
                setLoading(false)
            }
        }

        fetchEventDetails()
    }, [id, user])

    if (loading)
        return (
            <main className="event-overview-page container bg-slate-100 text-slate-950 min-h-screen">
                <section className="head-info py-8">
                    <h1 className="text-2xl font-bold">Loading Event...</h1>
                </section>
            </main>
        )

    if (error)
        return (
            <main className="event-overview-page container bg-slate-100 text-slate-950 min-h-screen">
                <section className="head-info py-8">
                    <h1 className="text-2xl font-bold text-red-600">Error</h1>
                    <p className="text-red-500">{error}</p>
                </section>
            </main>
        )

    return (
        <main className="event-overview-page container bg-slate-100 text-slate-950 min-h-screen">
            <section className="head-info py-8">
                <h1 className="text-2xl font-bold">
                    {eventData?.title || "Try Out OSNK Informatika 2023"}
                </h1>
                <h3 className="text-xl font-normal">Event Details</h3>
            </section>
            <section className="pb-10 grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-8">
                <NavEvent />
                <div className="display-event-overview col-span-2 bg-white p-9 rounded-3xl text-slate-800 shadow">
                    <h1 className="text-2xl underline">Event Overview</h1>

                    {eventData?.description ? (
                        <div
                            className="mt-5"
                            dangerouslySetInnerHTML={{
                                __html: eventData.description,
                            }}
                        />
                    ) : (
                        <ol className="list-decimal mt-5 ml-5">
                            <li>
                                Soal Ujian terdiri dari 2 jenis. Bagian A : Soal
                                Pilihan Ganda dan Isian
                            </li>
                            <li>Dan Bagian B : Soal Membuat Program</li>
                            <li>
                                Lorem ipsum dolar si amet Lorem ipsum dolar si
                                ametLorem ipsum dolar si amet
                            </li>
                            <li>
                                Lorem ipsum dolar si amet Lorem ipsum dolar si
                                ametLorem ipsum dolar si amet
                            </li>
                        </ol>
                    )}

                    {eventData && (
                        <div className="mt-8">
                            <div className="bg-violet-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg mb-2">
                                    Event Information
                                </h3>
                                <p>
                                    <strong>Start Date:</strong>{" "}
                                    {new Date(
                                        eventData.start_event,
                                    ).toLocaleString()}
                                </p>
                                <p>
                                    <strong>End Date:</strong>{" "}
                                    {new Date(
                                        eventData.end_event,
                                    ).toLocaleString()}
                                </p>
                                <p>
                                    <strong>Type:</strong>{" "}
                                    {eventData.is_public
                                        ? "Public Event"
                                        : "Private Event"}
                                </p>
                                {eventData.event_code && (
                                    <p>
                                        <strong>Event Code:</strong>{" "}
                                        {eventData.event_code}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

export default EventOverview
