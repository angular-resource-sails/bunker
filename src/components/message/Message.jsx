import React from "react";
import {connect} from "react-redux";
import Author from "./Author.jsx";
import MessageBody from "./MessageBody.jsx";

const mapStateToProps = (state, ownProps) => ({
	author: state.users[ownProps.message.author]
});

class Message extends React.Component {
	render() {
		const {message, previous, author} = this.props;
		const firstInSeries = !previous || !previous.author || !message.author || previous.author !== message.author;
		return (
			<div>
				<Author author={author} firstInSeries={firstInSeries}/>
				<MessageBody message={message} author={author} firstInSeries={firstInSeries}/>
			</div>
		)
	}
}

export default connect(mapStateToProps)(Message);