import React from "react";
import styled from "styled-components";
import connect from "react-redux/es/connect/connect";
import theme from "../../constants/theme";
import { showMessageControls } from "../messageControls/messageControlsActions";

const Container = styled.div`
	position: relative;
	flex: 1;
	min-height: 30px;

	&.mention {
		background-color: ${theme.mentionBackgroundColor};
		color: ${theme.mentionForegroundColor};
	}

	&.selected {
		background-color: lightblue;
	}
`;

const mapStateToProps = (state, props) => ({
	localNick: state.localUser.nick,
	isSelectedMessage: state.messageControls.messageId === props.messageId
});

const mapDispatchToProps = {
	showMessageControls
};

class MessageBodyContainer extends React.Component {
	onClick = event => {
		this.props.showMessageControls(this.props.messageId, event.clientX, event.clientY);
	};

	render() {
		const { text, firstInSeries, localNick, isSelectedMessage } = this.props;
		const isUserMentioned = testTextForNick(text, localNick);

		return (
			<Container
				className={`px-2 ${firstInSeries ? "border-light border-top" : ""} ${isUserMentioned ? "mention" : ""} ${
					isSelectedMessage ? "selected" : ""
				}`}
				onClick={this.onClick}
			>
				{this.props.children}
			</Container>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MessageBodyContainer);

function testTextForNick(text, nick) {
	const mentionRegex = new RegExp(`${nick}\\b|@[Aa]ll\\b`, "i");
	return mentionRegex.test(text);
}
