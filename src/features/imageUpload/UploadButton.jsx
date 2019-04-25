import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getActiveRoomId } from "../../selectors/selectors";
import { appendText } from "../input/chatInputReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {loadImage} from "./imageLoader.js";
import imageUpload from "./imageUpload.js";

const UploadContainer = styled.a`
	display: inline-block;
	background-color: transparent;
	position: relative;
	cursor: pointer;
`;

const FileUpload = styled.input`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
`;

const mapStateToProps = state => ({
	activeRoomId: getActiveRoomId(state)
});

const mapDispatchToProps = {
	appendText
};

class UploadButton extends React.Component {

	fileUploadElement = null;
	state = { uploading: false };

	uploadFile = (evt) => {
		this.setState({ uploading: true });

		const file = _.first(evt.target.files);

		loadImage(file)
			.then(loadedData => {
				return imageUpload.doSingleImageUpload(loadedData.data.split(",")[1]);
			})
			.then(imageUrl => {
				this.props.appendText(this.props.activeRoomId, imageUrl);
				this.fileUploadElement.value = "";
			})
			.finally(() => this.setState({ uploading: false }));
	};

	render() {

		if (!this.props.activeRoomId) {
			return null;
		}

		const iconToRender = this.state.uploading ? "spinner" : "cloud-upload-alt";
		const iconClasses = this.state.uploading ? "fa-spin" : "";

		return (
			<UploadContainer className="nav-item nav-link">
				<FontAwesomeIcon icon={iconToRender} className={iconClasses}/>
				<FileUpload ref={el => this.fileUploadElement = el} type="file" name="image" accept="image/*"
										onChange={this.uploadFile} />
			</UploadContainer>);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadButton);