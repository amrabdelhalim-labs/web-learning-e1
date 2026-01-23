import { Toolbar, Typography, Divider } from '@mui/material'

export default function MenuToolbar() {
    return (
        <>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    قائمة الدورس
                </Typography>
            </Toolbar>
            <Divider />
        </>
    );
};