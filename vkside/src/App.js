import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Auth from './panels/Auth';
import Room from './panels/Room';
import Myroom from './panels/Myroom';
import MyroomDialog from './panels/MyroomDialog';
import EditRoom from './panels/EditRoom';


const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [currentRoom, setCurrentRoom] = useState(null);
	const [currentUser, setCurrentUser] = useState(null);
	const [myRoom, setMyRoom] = useState(null);
	const [blocker, setBlocker] = useState(0);

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
	}, []);
	
	async function fetchData() {
		const user = await bridge.send('VKWebAppGetUserInfo');
		setUser(user);
		if(blocker == 1) return;
		setBlocker(1);
		const raw = await fetch('http://localhost/get_user', {
			method: 'POST',
			body: JSON.stringify( { "id": user.id } ),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const authorised = await raw.json();
		if(!("vkid" in authorised)) {
			setActivePanel('auth');
		}
	}
	fetchData();

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	const go_from_auth = (e) => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	const go_to_message = (e, r) => {
		setActivePanel(e.currentTarget.dataset.to);
		setCurrentRoom(r);
	};

	const go_to_answer = (e, u, r) => {
		setActivePanel(e.currentTarget.dataset.to);
		setCurrentUser(u);
		setMyRoom(r);
	};

	const go_to_edit = (e, r) => {
		setActivePanel(e.currentTarget.dataset.to);
		setMyRoom(r);
	};
	
	return (
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={activePanel} >
					<Auth id='auth' go_from_auth={go_from_auth} fetchedUser={fetchedUser} />
					<Home id='home' fetchedUser={fetchedUser} go_to_message={go_to_message} go={go} />
					<Room id='room' room={currentRoom} go={go} fetchedUser={fetchedUser}/>
					<Myroom id='myroom' fetchedUser={fetchedUser} go_to_answer={go_to_answer} go={go} go_to_edit={go_to_edit} />
					<MyroomDialog id='myroomdialog' user={currentUser} go={go} myRoom={myRoom} />
					<EditRoom id='editroom' user={currentUser} go={go} myRoom={myRoom} />
				</View>
			</AppRoot>
		</AdaptivityProvider>
	);
}

export default App;
