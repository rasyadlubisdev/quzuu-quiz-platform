"use client"

import { useSearchParams } from "next/navigation"
import NavQuiz from "@/components/NavQuiz"
import RadioAnswer from "@/components/RadioAnswer"
import CheckboxAnswer from "@/components/CheckboxAnswer"
import ShortAnswer from "@/components/ShortAnswer"
// import DraggableAnser from "@/components/DraggableAnswer"
import ClickChipAnswer from "@/components/ClickChipAnswer"
import CodeShortAnswer from "@/components/CodeShortAnswer"
import FileAnswer from "@/components/FileAnswer"
import TrueFalseAnswer from "@/components/TrueFalseAnswer"

const QuizPage = () => {
    const searchParams = useSearchParams()
    const numberPage = searchParams.get("num")
    console.log(numberPage)
    const question = `Misalkan Pak Dengklek mempunyai sebuah potongan program

int x = 9;
int y = 5;

int res = x - y + x*y;

cout<<res<<endl;

Keluaran program di atas adalah ...

int x = 9;
int y = 5;

int res = x - y + x*y;

cout<<res<<endl;

Keluaran program di atas adalah ...
`
    // const handleSelect = (selectedOption: { id: number; label: string }) => {
    //     console.log('Selected Option:', selectedOption);
    // };

    const options = [
        { id: 1, order: 'A', label: 'Keluaran program adalah 2' },
        { id: 2, order: 'B', label: 'Keluaran program adalah 3' },
        { id: 3, order: 'C', label: 'Keluaran program adalah 4' },
    ]

    const tableStatements = [
        { id: 1, statement: 'Berdasarkan soal tersebut, Pak Dengklek mempunyai 250 bebek dan 100 ayam jantan.' },
        { id: 2, statement: 'Berdasarkan soal tersebut, Pak Dengklek mempunyai 250 bebek dan 100 ayam jantan.' },
        { id: 3, statement: 'Berdasarkan soal tersebut, Pak Dengklek mempunyai 250 bebek dan 100 ayam jantan.' },
        { id: 4, statement: 'Berdasarkan soal tersebut, Pak Dengklek mempunyai 250 bebek dan 100 ayam jantan.' },
        { id: 5, statement: 'Berdasarkan soal tersebut, Pak Dengklek mempunyai 250 bebek dan 100 ayam jantan.' },
    ]

    function renderTypeQuestion() {
        switch(numberPage) {
            case "2":
                return <CheckboxAnswer options={options} />
            case "3":
                return <ShortAnswer />
            case "4":
                return <ClickChipAnswer />
            case "5":
                return <CodeShortAnswer />
            case "6":
                return <FileAnswer />
            case "7":
                return <TrueFalseAnswer tableStatements={tableStatements} />
            default:
                return <RadioAnswer options={options} />
        }
    }

    return (
        <main className="quiz-page container bg-slate-100 text-slate-950 min-h-screen">
            <section className="head-info py-8">
                <h1 className="text-2xl font-bold">Try Out OSNK Informatika 2023</h1>
                <h3 className="text-xl font-normal">#Bagian A : Pilihan Ganda dan Isian</h3>
            </section>
            <section className="pb-10 grid grid-cols-1 lg:grid-cols-3 gap-y-8 lg:gap-x-8">
                <NavQuiz />
                <div className="display-quiz col-span-2 bg-white p-9 rounded-3xl text-slate-800 shadow">
                    <h1 className="text-2xl underline"># Question 1</h1>
                    <div className="mt-5 whitespace-pre-wrap">
                        {question}
                    </div>
                    <div className="select-answer-group mt-8">
                        {/* <RadioAnswer options={options} /> */}
                        {/* <ShortAnswer /> */}
                        {/* <ClickChipAnswer /> */}
                        {renderTypeQuestion()}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default QuizPage