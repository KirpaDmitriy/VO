import React, { useState } from 'react';

import { Panel, PanelHeader, Header, Group, Cell, Avatar, SplitLayout, Banner, Button, Text } from '@vkontakte/vkui';
import { Icon24PenOutline } from '@vkontakte/icons';

import hi from '../img/hi.png';


const Myroom = ({ id, fetchedUser, go_to_answer, go, go_to_edit }) => {
    const [fetchedRequestors, setRequestors] = useState([]);
    const [myRoom, setMyRoom] = useState(null);

    async function fetchData() {
        if(fetchedRequestors.length != 0 && myRoom !== null) return;
        const user = await fetch('http://localhost/get_user', {
            method: 'POST',
            body: JSON.stringify( { "id": fetchedUser.id } ),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json());

        const room = await fetch('http://localhost/get_room', {
            method: 'POST',
            body: JSON.stringify( { "id": user.room } ),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json());
        setMyRoom(room);

        const reqsids = await fetch('http://localhost/room_requestors', {
            method: 'POST',
            body: JSON.stringify({
                "id": parseInt(room.id)
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json());
        let reqs = [];
        for(let ids in reqsids) {
            reqs.push(await fetch('http://localhost/get_user', {
                method: 'POST',
                body: JSON.stringify( { "id": reqsids[ids] } ),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json()));
        }
        setRequestors(reqs);
    }
    fetchData();

    function UserButton(props) {
        return (<Button onClick={(event) => {
            go_to_answer(event, props.where, myRoom)
        }
        } data-to='myroomdialog'>
            Переписка
        </Button>);
    }

    function render() {
        let texts = [];
        for(let req in fetchedRequestors) {
            texts.push(<Banner key={req} before={<Avatar size={48} src={fetchedRequestors[req].ava} />} header={fetchedRequestors[req].firstname + ' ' + fetchedRequestors[req].lastname}
                               actions={
                                   <React.Fragment>
                                       <UserButton where={fetchedRequestors[req]} />
                                   </React.Fragment>
                               }
            />);
        }
        return texts;
    }

    return (<SplitLayout><Panel id={id}>
            <PanelHeader>ВОбщаге</PanelHeader>
            <Group header={<Header mode="secondary">Хто я?</Header>}>
                <Cell
                    before={<Avatar src={myRoom? myRoom.ava: null} onClick={go} data-to='home'/>}
                    description={myRoom? myRoom.name: null}
                    after={<Icon24PenOutline onClick={(event) => {
                        go_to_edit(event, myRoom)
                    }} data-to="editroom" />}
                >
                    {myRoom? 'Комната ' + myRoom.number: null}
                </Cell>
            </Group>
            <Group header={<Header mode="secondary">Список диалогов</Header>}>
                {
                    render()
                }
            </Group>
        </Panel></SplitLayout>
    );
}

export default Myroom;