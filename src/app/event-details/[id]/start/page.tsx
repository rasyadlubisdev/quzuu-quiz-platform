"use client"

import { useEffect, useState } from "react"
import styles from "./start.module.css"
import { usePathname } from "next/navigation"
import NavEvent from "@/components/NavEvent"
import SectionQuiz from "@/components/SectionQuiz"
import Link from "next/link"

interface SectionData {
  id: number
  title: string
  slug: string
  description: string
  isCompleted: boolean
  score: number
  correctCount: number
  wrongCount: number
  emptyCount: number
  reviewCount: number
  startTime: string | null
  endTime: string | null
  duration: string | null
}

const StartQuiz = () => {
  const pathname = usePathname()

  const [sections, setSections] = useState<SectionData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getSections = async () => {
      try {
        const res = await fetch("/dummySections.json")
        const data = await res.json()
        setSections(data)
      } catch (error) {
        console.error("Failed to fetch sections:", error)
      } finally {
        setIsLoading(false)
      }
    }
    getSections()
  }, [])

  if (isLoading) {
    return (
      <main className="container bg-slate-100 text-slate-950 min-h-screen">
        <section className="py-8">
          <h1 className="text-2xl font-bold mb-4">Loading section quiz...</h1>
        </section>
      </main>
    )
  }

  return (
    <main className="start-quiz-page container bg-slate-100 text-slate-950 min-h-screen">
      <section className="head-info py-8">
        <h1 className="text-2xl font-bold">Try Out OSNK Informatika 2023</h1>
        <h3 className="text-xl font-normal">Event Details</h3>
      </section>

      <section className="pb-10 grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-8">
        <NavEvent />

        <div
          className={`${styles["card-section-quiz"]} max-h-screen overflow-y-auto col-span-2 p-2`}
        >
          {sections.map((section) => (
            <Link
              key={section.id}
              href={`${pathname}/${section.slug}`}
              className="block"
            >
              <SectionQuiz section={section} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

export default StartQuiz
