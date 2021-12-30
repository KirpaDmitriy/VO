import React, { useState } from 'react';

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Textarea,
    PanelHeaderContent,
    Avatar,
    FormItem,
    Input,
    Button,
    Snackbar,
    FormLayout
} from '@vkontakte/vkui';

import { Icon16Done } from '@vkontakte/icons';

import hi from '../img/hi.png';

const MyRoomDialog = ({ id, user, go, myRoom }) => {

    const [newName, setNewName] = useState(myRoom.name);
    const [newDescr, setNewDescr] = useState(myRoom.description);
    const [snackbar, setSnackbar] = useState(null);

    return id && (<Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack label="Назад" onClick={go} data-to="myroom"/>}>
                <PanelHeaderContent
                    status='Редактирование'
                    before={<Avatar size={36} src={myRoom.ava}/>}
                >
                    {"Комната " + myRoom.number}
                </PanelHeaderContent>
            </PanelHeader>
            <FormLayout>
                <FormItem
                    top="Имя комнаты"
                    status={newName ? "valid" : "error"}
                    bottom={
                        newName
                            ? "Превосходное имя!"
                            : "Пожалуйста, введи имя"
                    }>
                    <Input
                        value={newName} onChange={(e) => setNewName(e.target.value)}/>
                </FormItem>
                <FormItem top="Твори!">
                    <Textarea value={newDescr} onChange={(e) => setNewDescr(e.target.value)} />
                </FormItem>
                <FormItem>
                    <Button size="l" stretched onClick={() => {
                        fetch('http://localhost/edit_room_name',
                            {
                                method: 'POST',
                                body: JSON.stringify({
                                    'room_id': myRoom.id,
                                    'new_name': newName
                                }),
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });
                        fetch('http://localhost/edit_room_info',
                            {
                                method: 'POST',
                                body: JSON.stringify({
                                    'room_id': myRoom.id,
                                    'new_info': newDescr
                                }),
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });
                        setSnackbar(<Snackbar
                            layout="vertical"
                            onClose={() => { setSnackbar(null) }}
                            before={
                                <Avatar size={24} style={{ background: "var(--accent)" }}>
                                    <Icon16Done fill="#fff" width={14} height={14} />
                                </Avatar>
                            }
                        >
                            Готово B-)
                        </Snackbar>);
                    }
                    }>
                        Вжух
                    </Button>
                </FormItem>
            </FormLayout>
            {snackbar}
        </Panel>);
};

export default MyRoomDialog;
