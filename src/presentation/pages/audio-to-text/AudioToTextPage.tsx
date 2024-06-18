import { useState } from 'react';
import { GptMessage, MyMessage, TypingLoader } from '../../components';
import { TextMessageBoxFile } from '../../components/chat-input-boxes/TextMessageBoxFile';
import { audioToTextUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
}

export const AudioToTextPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);


  const handlePost = async (text: string, audioFile: File) => {
    setIsLoading(true);
    setMessages( (prev) => [...prev, {text: text, isGpt: false}] )

    const data = await audioToTextUseCase(audioFile, text)
    setIsLoading(false);

    if( !data ) return;

    const gptMessage = `
## Transcripción:
__Duración:__ ${Math.round(data.duration)}
## El texto es:
${data.text}
`

    setMessages( (prev) => [
      ...prev,
      {text: gptMessage, isGpt: true}
    ]);

    for( const segment of data.segments ) {
      const segmentMessage = `
__De ${Math.round( segment.start )} a ${ Math.round( segment.end ) } segundos:__
${ segment.text }
`

      setMessages( (prev) => [
        ...prev,
        {text: segmentMessage, isGpt: true}
      ]);
    }


  }


  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>

            <GptMessage text='Hola, en que puedo ayudarte?' />

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

      <TextMessageBoxFile
        onSendMessage={handlePost}
        placeholder='Consultar a ReactGPT'
        disableCorrections
        accept='audio/*'
      />
    </div>
  )
}
