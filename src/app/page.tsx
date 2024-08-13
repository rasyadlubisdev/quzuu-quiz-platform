import { Payment, columns } from "@/components/table-events/columns"
import { DataTable } from "@/components/table-events/DataTable"
import CardPrivateEvent from "@/components/CardPrivateEvent"
import CardInformation from "@/components/CardInformation"

// const users = [
//   { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
//   { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
//   { id: 3, name: 'Alice Johnson', email: 'alice@example.com', role: 'Editor' },
// ]

async function getData(): Promise<Payment[]> {
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52aa",
      amount: 70,
      status: "pending",
      email: "woi@example.com",
    },
    {
      id: "728ed5kfs",
      amount: 10,
      status: "pending",
      email: "rojak@example.com",
    },
    {
      id: "728ed5fewak",
      amount: 7,
      status: "pending",
      email: "zilong@example.com",
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
