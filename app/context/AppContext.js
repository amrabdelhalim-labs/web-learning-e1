import { createContext, useState } from "react";


export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [openMobile, setOpenMobile] = useState(false);
    const [messageValue, setMessageValue] = useState("");
    const [contextPreviousMessage, setContextPreviousMessage] = useState([]);
    const [messages, setMessages] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [textButton, setTextButton] = useState("");
    const [showFooterButton, setShowFooterButton] = useState(false);

    const drawerWidth = 270;

    const handleChatResponse = (response, userContent) => {
        if (response?.status === 200) {
            const userMessage = { role: "user", content: userContent };
            const assistantMessage = { role: response.data.role, content: response.data.content };

            setMessages(prev => [...prev, userMessage, assistantMessage]);
            setContextPreviousMessage(prev => [...prev, userMessage, assistantMessage]);
            return true;
        };

        setShowAlert(true);
        setErrorMessage(response?.data?.error || "حدث خطأ");
        return false;
    };

    // دالة لتفريغ المحادثة عند الانتقال لصفحة أخرى
    const clearMessages = () => {
        setMessages([]);
        setContextPreviousMessage([]);
    };

    return (
        <AppContext.Provider value={{
            openMobile,
            setOpenMobile,
            drawerWidth,
            messageValue,
            setMessageValue,
            contextPreviousMessage,
            setContextPreviousMessage,
            messages,
            setMessages,
            handleChatResponse,
            clearMessages,
            showAlert,
            setShowAlert,
            errorMessage,
            setErrorMessage,
            textButton,
            setTextButton,
            showFooterButton,
            setShowFooterButton
        }}>
            {children}
        </AppContext.Provider>
    );
};