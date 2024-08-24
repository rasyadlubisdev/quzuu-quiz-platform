import { Input } from "./ui/input"

const CodeShortAnswer: React.FC = () => {
    
    return (
        <div className="code-display py-8 px-6 bg-slate-950 text-white rounded-md whitespace-pre-wrap">
            <code><span className="text-blue-400">int</span> apel = <span className="text-orange-500">5000</span>;</code>
            <br />
            <code><Input className="bg-blue-400 text-slate-950 w-9 h-6 inline p-0 leading-3 focus:ring-transparent text-base" /> jeruk = <span className="text-orange-500">2000</span>;</code>
            <br />
            <code><span className="text-blue-400">int</span> anggur <Input className="bg-orange-500 text-slate-950 w-16 h-6 inline p-0 leading-3 focus:ring-transparent text-base" />;</code>
            <br />
            <code>total_harga = apel + jeruk + anggur;</code>
        </div>
    )
}

export default CodeShortAnswer
