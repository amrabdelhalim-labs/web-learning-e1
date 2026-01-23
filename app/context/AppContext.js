import { createContext, useState } from "react";


export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [openMobile, setOpenMobile] = useState(false);
    const [messageValue, setMessageValue] = useState("");
    const [contextPreviousMessage, setContextPreviousMessage] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [textButton, setTextButton] = useState("");
    const [showFooterButton, setShowFooterButton] = useState(false);

    const drawerWidth = 270;

    return (
        <AppContext.Provider value={{
            openMobile,
            setOpenMobile,
            drawerWidth,
            messageValue,
            setMessageValue,
            contextPreviousMessage,
            setContextPreviousMessage,
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