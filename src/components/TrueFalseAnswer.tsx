import { 
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const TrueFalseAnswer = ({ tableStatements = [ {id: 1, statement: 'Tidak ada data'} ] }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-8/12">Pernyataan</TableHead>
                <TableHead className="text-center">Benar</TableHead>
                <TableHead className="text-center">Salah</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tableStatements.map((data) => (  
                    <TableRow key={data.id}>
                        <TableCell className="w-8/12">{data.statement}</TableCell>
                        <TableCell colSpan={2}>
                            <RadioGroup className="flex gap-x-8">
                                <RadioGroupItem value="true" id={`true-${data.id}`} className="mx-auto" />
                                <RadioGroupItem value="false" id={`false-${data.id}`} className="mx-auto" />
                            </RadioGroup>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default TrueFalseAnswer