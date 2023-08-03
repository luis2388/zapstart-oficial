import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import api from "../../services/api";
import Board from 'react-trello'

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(1)
	},

	paper: {
		padding: theme.spacing(2),
		display: "flex",
		alignItems: "center",
	},

	settingOption: {
		marginLeft: "auto",
	},
	margin: {
		margin: theme.spacing(1),
	},
}));


const Kanban = () => {
	const classes = useStyles();

	const [file, setFile] = useState({
		lanes: [
		  {
			id: 'lane1',
			title: 'Contato aberto',
			label: 'ZDG',
			cards: []
		  },
		  {
			id: 'lane2',
			title: 'Orçamento',
			label: 'ZDG',
			cards: []
		  },
		  {
			id: 'lane3',
			title: 'Proposta Enviada',
			label: 'ZDG',
			cards: []
		  },
		  {
			id: 'lane4',
			title: 'Fechado',
			label: 'ZDG',
			cards: []
		  }
		]
	  });
	
	  const fetchTickets = async () => {
		try {
		  const { data } = await api.get("/tickets", {});
		  console.log(data.tickets);
		  return data.tickets;
		} catch (err) {
		  console.log(err);
		  return [];
		}
	  };
	
	  const popularCards = async () => {
		try {
		  const tickets = await fetchTickets();
		  const cards = tickets
		  .filter(ticket => ticket.status === 'open')
		  .map(ticket => ({
			id: ticket.id.toString(),
			title: 'Ticket nº ' + ticket.id.toString(),
			description: ticket.contact.number + '\n\n' + ticket.lastMessage,
			label: ticket.contact.name,
			draggable: true,
		  }));
	
		  setFile(prevFile => ({
			...prevFile,
			lanes: prevFile.lanes.map(lane => {
			  if (lane.id === 'lane1') {
				return {
				  ...lane,
				  cards: cards
				};
			  }
			  return lane;
			})
		  }));
		} catch (err) {
		  console.log(err);
		}
	  };
	
	  useEffect(() => {
		popularCards();
		// eslint-disable-next-line
	  }, []);
	
	  const handleCardMove = (cardId, sourceLaneId, targetLaneId) => {
		setFile(prevFile => {
		  const updatedLanes = prevFile.lanes.map(lane => {
			if (lane.id === sourceLaneId) {
			  return {
				...lane,
				cards: lane.cards.filter(card => card.id !== cardId)
			  };
			}
			if (lane.id === targetLaneId) {
			  return {
				...lane,
				cards: [...lane.cards, prevFile.lanes.find(l => l.id === sourceLaneId).cards.find(c => c.id === cardId)]
			  };
			}
			return lane;
		  });
	
		  return {
			...prevFile,
			lanes: updatedLanes
		  };
		});
	  };
	
	  return (
		<div className={classes.root}>
		  <Board data={file} onCardMoveAcrossLanes={handleCardMove} />
		</div>
	  );

};

export default Kanban;
