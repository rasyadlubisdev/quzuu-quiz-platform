"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { getQuestions, submitExamAnswers } from "@/lib/api" // Updated import

import RadioAnswer from "@/components/RadioAnswer"
import CheckboxAnswer from "@/components/CheckboxAnswer"
import ShortAnswer from "@/components/ShortAnswer"
import ClickChipAnswer from "@/components/ClickChipAnswer"
import CodeShortAnswer from "@/components/CodeShortAnswer"
import FileAnswer from "@/components/FileAnswer"
import TrueFalseAnswer from "@/components/TrueFalseAnswer"
import CodeEditorAnswer from "@/components/CodeEditorAnswer"

import NavQuiz from "@/components/NavQuiz"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"

type RadioOption = {
    id: number
    order: string
    label: string
}

type CheckboxOption = {
    id: number
    order: string
    label: string
}

interface Question {
    id: number
    question: string
    type: string
    options?: RadioOption[] | CheckboxOption[]
    statements?: { id: number; statement: string }[]
    correctAnswer?: any
    correctAnswerText?: string
    correctFileUrl?: string
}

type UserAnswers = Record<number, any>

const QuizContainer: React.FC<{ examId?: string; problemsetId?: string }> = ({
    examId = "",
    problemsetId = "",
}) => {
    const [questions, setQuestions] = useState<Question[]>([])
    const [userAnswers, setUserAnswers] = useState<UserAnswers>({})
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isReviewMode, setIsReviewMode] = useState(false)

    const searchParams = useSearchParams()
    const router = useRouter()
    const numberPage = searchParams.get("num")

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // For development purposes, we'll still use the dummy data
                // In production, this would be replaced with the API call
                if (process.env.NODE_ENV === "development") {
                    const res = await fetch("/dummyQuestions.json")
                    const data: Question[] = await res.json()
                    setQuestions(data)
                } else {
                    // // Use the API function in production
                    // // Use problemsetId parameter for fetching questions
                    // if (!problemsetId) {
                    //     throw new Error(
                    //         "Problem set ID is required to fetch questions",
                    //     )
                    // }

                    // // Define an interface for the questions response
                    // interface QuestionsResponse {
                    //     questions?: any[] // Ideally define a more specific Question interface
                    //     // Add other properties you expect in the response
                    // }

                    // const data = (await getQuestions(
                    //     problemsetId,
                    // )) as QuestionsResponse
                    // setQuestions(data.questions || [])
                    const res = await fetch("/dummyQuestions.json")
                    const data: Question[] = await res.json()
                    setQuestions(data)
                }
            } catch (error: any) {
                console.error("Error fetching questions:", error)
                toast({
                    variant: "destructive",
                    title: "Error fetching questions",
                    description: error.message || "Failed to load questions",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchQuestions()
    }, [problemsetId])

    const handleUpdateAnswer = (questionId: number, answerValue: any) => {
        setUserAnswers((prev) => ({
            ...prev,
            [questionId]: answerValue,
        }))
    }

    const handleSubmitAnswers = async () => {
        setIsSubmitting(true)

        try {
            // In development mode, just simulate an API call
            if (process.env.NODE_ENV === "development") {
                await new Promise((r) => setTimeout(r, 1000))
                setIsReviewMode(true)

                toast({
                    title: "Answers submitted",
                    description:
                        "Your answers have been submitted successfully",
                })
            } else {
                // In production mode, use the actual API
                // Use examId for submitting answers
                if (!examId) {
                    throw new Error("Exam ID is required to submit answers")
                }

                // Define an interface for the exam submission response
                interface ExamSubmissionResponse {
                    message?: string
                    success?: boolean
                    score?: number
                    // Add other properties you expect in the response
                }

                // Using submitExamAnswers instead of submitQuizAnswers
                const result = (await submitExamAnswers(
                    examId,
                    userAnswers,
                )) as ExamSubmissionResponse

                setIsReviewMode(true)

                toast({
                    title: "Answers submitted",
                    description:
                        result.message ||
                        "Your answers have been submitted successfully",
                })
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Submission failed",
                description:
                    error.message ||
                    "Failed to submit answers. Please try again.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderQuestionByType = (question: Question) => {
        const userAnswer = userAnswers[question.id]

        switch (question.type) {
            case "radio":
                return (
                    <RadioAnswer
                        options={question.options || []}
                        selectedOption={userAnswer}
                        correctOption={question.correctAnswer}
                        isReviewMode={isReviewMode}
                        onSelectOption={(optionId) =>
                            handleUpdateAnswer(question.id, optionId)
                        }
                    />
                )
            case "checkbox":
                return (
                    <CheckboxAnswer
                        options={question.options || []}
                        selectedOptions={userAnswer || []}
                        correctOptions={question.correctAnswer || []}
                        isReviewMode={isReviewMode}
                        onChangeOption={(optionIds) =>
                            handleUpdateAnswer(question.id, optionIds)
                        }
                    />
                )
            case "short":
                return (
                    <ShortAnswer
                        userInput={userAnswer || ""}
                        correctAnswerText={question.correctAnswerText || ""}
                        isReviewMode={isReviewMode}
                        onChange={(val) => handleUpdateAnswer(question.id, val)}
                    />
                )
            case "clickchip":
                return (
                    <ClickChipAnswer
                        correctAnswer={question.correctAnswer || []}
                        userSelected={userAnswer || []}
                        isReviewMode={isReviewMode}
                        onChange={(val) => handleUpdateAnswer(question.id, val)}
                    />
                )
            case "codeshort":
                return (
                    <CodeShortAnswer
                        correctAnswer={question.correctAnswer || []}
                        userSelected={userAnswer || []}
                        isReviewMode={isReviewMode}
                        onChange={(val) => handleUpdateAnswer(question.id, val)}
                    />
                )
            case "file":
                return (
                    <FileAnswer
                        userFileUrl={userAnswer || ""}
                        correctFileUrl={question.correctFileUrl || ""}
                        isReviewMode={isReviewMode}
                        onFileChange={(fileUrl) =>
                            handleUpdateAnswer(question.id, fileUrl)
                        }
                    />
                )
            case "truefalse":
                return (
                    <TrueFalseAnswer
                        statements={question.statements || []}
                        correctAnswer={question.correctAnswer || {}}
                        userAnswers={userAnswer || {}}
                        isReviewMode={isReviewMode}
                        onChange={(updatedObj) =>
                            handleUpdateAnswer(question.id, updatedObj)
                        }
                    />
                )
            case "codeeditor":
                return (
                    <CodeEditorAnswer
                        userCode={userAnswer || ""}
                        isReviewMode={isReviewMode}
                        onCodeChange={(code) =>
                            handleUpdateAnswer(question.id, code)
                        }
                    />
                )
            default:
                return <div>Tipe soal tidak dikenali</div>
        }
    }

    if (isLoading) return <div>Loading questions...</div>

    const currentNumber = numberPage ? parseInt(numberPage, 10) : 1
    const currentQuestion = questions.find((q) => q.id === currentNumber)

    if (!currentQuestion) {
        return <div>Tidak ada soal untuk nomor {currentNumber}</div>
    }

    const handleNavigate = (direction: "prev" | "next") => {
        if (direction === "prev" && currentNumber > 1) {
            router.push(
                `/event-details/1/start/analitika?num=${currentNumber - 1}`,
            )
        }
        if (direction === "next" && currentNumber < questions.length) {
            router.push(
                `/event-details/1/start/analitika?num=${currentNumber + 1}`,
            )
        }
    }

    return (
        <div className="pb-10 grid grid-cols-1 lg:grid-cols-3 gap-y-8 lg:gap-x-8">
            <NavQuiz
                totalQuestions={questions.length}
                basePath="/event-details/1/start/analitika"
                isReviewMode={isReviewMode}
                onSubmitAnswers={handleSubmitAnswers}
            />

            <div className="display-quiz col-span-2 bg-white p-9 rounded-3xl text-slate-800 shadow">
                {/* <h1 className="text-2xl underline mb-8">
                    # Question {currentQuestion.id}
                </h1> */}
                <div className="mb-4">
                    <span className="width-fit rounded-full font-bold bg-secondary text-white p-2.5">Question {currentQuestion.id}</span>
                </div>

                <p className="text-base mb-4">{currentQuestion.question}</p>

                {renderQuestionByType(currentQuestion)}

                {isReviewMode && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded">
                        <p className="text-yellow-600 font-semibold">
                            Anda sudah submit jawaban. Hasil di atas adalah
                            review.
                        </p>
                    </div>
                )}

                <div className="mt-8 flex justify-between">
                    <button
                        onClick={() => handleNavigate("prev")}
                        disabled={currentNumber === 1 || isSubmitting}
                        className={`flex items-center justify-center gap-2 py-2 px-4 rounded ${
                            currentNumber === 1 || isSubmitting
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-violet-500 text-white hover:bg-violet-800"
                        }`}
                    >
                        <FaArrowLeft />
                        Back
                    </button>
                    <button
                        onClick={() => handleNavigate("next")}
                        disabled={
                            currentNumber === questions.length || isSubmitting
                        }
                        className={`flex items-center justify-center gap-2 py-2 px-4 rounded ${
                            currentNumber === questions.length || isSubmitting
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-violet-500 text-white hover:bg-violet-800"
                        }`}
                    >
                        Next
                        <FaArrowRight />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default QuizContainer
