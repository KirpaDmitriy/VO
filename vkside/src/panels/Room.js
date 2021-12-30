import React, { useState} from 'react';

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    WriteBarIcon,
    PanelHeaderContent,
    Avatar,
    WriteBar,
    FixedLayout,
    Separator,
    SplitLayout,
    List,
    Cell
} from '@vkontakte/vkui';

import hi from '../img/hi.png';

const Room = ({ id, room, go, fetchedUser }) => {
    const [message, setMessage] = useState('');
    const [dialog, setDialog] = useState([]);

    async function fetchData(ok) {
        if(ok == 0) return;
        const sms = await fetch('http://localhost/dialog_messages',
            {
                method: 'POST',
                body: JSON.stringify({
                    "user": parseInt(fetchedUser.id),
                    "room": parseInt(room.id)
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json());
        setDialog(sms);
    }
    fetchData();

    function render_dialog(smss) {
        let answer = [];
        for(let sms in smss) {
            if(smss[sms].direction === 0)
                answer.push(<Cell before={<Avatar size={36} src={fetchedUser.photo_200}/>} mode="shadow"><b>{fetchedUser.first_name + ' ' + fetchedUser.last_name}</b><p>{smss[sms].content}</p></Cell>);
            else
                answer.push(<Cell before={<Avatar size={36} src={room.ava}/>} mode="shadow"><b>{room.name}</b><p>{smss[sms].content}</p></Cell>);
        }
        return answer;
    }

    return (
    <Panel id={id}>
        <PanelHeader
            left={<PanelHeaderBack label="Назад" onClick={(event) => go(event)} data-to='home'/>}>
            <PanelHeaderContent
                status={room.description}
                before={<Avatar size={36} src={room.ava}/>}
            >
                {"Комната " + room.name}
            </PanelHeaderContent>
        </PanelHeader>
        {dialog.length === 0 && (<SplitLayout style={{ justifyContent: "center" }}>
            <img className="Spotty" src={hi} width={128} alt="Spotty The Dog"/>
        </SplitLayout>)}
        {dialog.length !== 0 && (<List size="l">
            {render_dialog(dialog)}
        </List>)}
        <FixedLayout vertical="bottom">
            <div>
                <Separator wide />
                <WriteBar
                    inlineAfter={
                        <WriteBarIcon onClick={ () => { const response = fetch('http://localhost/add_message',
                                        {
                                            method: 'POST',
                                            body: JSON.stringify( { 'content': message, 'source': fetchedUser.id, 'destination': room.id, 'direction': 0} ),
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }
                                        });
                                        setMessage(''); fetchData()}
                                        }
                                      mode='send'
                                      disabled={message.length === 0}
                        />
                    }
                    value={message}
                    onChange={(e) => {setMessage(e.target.value)}}
                    placeholder="Сообщение"
                />
            </div>
        </FixedLayout>
    </Panel> );
};

export default Room;
