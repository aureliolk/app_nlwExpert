import { ChangeEvent, useEffect, useState } from "react"
import logo from "./assets/Logo.svg"
import { FirstCard } from "./components/firstCards"
import { LatestCards } from "./components/latestsCards"

interface NotesProps {
  id: string
  date: Date
  content: string
}

export function App() {
  const [notes, setNotes] = useState<NotesProps[]>(() => {
    const noteOnStorage = localStorage.getItem("notes")
    if (noteOnStorage) {
      return JSON.parse(noteOnStorage)
    }
    return []
  })
  const [serach, setSearch] = useState("")

  useEffect(()=>{
    async function getData() {
      try {
        const res = await fetch("http://localhost:3000/api");
        if (!res.ok) {
          throw new Error("Erro na solicitação HTTP");
        }
        const data = await res.json();
        console.log(data);
      } catch (err: any) {
        console.log(err.message);
      }
    }

    getData();
  },[])

  function createNote(content: string) {
    const newNotes = {
      id: crypto.randomUUID(),
      date: new Date(),
      content: content
    }

    const listNotes = [newNotes, ...notes]

    setNotes(listNotes)

    localStorage.setItem("notes", JSON.stringify(listNotes))
  }


  function deleteNote(id: string) {
    const newNotes = notes.filter((note) => {
      return note.id !== id
    })

    setNotes(newNotes)
    localStorage.setItem("notes", JSON.stringify(newNotes))

  }


  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
  }

  const fillterNotes = serach != "" ? notes.filter((note) => note.content.toLocaleLowerCase().includes(serach.toLocaleLowerCase())) : notes

  return (
    <div className="max-w-7xl mx-auto my-12 space-y-12 px-4 md:px-0">
      <div>
        <img src={logo} alt="Loja Note Expert" className="w-44" />
      </div>

      <div>
        <form>
          <input
            type="text"
            placeholder="Busque suas notas..."
            className="text-3xl w-full bg-transparent font-semibold tracking-tight outline-none placeholder:text-slate-500"
            onChange={handleSearch}
          />
        </form>

        <div className="h-px bg-slate-700" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[250px] gap-6">
        <FirstCard createNewNote={createNote} />
        {fillterNotes.map(item => {
          return (
            <LatestCards key={item.id} notes={{
              date: item.date,
              content: item.content,
              id: item.id
            }} deleteNote={deleteNote} />
          )
        })}
      </div>
    </div>
  )
}