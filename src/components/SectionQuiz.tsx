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

type SectionQuizProps = {
    section: SectionData
}

const SectionQuiz: React.FC<SectionQuizProps> = ({ section }) => {
    const {
        title,
        description,
        isCompleted,
        score,
        correctCount,
        wrongCount,
        emptyCount,
        reviewCount,
        startTime,
        endTime,
        duration,
    } = section

    const containerStyle = isCompleted
        ? "bg-violet-100 border-l-4 border-violet-500"
        : "bg-white"

    return (
        <div className={`${containerStyle} rounded-3xl shadow p-7 mb-3.5`}>
            <h3 className="font-bold text-xl">{title}</h3>
            <p className="font-normal text-base mt-2 text-slate-600">
                {description}
            </p>

            {isCompleted && (
                <div className="mt-4 p-4 bg-white/70 rounded-lg">
                    <p className="text-sm text-slate-700 mb-1">
                        <strong>Score: </strong> {score}
                    </p>
                    <p className="text-sm text-slate-700 mb-1">
                        <strong>Benar: </strong> {correctCount} &nbsp;|&nbsp;
                        <strong>Salah: </strong> {wrongCount} &nbsp;|&nbsp;
                        <strong>Kosong: </strong> {emptyCount} &nbsp;|&nbsp;
                        <strong>Sedang Dinilai: </strong> {reviewCount}
                    </p>
                    <p className="text-sm text-slate-700 mb-1">
                        <strong>Waktu Mengerjakan: </strong>
                        {startTime} - {endTime}
                        {duration && <span className="ml-2">({duration})</span>}
                    </p>
                </div>
            )}
        </div>
    )
}

export default SectionQuiz
