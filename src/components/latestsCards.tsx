import * as Dialog from "@radix-ui/react-dialog"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { X } from "lucide-react"



interface LatestCardsProps {
    notes: {
        date: Date,
        content: string
        id: string
    }
    deleteNote : (id:string) => void
}


export function LatestCards({ notes,deleteNote }: LatestCardsProps) {
    return (
        <Dialog.Root>
            <Dialog.Trigger className="flex flex-1 outline-none">
                <div className="bg-slate-800 rounded-md flex flex-1 flex-col gap-3 p-5 overflow-hidden relative text-left hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">
                    <div className="absolute bottom-0 right-0 left-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0" />
                    <div className="text-xs text-slate-200">{formatDistanceToNow(notes.date, { locale: ptBR, addSuffix: true })}</div>
                    <div className=" text-slate-400 text-sm">{notes.content}</div>
                </div>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-black/50" />
                <Dialog.Content className="fixed inset-0 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 rounded-md overflow-hidden flex flex-col outline-none">
                    <Dialog.Close className="absolute p-1.5 right-0 top-0 bg-slate-800 text-slate-400 hover:text-slate-100">
                        <X className="size-5" />
                    </Dialog.Close>
                    <div className="font-bold text-sm text-slate-200 p-4">{formatDistanceToNow(notes.date, { locale: ptBR, addSuffix: true })}</div>
                    <div className=" text-slate-400 text-sm px-4 flex-1">
                        {notes.content}
                    </div>
                    <button onClick={()=> deleteNote(notes.id   )} className="bg-slate-800 font-medium text-sm py-4 group">Deseja <span className="text-red-500 group-hover:underline">apagar essa nota</span>?</button>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}