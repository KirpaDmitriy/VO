import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Panel, PanelHeader, Header, FixedLayout, Group, Cell, Avatar, SplitLayout, Banner, ModalCard, ModalRoot, HorizontalCell } from '@vkontakte/vkui';
import { Icon56SearchOutline, Icon28Messages, Icon28TearOffFlyerOutline, Icon28LikeOutline, Icon28LikeFillRed } from '@vkontakte/icons';

import persik from '../img/persik.png';
import one_more_persik from '../img/one_more_persik.png';
import hunting_persik from '../img/hunting_persik.png';
import persik_traveller from '../img/persik_traveller.png';
var persiks = [persik, one_more_persik, hunting_persik, persik_traveller];

const INFO_WINDOW = 4800;


const Home = ({ id, fetchedUser, go_to_message, go }) => {
	const [activeModal, setActiveModal] = useState(null);
	const [activeModalText, setActiveModalText] = useState(null);
	const [passiveModalOutput, setPassiveModalOutput] = useState(null);
	const [passiveModalNumbba, setPassiveModalNumbba] = useState(null);
	const [shownRoomRate, setShownRoomRate] = useState(null);
	const [fetchedRooms, setRooms] = useState([]);

	async function renewLikeList() {
		let likestmp = [];
		for(let rms in fetchedRooms) {
			let liked = await fetch("http://localhost/are_connected", {
				method: 'POST',
				body: JSON.stringify({"userid": fetchedUser.id, "roomid": fetchedRooms[rms].id}),
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(response => response.json());
			likestmp.push(liked);
		}
	}

	async function fetchData() {
		if(fetchedRooms.length === 0 && fetchedUser !== null) {
			let user = await fetch('http://localhost/get_user', {
				method: 'POST',
				body: JSON.stringify({"id": fetchedUser.id}),
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(response => response.json());
			let rooms = await fetch('http://localhost/dorm_rooms', {
				method: 'POST',
				body: JSON.stringify(user.dorm),
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(response => response.json());
			setRooms(rooms);
			renewLikeList();
		}
	}
	fetchData();

	function RoomButton(props) {
		return (<Icon28Messages onClick={(event) => {
				go_to_message(event, props.where)
			}
		} data-to='room' />);
	}

	function InfoButton(props) {
		return ( <Icon28TearOffFlyerOutline onClick={
			() => {
				setActiveModal(INFO_WINDOW);
				setActiveModalText(props.name);
				setPassiveModalNumbba(props.number);
				setPassiveModalOutput(props.description);
				setShownRoomRate(props.rate);
			}
		}
		/>
		);
	}

	function LikeButton() {
		const [myLike, setMyLike] = useState(0);
		return ( (myLike === 0)? <Icon28LikeOutline onClick={() => {
					setMyLike(1);
			} }/> :
			<Icon28LikeFillRed onClick={() => {
				setMyLike(0);
			} }/>
		);
	}
	
	function render() {
        	let texts = [];
        	for(let room in fetchedRooms) {
				texts.push(<Banner key={room} before={<Avatar size={96} mode='image' src={fetchedRooms[room].ava} />} header={fetchedRooms[room].number} subheader={fetchedRooms[room].name}
							   actions={
								   <div style={{ margin: "1%", color: "blue", display: "flex" }}>
									   <HorizontalCell><RoomButton where={fetchedRooms[room]}
											   displayText='Написать'/></HorizontalCell>
									   <HorizontalCell><InfoButton name={fetchedRooms[room].name} number={fetchedRooms[room].number} description={fetchedRooms[room].description} rate={fetchedRooms[room].rate} /></HorizontalCell>
									   <HorizontalCell><LikeButton /></HorizontalCell>
								   </div>
							   }
			/>);
        	}
		return texts;
	}
	
	const modal = () => {
			return (<ModalRoot
            			activeModal={activeModal}
            			onClose={() => {setActiveModal(null)}}>
				<ModalCard
					id={INFO_WINDOW}
					onClose={() => {setActiveModal(null)}}
					icon={<Icon56SearchOutline />}
					header={"Досье на комнату " + passiveModalNumbba + " '" + activeModalText + "'"}
					subheader={"Рейтинг: " + shownRoomRate}
					actions={
						<Group>
							<Cell><SplitLayout style={{ justifyContent: "center" }}>
								{ passiveModalOutput }
							</SplitLayout></Cell>
						</Group>
					}
				></ModalCard>
			</ModalRoot>);
	};
	
	return (<SplitLayout modal={modal()}><Panel id={id}>
		<PanelHeader>ВОбщаге</PanelHeader>
		{fetchedUser &&
		<Group header={<Header mode="secondary">Хто я?</Header>} onClick={go} data-to='myroom'>
			<Cell
				before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
				description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
			>
				{`${fetchedUser.first_name} ${fetchedUser.last_name}`}
			</Cell>
		</Group>}
		<Group header={<Header mode="secondary">Список комнат</Header>}>
			{
				render()
			}
		</Group>
	</Panel></SplitLayout>
	);
}

Home.propTypes = {
	id: PropTypes.string.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Home;