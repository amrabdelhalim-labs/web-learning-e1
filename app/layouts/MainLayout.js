import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import { Grid, CircularProgress, Snackbar, Alert, IconButton, Typography } from "@mui/material";
import SideBar from '../components/SideBar/SideBar';
import ToolBar from '../components/ToolBar/ToolBar';
import { AppContext } from '../context/AppContext';
import Footer from '../components/Footer/Footer';
import styles from './MainLayout.module.css'
import CloseIcon from "@mui/icons-material/Close"


export default function MainLayout(props) {
    const { window } = props;
    const { drawerWidth, errorMessage, showAlert, setShowAlert } = React.useContext(AppContext);

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Grid
            container={container}
            spacing={0}
            direction="column">
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <ToolBar />
                <SideBar />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                        mx: 'auto', maxWidth: 750
                    }}
                >
                    <Toolbar />
                    {props.loading ?
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                minHeight: '60vh'
                            }}
                        >
                            <CircularProgress size={60} />
                            <Typography component="p" sx={{ fontSize: '16px', color: '#666', textAlign: 'center', mt: 2 }}>
                                {props.loadingText}
                            </Typography>
                        </Box>
                        :
                        props.children
                    }
                </Box>
            </Box>
            <Box className={styles.footer}>
                <Footer onButtonClick={props.onButtonClick} />
            </Box>
            {
                showAlert &&
                <Snackbar open={showAlert}>
                    <Alert severity="error" sx={{ width: '100%', backgroundColor: '#d32f2f', color: '#fff' }}>
                        {errorMessage}
                        <IconButton
                            size='small'
                            aria-label="close"
                            color="inherit"
                            onClick={() => setShowAlert(false)}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Alert>
                </Snackbar>
            }
        </Grid>
    );
};