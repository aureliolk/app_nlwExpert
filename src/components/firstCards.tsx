import * as Dialog from "@radix-ui/react-dialog"
import { ChangeEvent, FormEvent, useState } from "react"
import { toast } from 'sonner'
import { X } from "lucide-react"


interface FirstCardProps {
    createNewNote: (content: string) => void
}




export function FirstCard({ createNewNote }: FirstCardProps) {
    const [showAddNote, setShowAddNote] = useState(false)
    const [contentAddNote, setContentAddNote] = useState("")
    const [recordingNote, setRecordingNote] = useState(false)

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;


    function handleSetShowNote() {
        setShowAddNote(true)
    }

    function handleRecordingNote() {
        const isSpeechRecognitionAPIAvailable =
            "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

        if (!isSpeechRecognitionAPIAvailable) {
            alert("Infelizmente seu navegador não suporta a API de gravação!");
            return;
        }

        setShowAddNote(true)
        setRecordingNote(true)

        const speechRecognition = new SpeechRecognitionAPI();
        speechRecognition.lang = "pt-BR";
        speechRecognition.continuous = true;
        speechRecognition.maxAlternatives = 1;
        speechRecognition.interimResults = true;

        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript);
            }, "");

            setContentAddNote(transcription);
        };

        speechRecognition.onerror = (event) => {
            console.error(event);
        };

        speechRecognition.start();
    }

    function stopRecordingNote() {
        setRecordingNote(false)
        const speechRecognition = new SpeechRecognitionAPI();

        if (speechRecognition !== null) {
            speechRecognition.stop();
        }
    }

    function handleEmptyAddNote(e: ChangeEvent<HTMLTextAreaElement>) {
        setContentAddNote(e.target.value)
        if (e.target.value === "") {
            setShowAddNote(false)
        }
    }

    function handleSubmitNotes(e: FormEvent) {
        e.preventDefault()
        if (contentAddNote === "") {
            toast.error("Escreva sua nota!")
            return
        }
        setContentAddNote("")
        setShowAddNote(false)
        createNewNote(contentAddNote)
        toast.success("Mensagem adicionada com sucesso!")
    }



    return (
        <>
            <Dialog.Root>
                <Dialog.Trigger className="rounded-md text-left bg-slate-800 flex flex-col p-5 gap-3 overflow-hidden relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none" >
                    <div className="text-xs text-slate-200">Adicionar Nota</div>
                    <div className="text-slate-400 text-sm">Grave uma nota em áudio que será convertida para texto automaticamente.</div>

                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className="inset-0 fixed bg-black/50" />
                    <Dialog.Content className="fixed overflow-hidden inset-0 w-full bg-slate-700 md:rounded-md flex flex-col outline-none md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh]">
                        <Dialog.Close className="absolute p-1.5 right-0 top-0 bg-slate-800 text-slate-400 hover:text-slate-100">
                            <X className="size-5" />
                        </Dialog.Close>
                        <div className="font-bold text-sm text-slate-200 p-4">Adicionar Nota</div>
                        {showAddNote ?
                            (<><form className="flex flex-1 flex-col">

                                <textarea
                                    autoFocus
                                    onChange={handleEmptyAddNote}
                                    className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none px-4"
                                    value={contentAddNote}
                                />
                                {recordingNote ? (
                                    <>
                                        <button type="button" onClick={stopRecordingNote} className="text-sm font-medium bg-slate-800 flex items-center justify-center gap-2 text-slate-50 py-4"><div className="size-2 rounded-full bg-red-500" /> Gravando! (clique p/ interromper)</button>
                                    </>
                                )
                                    :
                                    (
                                        <>
                                            <button onClick={handleSubmitNotes} type="button" className="text-sm font-medium bg-lime-400 text-lime-950 py-4">Salvar Nota</button>
                                        </>
                                    )}
                            </form></>)
                            :
                            (<><div className=" text-slate-400 text-sm px-4">Comece <button className="text-lime-300" onClick={handleRecordingNote} >gravando uma nota</button> em aúdio ou se preferir <button onClick={handleSetShowNote} className="text-lime-300">ultilize apenas texto</button>.</div></>)
                        }
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    )
}
