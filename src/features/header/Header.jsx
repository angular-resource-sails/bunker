import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { hasAnyUnreadMention, getTotalUnreadMessageCount } from "../../selectors/selectors";
import HeaderRoomLink from "./HeaderRoomLink.jsx";
import UnreadMessageBadge from "./UnreadMessageBadge.jsx";
import UploadButton from "../imageUpload/UploadButton.jsx";
import { getRoomIds } from "../../selectors/selectors.js";

class Header extends React.Component {
	render() {
		const { roomIds, totalUnreadMessageCount, anyUnreadMention } = this.props;
		return (
			<div>
				<nav className="navbar navbar-expand fixed-top navbar-dark bg-dark">
					<Link className="navbar-brand" to="/2/lobby">
						Bunker{" "}
						{totalUnreadMessageCount > 0 && (
							<UnreadMessageBadge className={`badge badge-primary d-md-none ${anyUnreadMention ? "mention" : ""}`}>
								{totalUnreadMessageCount}
							</UnreadMessageBadge>
						)}
					</Link>
					<ul className="navbar-nav d-none d-md-flex">
						{_.map(roomIds, id => (
							<HeaderRoomLink key={id} roomId={id} />
						))}
					</ul>
					<div className="ml-auto navbar-nav text-right">
						<UploadButton />
						<Link className="nav-item nav-link" to={`/2/settings`}>
							<FontAwesomeIcon icon="cog" />
						</Link>
					</div>
				</nav>
			</div>
		);
	}
}

const mapStateToProps = createStructuredSelector({
	roomIds: getRoomIds,
	totalUnreadMessageCount: getTotalUnreadMessageCount,
	anyUnreadMention: hasAnyUnreadMention
});

export default connect(mapStateToProps)(Header);
