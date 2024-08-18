import { Events, columns } from "@/components/table-events/columns"
import { DataTable } from "@/components/table-events/DataTable"
import CardPrivateEvent from "@/components/CardPrivateEvent"
import CardInformation from "@/components/CardInformation"

// const users = [
//   { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
//   { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
//   { id: 3, name: 'Alice Johnson', email: 'alice@example.com', role: 'Editor' },
// ]

async function getData(): Promise<Events[]> {
  return [
    {
      id: "728ed52f",
      eventTitle: "Try Out OSNK  Informatika 2023",
      dateTime: "Monday, 26 Dec 2023 08.00 - 23.00",
      participant: 300
    },
    {
      id: "728er32f",
      eventTitle: "Try Out KSM  Informatika 2023",
      dateTime: "26 Dec 2023 08.00 - 23.00 | 2 hrs 30 mins",
      participant: 30
    },
    {
      id: "728ella2f",
      eventTitle: "Uji Coba CPNS 2023",
      dateTime: "26 Dec 2023 08.00 - 23.00 | 2 hrs 30 mins",
      participant: 100
    },
    {
      id: "728sfjd52f",
      eventTitle: "Latihan UKBI 2023",
      dateTime: "26 Dec 2023 08.00 - 23.00 | 2 hrs 30 mins",
      participant: 200
    },
    {
      id: "728ed5pwoe",
      eventTitle: "Quiz rizzz",
      dateTime: "26 Dec 2023 08.00 - 23.00 | 2 hrs 30 mins",
      participant: 3000
    },
  ]
}

export default async function Home() {
  const data = await getData()

  return (
    <main className="home-page container bg-slate-100 text-slate-950">
      <section className="greetings py-11">
        <h1 className="text-2xl font-normal">👋 Welcome Back <span className="font-bold">Abdan Hafidz</span></h1>
      </section>
      <section className="pb-10 grid grid-cols-3 gap-x-8">
        <DataTable columns={columns} data={data} />
        <aside>
          <CardPrivateEvent />
          <CardInformation />
        </aside>
      </section>
    </main>
  );
}
