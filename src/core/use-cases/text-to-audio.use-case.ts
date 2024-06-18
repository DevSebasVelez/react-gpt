


export const TextToAudioUseCase = async ( prompt: string, voice: string ) => {
    try {

        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/text-to-audio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt, voice })
        });

        if ( !resp.ok ) throw new Error('No es posible realizar la corrección');

        const audioFile = await resp.blob();
        const audioUrl = URL.createObjectURL( audioFile );

        return {
            ok: true,
            message: prompt, //optional
            audioUrl
        }

    } catch (error) {
        return {
            ok: false,
            message: 'No es posible generar el audio'
        }
    }
}