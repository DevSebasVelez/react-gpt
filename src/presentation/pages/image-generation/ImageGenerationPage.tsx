import { useState } from 'react';
import { GptMessage, GptMessageImage, MyMessage, TextMessageBox, TypingLoader } from '../../components';
import { imageGenerationUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string,
    alt: string
  }
}

export const ImageGenerationPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);


  const handlePost = async(text: string) => {
    setIsLoading(true);
    setMessages( (prev) => [...prev, {text: text, isGpt: false}] )

    const data = await imageGenerationUseCase(text);
    setIsLoading(false);

    if( data === null ) {
      return setMessages( (prev) => [...prev, {text: 'No se pudo generar la imagen', isGpt: true}] )

    }


    setMessages( (prev) => [
      ...prev,
      {
        text: text,
        isGpt: true,
        info: {
          imageUrl: data.url,
          alt: data.alt
        }
      }]);
  }


  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>

            <GptMessage text='Hola, que imagen deseas generar hoy?' />

            {
              messages.map( (message, index) => (
                message.isGpt
                  ? (<GptMessageImage key={index} text={`Imagen generada por IA`} imageUrl={message.info!.imageUrl} alt={message.info!.alt}/>)
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
