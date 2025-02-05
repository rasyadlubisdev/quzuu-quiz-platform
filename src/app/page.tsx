"use client"

import React, { useEffect, useState } from "react"
import { getEventList } from "@/lib/api"
import { Events, columns } from "@/components/table-events/columns"
import { DataTable } from "@/components/table-events/DataTable"
import CardPrivateEvent from "@/components/CardPrivateEvent"
import CardInformation from "@/components/CardInformation"

export default function Home() {
    const [data, setData] = useState<Events[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        getEventList()
            .then((res) => {
                setData(res)
            })
            .catch((err) => {
                console.error(err)
                setError(err.message || "Failed to fetch events.")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <main className="home-page container bg-slate-100 text-slate-950">
                <section className="py-11">
                    <h1 className="text-2xl font-normal">Loading events...</h1>
                </section>
            </main>
        )
    }

    if (error) {
        return (
            <main className="home-page container bg-slate-100 text-slate-950">
                <section className="py-11">
                    <h1 className="text-2xl font-normal text-red-600">
                        Error: {error}
                    </h1>
                </section>
            </main>
        )
    }

    // console.log(data.data[0])

    return (
        <main className="home-page container bg-slate-100 text-slate-950">
            <section className="greetings py-11">
                <h1 className="text-2xl font-normal">
                    👋 Welcome Back{" "}
                    <span className="font-bold">Abdan Hafidz</span>
                </h1>
            </section>

            <section className="pb-10 grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-8">
                <DataTable columns={columns} data={data?.data} />

                <aside>
                    <CardPrivateEvent />
                    <CardInformation />
                </aside>
            </section>
        </main>
    )
}
