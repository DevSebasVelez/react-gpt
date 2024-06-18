import { useState } from 'react';
import { GptMessage, GptMessageImage, MyMessage, TextMessageBox, TypingLoader } from '../../components';
import { imageGenerationUseCase, imageVariationUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  }
}

export const ImageTunningPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    text: '',
    isGpt: true,
    info: {
      imageUrl: "htt",
      alt: 'Imagen temporal',
  }
}]);
  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as | string | undefined,
    mask: undefined as string | undefined,
  })

  const handleVariation = async () => {
    setIsLoading(true);

    const resp = await imageVariationUseCase( originalImageAndMask.original! );
    setIsLoading(false);

    if( !resp ) return;

    setMessages( (prev) => [
      ...prev,
      {
        text: 'Aquí tienes una variante de la imagen anterior',
        isGpt: true,
        info: {
          imageUrl: resp.url,
          alt: resp.alt
        }
      }
    ])
  }


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
    <>
      {
        originalImageAndMask.original && (
          <div className='fixed flex flex-col items-center top-10 right-10 z-10 fade-in'>
            <span>Editando</span>
            <img
              className='border rounded-xl w-36 h-36 object-contain'
              src={originalImageAndMask.original}
              alt="Imagen Original" />
            <button onClick={handleVariation} className='btn-primary'>Generar Variación</button>
          </div>
        )
      }
      <div className='chat-container'>
        <div className='chat-messages'>
          <div className='grid grid-cols-12 gap-y-2'>

              <GptMessage text='Hola, que imagen quieres crear hoy?' />

              {
              messages.map( (message, index) => (
                message.isGpt
                  ? (<GptMessageImage
                      key={index}
                      text={'Imagen Generada por IA'}
                      imageUrl={message.info!.imageUrl}
                      alt={message.info!.alt}
                      onImageSelected={ (selectedImageUrl) => setOriginalImageAndMask({
                        original: selectedImageUrl,
                        mask: undefined
                      })}
                    />)
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
    </>

  )
}
