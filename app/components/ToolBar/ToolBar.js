import { AppBar, Toolbar, IconButton, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import { useContext } from "react";
import { AppContext } from "@/app/context/AppContext";
import { useRouter } from "next/navigation";


export default function ToolBar() {
    const router = useRouter();
    const { openMobile, setOpenMobile, drawerWidth, setShowFooterButton } = useContext(AppContext);

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={() => setOpenMobile(!openMobile)}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div" onClick={() => { router.push('../'); setShowFooterButton(false) }} sx={{ cursor: 'pointer', mr: 'auto', fontSize: '20px', fontWeight: 'bold' }}>
                    علمني
                </Typography>
            </Toolbar>
        </AppBar>
    );
};