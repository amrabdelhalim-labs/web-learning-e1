import { Typography, Box } from "@mui/material";
import logo from '@/public/logo.png';
import Image from "next/image";
import styles from './SideBar.module.css';



export default function MenuFooter() {
    const date = new Date();

    return (
        <Box component="footer" className={styles.menufooter}>
            <Image src={logo} width={100} alt="brand" />
            <Typography component="p">يستعمل تقنية OpenAI</Typography>
            <Typography component="p">جميع الحقوق محفوظة © <Typography component="span">{date.getFullYear()}</Typography></Typography>
        </Box>
    );
};