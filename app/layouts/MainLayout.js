import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import SideBar from '@/app/components/SideBar/SideBar';
import { AppContext } from '@/app/context/AppContext';

export default function MainLayout(props) {
    const { openMobile, setOpenMobile, drawerWidth } = React.useContext(AppContext);
    const { window } = props;

    const container = window !== undefined ? () => window().document.body : undefined;

    const handleDrawerToggle = () => {
        setOpenMobile(!openMobile);
    };

    return (
        <Grid
            container={container}
            spacing={0}
            direction="column"
        >
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
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
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            علمني
                        </Typography>
                    </Toolbar>
                </AppBar>
                <SideBar mobileOpen={openMobile} />
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
                >
                    <Toolbar />
                    {props.children}
                </Box>
            </Box>
        </Grid>
    );
};