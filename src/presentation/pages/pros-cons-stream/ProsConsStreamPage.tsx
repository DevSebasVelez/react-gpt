import { useRef, useState } from 'react';
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from '../../components';
import { prosConsStreamGeneratorUseCase, prosConsStreamUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsStreamPage = () => {

  const abortController = useRef( new AbortController() );
  const isRunning = useRef(false);

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);


  const handlePost = async( text: string ) => {

    if(isRunning.current ){
      abortController.current.abort();
      abortController.current = new AbortController();
    }

    setIsLoading(true);
    isRunning.current = true;
    setMessages( (prev) => [...prev, {text: text, isGpt: false}] )

    const stream = await prosConsStreamGeneratorUseCase( text, abortController.current.signal );
    setIsLoading(false);
    setMessages( (messages) => [...messages, { text: '', isGpt: true }] );

    for await ( const text of stream ) {
      setMessages( (messages) => {
            const newMessages = [...messages];
            newMessages[ newMessages.length - 1 ].text = text;
            return newMessages;
          });

    }

    isRunning.current = false;


    // const reader = await prosConsStreamUseCase( text );
    // setIsLoading(false);

    // if( !reader ) return alert('No se pudo generar el reader');

    // const decoder = new TextDecoder();
    // let message = '';
    // setMessages( (messages) => [...messages, { text: message, isGpt: true }] )

    // const tr = true;
    // while( tr ) {
    //   const { value, done } = await reader.read();
    //   if( done ) break;

    //   const decodedChunk = decoder.decode( value, { stream: true });
    //   message += decodedChunk;

    //   setMessages( (messages) => {
    //     const newMessages = [...messages];
    //     newMessages[ newMessages.length - 1 ].text = message;
    //     return newMessages;
    //   })
    // }
  }


  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>

            <GptMessage text='Hola, que deseas comparar hoy?' />

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
