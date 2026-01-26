export const getChatCompletion = async (message) => {
    const options = {
        method: "POST",
        body: JSON.stringify({
            messages: message
        }),
        headers: {
            "Content-Type": "application/json"
        }
    };

    try {
        const res = await fetch("/api/chat-completion", options);
        const data = await res.json();
        return { data, status: res.status };
    } catch (error) {
        console.error(error);
    };
};

export const getTranscription = async (mediaBlobUrl) => {
    let file = await fetch(mediaBlobUrl).then(r => r.blob());
    const formData = new FormData();

    formData.append('file', file);

    try {
        const response = await fetch('/api/speech-to-text', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        return { data };
    } catch (error) {
        console.error(error);
    };
};


export const getTextCompletion = async (prompt) => {
    const options = {
        method: "POST",
        body: JSON.stringify({
            message: prompt
        }),
        headers: {
            "Content-Type": "application/json"
        }
    };

    try {
        const response = await fetch('/api/text-completion', options);
        const data = await response.json();
        return { status: response.status, data };
    } catch (error) {
        console.error(error);
    };
};