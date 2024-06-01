import { FormEvent, useState } from "react";

interface Props {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disableCorrections?: boolean;
}

export const TextMessageBox = ({onSendMessage, placeholder, disableCorrections = false}:Props) => {

  const [message, setMessage] = useState('');

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
        <button className="btn-primary">
          <span className="mr-2">Enviar</span>
          <i className="fa-regular fa-paper-plane"></i>
        </button>
      </div>

    </form>
  )
}
