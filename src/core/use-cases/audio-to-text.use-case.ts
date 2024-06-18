import type { AudioToTextInterface } from "../../interfaces";



export const audioToTextUseCase = async (  audioFile: File, prompt?: string ) => {
    try {

        const formData = new FormData();
        formData.append('file', audioFile);

        if( prompt ) {
            formData.append('prompt', prompt);
        }


        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/audio-to-text`, {
            method: 'POST',
            body: formData
        });

        if ( !resp.ok ) throw new Error('No es posible realizar la corrección');

        const data = await resp.json() as AudioToTextInterface;

        return data;

    } catch (error) {
        return null;
    }
}