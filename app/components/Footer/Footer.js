import { AppContext } from "@/app/context/AppContext";
import { Box, Button, IconButton, TextField } from "@mui/material";
import { useContext, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import styles from './Footer.module.css'
import { useRouter } from "next/navigation";


export default function Footer(props) {
    const router = useRouter();
    const [value, setValue] = useState("");
    const { drawerWidth, setMessageValue, showFooterButton, textButton } = useContext(AppContext);

    const handleChange = (e) => {
        e.preventDefault();
        setMessageValue(value);
        router.push('../');
        setValue("");
    };

    return (
        <Box
            component="footer"
            sx={{
                width: `calc(100% - ${drawerWidth}px)`,
                justifyContent: "center",
                pb: 3,
                backgroundImage: 'linear-gradient(180deg,rgba(255,255, 255,0),#fcfcfc 65%)'
            }}
            className={styles.footerBox}
        >
            {
                showFooterButton &&
                <Button variant="outlined" sx={{
                    display: 'block',
                    mx: 'auto',
                    mb: 1,
                    backgroundColor: 'white'
                }}
                    onClick={props.onButtonClick}>
                    {textButton}
                </Button>
            }
            <form className={styles.form} onSubmit={e => handleChange(e)}>
                <TextField label="اسألني" fullWidth
                    sx={{ backgroundColor: 'white' }}
                    className={styles.input}
                    value={value}
                    onChange={e => setValue(e.target.value)} />
                <IconButton aria-label="send" className={styles.sendIcon} onClick={handleChange}>
                    <SendIcon />
                </IconButton>
            </form>
        </Box>
    );
};