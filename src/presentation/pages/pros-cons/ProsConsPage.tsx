import { useState } from 'react';
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from '../../components';
import { prosConsUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);


  const handlePost = async( text: string ) => {
    setIsLoading(true);
    setMessages( (prev) => [...prev, {text: text, isGpt: false}] )

    const data = await prosConsUseCase(text);

    if( !data.ok ) return;


    setMessages( (prev) => [...prev, {
        text: data.content,
        isGpt: true,
    }]);

    setIsLoading(false);
  }


  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>

            <GptMessage text='Hola, soy Sebas y te ayudare con los pros y contras de cualquier cosa.' />

            {
              messages.map( (message, index) => (
                message.isGpt
                  ? (<GptMessage key={index} text={ message.text }/>)
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
