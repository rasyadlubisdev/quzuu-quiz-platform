"use client"

import NavQuiz from "@/components/NavQuiz"
import QuizContainer from "@/components/QuizContainer"

const QuizPage = () => {
  return (
    <main className="quiz-page container bg-slate-100 text-slate-950 min-h-screen">
      <section className="head-info py-8">
        <h1 className="text-2xl font-bold">Try Out OSNK Informatika 2023</h1>
        <h3 className="text-xl font-normal">
          #Bagian A : Pilihan Ganda dan Isian
        </h3>
      </section>
      <QuizContainer />
    </main>
  )
}

export default QuizPage
