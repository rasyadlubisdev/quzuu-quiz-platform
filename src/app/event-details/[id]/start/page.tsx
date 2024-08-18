import NavEvent from "@/components/NavEvent"
import SectionQuiz from "@/components/SectionQuiz"

const StartQuiz = () => {
    return (
        <main className="start-quiz-page container bg-slate-100 text-slate-950 min-h-screen">
            <section className="head-info py-8">
                <h1 className="text-2xl font-bold">Try Out OSNK Informatika 2023</h1>
                <h3 className="text-xl font-normal">Event Details</h3>
            </section>
            <section className="pb-10 grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-8">
                <NavEvent />
                {/* <div className="display-event-overview col-span-2 bg-white p-9 rounded-3xl text-slate-800 shadow">
                    
                </div> */}
                <div className="max-h-screen overflow-y-auto col-span-2 p-2">
                    <SectionQuiz />
                    <SectionQuiz />
                    <SectionQuiz />
                    <SectionQuiz />
                    <SectionQuiz />
                    <SectionQuiz />
                    <SectionQuiz />
                    <SectionQuiz />
                    <SectionQuiz />
                    <SectionQuiz />
                    <SectionQuiz />
                </div>
            </section>
        </main>
    )
}

export default StartQuiz