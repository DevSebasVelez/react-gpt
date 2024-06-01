import { FormEvent, useRef, useState } from "react";

interface Props {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disableCorrections?: boolean;
  accept?: string;
}

export const TextMessageBoxFile = ({onSendMessage, placeholder, disableCorrections = false, accept}:Props) => {

  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>();
  const inputFileRef = useRef<HTMLInputElement>(null);


  const handleSendMessage = ( event: FormEvent<HTMLFormElement> ) => {
    event.preventDefault()

    if( message.trim().length === 0 ) return;

    onSendMessage( message );
    setMessage(' ');
  }


  return (
    <form
      onSubmit={handleSendMessage}
      className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
    >

      <div className="mr-3">
        <button
          type="button"
          className="text-gray-400 hover:text-gray-800"
          onClick={() => inputFileRef.current?.click()}
        >
            <i className="fa-solid fa-paperclip text-xl"></i>
        </button>

        <input
          type="file"
          ref={inputFileRef}
          className="hidden"
          accept={accept}
          onChange={ (event) => setSelectedFile( event.target.files?.item(0) ) }/>
      </div>


      <div className="flex-grow">
        <div className="relative w-full">

        <input
          type="text"
          autoFocus
          name="message"
          className="flex w-full border border-gray-400 rounded-xl text-gray-800 focus:outline-none focus:border-cyan-600 p-2"
          placeholder={ placeholder }
          autoComplete={ disableCorrections ? 'off' : 'on'}
          autoCorrect={ disableCorrections ? 'off' : 'on'}
          value={message}
          onChange={ (event) => setMessage(event.target.value) }
        />

        </div>
      </div>

      <div className="ml-4">
        <button
          className="btn-primary"
          disabled={ !selectedFile }
        >
          {
            (!selectedFile)
              ? <span className="mr-2">Enviar</span>
              : <span className="mr-2">Enviar {selectedFile.name.substring(0,6) + '...'}</span>
          }
          <i className="fa-regular fa-paper-plane"></i>
        </button>
      </div>

    </form>
  )
}
