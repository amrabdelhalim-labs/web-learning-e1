"use client";

import * as React from 'react';
import { Drawer, Box } from '@mui/material';
import { AppContext } from '@/app/context/AppContext';
import CustomizedListItem from '@/app/components/SideBar/CustomizedListItem';
import MenuToolbar from './MenuToolbar';
import MenuFooter from './MenuFooter';


export default function SideBar(props) {
    const { openMobile, setOpenMobile, drawerWidth } = React.useContext(AppContext);

    const handleDrawerToggle = () => {
        setOpenMobile(!openMobile);
    };

    const lectureObject = {
        'Simple-present': 'المضارع البسيط',
        'Simple-past': 'الماضي البسيط',
        'Descriptive-adjectives-and-adjectives': 'الصفات والصفات الموصوفة',
        'Comparative-form': 'صيغة المقارنة',
        'plural-nouns': 'الأسماء الجمع',
        'Countable-and-uncountable-nouns': 'الأسماء المعدودة وغير المعدودة',
        'personal-pronouns': 'الضمائر الشخصية',
        'Adverbs': 'الظروف',
        'Complex-sentences': 'الجمل المعقدة'
    };

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="lectures"
        >
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Drawer
                variant="temporary"
                open={openMobile}
                onClose={handleDrawerToggle}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                slotProps={{
                    root: {
                        keepMounted: true, // Better open performance on mobile.
                    },
                }}
            >
                <MenuToolbar />
                {lectureObject && Object.values(lectureObject).map((item, index) => {
                    return (
                        <CustomizedListItem key={index} lectureName={item} lectureNameEn={Object.keys(lectureObject)[index]} />
                    )
                })}
                <MenuFooter />
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
            >
                <MenuToolbar />
                {lectureObject && Object.values(lectureObject).map((item, index) => {
                    return (
                        <CustomizedListItem key={index} lectureName={item} lectureNameEn={Object.keys(lectureObject)[index]} />
                    )
                })}
                <MenuFooter />
            </Drawer>
        </Box>
    );
};