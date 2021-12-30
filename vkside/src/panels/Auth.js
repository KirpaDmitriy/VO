import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Panel, PanelHeader, CustomSelect, SplitLayout, Button, FormItem } from '@vkontakte/vkui';

import hi from '../img/hi.png';

const Auth = ({ id, go_from_auth, fetchedUser }) => {
	const [room, setRoom] = useState(null);
	const [dorm, setDorm] = useState(null);
	const [rooms, setDormRooms] = useState([]);
	const [dorms, setDormsList] = useState([]);
	async function fetch_dorms() {
		if(dorms.length !== 0) return;
		var alldorms = await fetch('http://localhost/all_dorms').then(response => response.json());
		var menu_form = [];
		for(var drm in alldorms) {
			menu_form.push({label: alldorms[drm].name, value: alldorms[drm].id});
		}
		setDormsList(menu_form);
	}
	fetch_dorms();

	async function fetch_rooms() {
		var dormrooms = await fetch('http://localhost/dorm_rooms', {
			method: 'POST',
			body: JSON.stringify(dorm),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(response => response.json());
		let menu_form = [];
		for(let drm in dormrooms) {
			menu_form.push({label: dormrooms[drm].number, value: dormrooms[drm].id});
		}
		setDormRooms(menu_form);
	}
	return (<Panel id={id}>
		<PanelHeader>Ты чьих будешь?</PanelHeader>
		<SplitLayout style={{ justifyContent: "center" }}>
			<img className="Spotty" src={hi} width={128} alt="Spotty"/>
		</SplitLayout>
		<FormItem top="Общежитие" bottom="Как жизнь?">
			<CustomSelect
				placeholder="Введите номер общежития"
				searchable
				options={dorms}
				onChange={(choice) => {setDorm(choice.target.value); fetch_rooms()}}
				onInputChange={(choice) => {setDorm(choice.target.value); fetch_rooms()}}
			/>
		</FormItem>
		<FormItem top="Комната" bottom="Как настроение?">
			<CustomSelect
				placeholder="Введите номер помещения"
				searchable
				options={rooms}
				onChange={(choice) => {setRoom(choice.target.value)}}
				onInputChange={(choice) => {setRoom(choice.target.value)}}
			/>
		</FormItem>
		<Button
			appearance="accent"
			mode="outline"
			disabled={false}
			loading={false}
			onClick={(event) => {const response = fetch('http://localhost/add_user',
				{
					method: 'POST',
					body: JSON.stringify( {
						'vkid': parseInt(fetchedUser.id),
						'dorm': dorm,
						'room': room,
						'firstname': fetchedUser.first_name,
					    'lastname': fetchedUser.last_name,
						'ava': fetchedUser.photo_200}
					),
					headers: {
						'Content-Type': 'application/json'
					}
				}); go_from_auth(event)}} data-to='home'
		>
			Погнали!
		</Button>
	</Panel>);
};

Auth.propTypes = {
	id: PropTypes.string.isRequired,
	go_from_auth: PropTypes.func.isRequired,
};

export default Auth;
