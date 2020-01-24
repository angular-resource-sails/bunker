import { emit } from "../../api";

/* actions */
export function roomUpdated(room) {
	return { type: "room/updated", room };
}

export function loadingMessages(roomId) {
	return { type: "message/loadingMany", roomId };
}

export function messageSent() {
	return { type: "message/sent" };
}

export function messageReceived(message) {
	return { type: "message/received", message };
}

export function messageHistoryReceived(roomId, messages) {
	return { type: "message/receivedHistory", roomId, messages };
}

export function messageUpdated(message) {
	return { type: "message/updated", message };
}

export function clearRoomMessages(roomId) {
	return { type: "message/clear", roomId };
}

export function sendRoomMessage(roomId, text) {
	return dispatch => {
		return emit("/room/message", { roomId, text }).then(() => {
			dispatch(messageSent());
		});
	};
}

export function loadRoomMessages(roomId, skip) {
	return dispatch => {
		dispatch(loadingMessages(roomId));
		return emit("/room/messages", { roomId, skip: skip || 0 }).then(messages =>
			dispatch(messageHistoryReceived(roomId, messages))
		);
	};
}

export const joinedRoom = room => ({ type: "room/joined", room });
export const joinRoom = roomId => dispatch => {
	return emit("/room/join", roomId).then(room => dispatch(joinedRoom(room)));
};

const handlers = {
	"init/received": (state, action) => ({
		...state,
		..._.keyBy(action.payload.rooms, "_id")
	}),
	"room/updated": (state, action) => ({
		...state,
		[action.room._id]: {
			...state[action.room._id],
			...action.room
		}
	}),
	// "@@router/LOCATION_CHANGE": state => setCurrentRoom({ ...state }),
	"message/loadingMany": (state, action) => ({
		...state,
		[action.roomId]: {
			...state[action.roomId],
			loading: true
		}
	}),
	"message/receivedHistory": (state, action) => ({
		...state,
		[action.roomId]: {
			...state[action.roomId],
			loading: false,
			fullHistoryLoaded: action.messages.length === 0
		}
	}),
	"message/clear": (state, action) => ({
		...state,
		[action.roomId]: {
			...state[action.roomId],
			fullHistoryLoaded: false
		}
	}),
	"room/joined": (state, action) => ({
		...state,
		[action.room._id]: {
			...state[action.room._id],
			...action.room
		}
	})
};

export default function(state = {}, action) {
	return handlers[action.type] ? handlers[action.type](state, action) : state;
}
