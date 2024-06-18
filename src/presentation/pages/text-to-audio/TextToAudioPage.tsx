import { useState } from 'react';
import { GptMessage, GptMessageAudio, MyMessage, TextMessageBoxSelect, TypingLoader } from '../../components';
import { TextToAudioUseCase } from '../../../core/use-cases';

const disclaimer = `## Que audio quieres generar hoy?`;

const voices = [
  { id: "nova", text: "Nova" },
  { id: "alloy", text: "Alloy" },
  { id: "echo", text: "Echo" },
  { id: "fable", text: "Fable" },
  { id: "onyx", text: "Onyx" },
  { id: "shimmer", text: "Shimmer" },
]

interface TextMessage {
  text: string;
  isGpt: boolean;
  type: 'text';
}

interface AudioMessage {
  text: string;
  isGpt: boolean;
  audioUrl: string;
  type: 'audio'
}

type Message = TextMessage | AudioMessage;



export const TextToAudioPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);


  const handlePost = async(text: string, selectedVoice: string ) => {
    setIsLoading(true);
    setMessages( (prev) => [...prev, {text: text, isGpt: false, type: 'text'}] )

    const { ok, message, audioUrl } = await TextToAudioUseCase( text, selectedVoice );

    setIsLoading(false);

    if( !ok ) return;

    setMessages( (prev) => [
      ...prev,
      {
        text: `${selectedVoice} - ${message}`,
        isGpt: true,
        type: "audio",
        audioUrl: audioUrl!,
      },
    ]);
  };


  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>

            <GptMessage text={disclaimer} />

            {messages.map((message, index) =>
            message.isGpt ? (
              message.type === "audio" ? (
                <GptMessageAudio
                  key={index}
                  text={message.text}
                  audioUrl={message.audioUrl}
                />
              ) : (
                <GptMessage key={index} text={message.text} />
              )
            ) : (
              <MyMessage key={index} text={message.text} />
            )
          )}

            {
              isLoading &&
              <div className='fade-in col-start-1 col-end-13'>
                <TypingLoader />
              </div>
            }


        </div>
      </div>

      <TextMessageBoxSelect
        onSendMessage={handlePost}
        placeholder='Consultar a ReactGPT'
        options={voices}
      />
    </div>
  )
}
