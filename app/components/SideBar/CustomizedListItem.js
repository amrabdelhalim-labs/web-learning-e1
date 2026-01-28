import { Divider, List, ListItem, ListItemButton, ListItemText, Collapse, ListItemIcon } from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useState } from "react";
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import TranslateIcon from '@mui/icons-material/Translate';
import { useRouter } from "next/navigation";

export default function CustomizedListItem(props) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const ListItemObj = {
        'lecture': 'شرح الدرس',
        'question': "أسئلة",
        'conversation': 'محادثة',
        'translate': 'ترجمة'
    };

    const icons = [
        <CastForEducationIcon />,
        <QuestionAnswerIcon />,
        <RecordVoiceOverIcon />,
        <TranslateIcon />
    ];

    return (
        <>
            <ListItem disablePadding>
                <ListItemButton onClick={() => { setOpen(!open) }}>
                    <ListItemText primary={props.lectureName} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {ListItemObj && Object.values(ListItemObj).map((item, index) => {
                    return (
                        <div key={index}>
                            <List component="div" disablePadding>
                                <ListItemButton onClick={() => { setOpen(true); router.push(`../${props.lectureNameEn}/${Object.keys(ListItemObj)[index]}`) }}>
                                    <ListItemIcon>
                                        {icons[index]}
                                    </ListItemIcon>
                                    <ListItemText primary={item} />
                                </ListItemButton>
                            </List>
                            <Divider />
                        </div>
                    )
                })}
            </Collapse>
        </>
    );
};