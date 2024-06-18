import { useState } from 'react';
import { TextMessageBox, MyMessage, TypingLoader, GptOrthographyMessage, GptMessage } from '../../components';
import { orthographyUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    userScore: number;
    errors: string[];
    message: string;
  };
}

export const OrthographyPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);


  const handlePost = async( text: string ) => {

    setIsLoading(true);
    setMessages( (prev) => [...prev, {text: text, isGpt: false}] )


    const data = await orthographyUseCase( text );

    if( !data.ok ){
      setMessages( (prev) => [...prev, {text: 'Error en correcciones', isGpt: true}] );

    } else {
      setMessages( (prev) => [...prev, {
        text: data.message,
        isGpt: true,
        info: {
          errors: data.errors,
          message: data.message,
          userScore: data.userScore,
        }}] );
    }


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
                  ? (
                      <GptOrthographyMessage
                        key={index}
                        userScore={message.info!.userScore}
                        message={message.info!.message}
                        errors={message.info!.errors}
                        />
                      )
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
