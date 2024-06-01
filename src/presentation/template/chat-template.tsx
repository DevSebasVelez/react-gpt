import { useState } from 'react';

interface Message {
  text: string;
  isGpt: boolean;
}

export const ChatTemplate = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);


  const handlePost = async(text: string) => {
    setIsLoading(true);
    setMessages( (prev) => [...prev, {text: text, isGpt: false}] )

    //TODO: UseCase
    setIsLoading(false);
  }


  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>

            <GptMessage text='Hola, en que puedo ayudarte?' />

            {
              messages.map( (message, index) => (
                message.isGpt
                  ? (<GptMessage key={index} text='Esto viene de OpenAI' />)
                  : (<MyMessage key={index} text={ message.text }/>)

              ))
            }

            {
              isLoading &&
              <div className='fade-in col-start-1 col-end-13'>
                <TypingLoader />
              </div>
            }


        </div>
      </div>

      <TextMessageBox
        onSendMessage={handlePost}
        placeholder='Consultar a ReactGPT'
        disableCorrections
      />
    </div>
  )
}
