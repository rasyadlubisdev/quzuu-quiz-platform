import { Label } from "./ui/label"
import { Input } from "./ui/input"

const FileAnswer = () => {
    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="code file">Submit Code File</Label>
            <Input id="code-file" type="file" />
        </div>
    )
}

export default FileAnswer