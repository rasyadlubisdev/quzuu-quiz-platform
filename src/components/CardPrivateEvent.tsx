import { Button } from "./ui/button"
import { Input } from "./ui/input"

const CardPrivateEvent = () => {
  return (
    <div className="bg-white p-6 rounded-3xl text-slate-800 shadow">
      <h3 className="text-xl font-semibold">Join Private Event</h3>
      <div className="text-base font-medium mb-3.5 text-slate-500">
        Enter the Event ID
      </div>
      <div className="flex flex-row md:flex-col tablet:flex-row">
        <Input placeholder="Enter code..." className="ring-primary" />
        <Button className="ml-4 md:mt-4 md:ml-0 tablet:ml-4 tablet:mt-0">
          Enroll
        </Button>
      </div>
    </div>
  )
}

export default CardPrivateEvent
