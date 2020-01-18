import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import MyButton from "../../utils/MyButton";
//MUI
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
//Icon
import NotificationIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";
//Redux
import { connect } from "react-redux";
import { markNotificationsRead } from "../../redux/actions/userActions";

class Notifications extends Component {
  state = {
    anchorEl: null
  };

  handleOpen = e => {
    this.setState({
      anchorEl: e.target
    });
  };

  handleClose = e => {
    this.setState({
      anchorEl: null
    });
  };

  onMenuOpen = () => {
    let unreadNotificationsIds = this.props.notifications
      .filter(not => !not.read)
      .map(not => not.notificationId);
    this.props.markNotificationsRead(unreadNotificationsIds);
  };

  render() {
    const notifications = this.props.notifications;
    const anchorEl = this.state.anchorEl;
    const time = dayjs.extend(relativeTime);

    let notIcon;
    if (notifications && notifications.length > 0) {
      notifications.filter(not => not.read === false).length > 0
        ? (notIcon = (
            <Badge
              badgeContent={
                notifications.filter(not => not.read === false).length
              }
              color="secondary"
            >
              <NotificationIcon />
            </Badge>
          ))
        : (notIcon = <NotificationIcon />);
    } else {
      notIcon = <NotificationIcon />;
    }

    let notificationsMarkup =
      notifications && notifications.length > 0 ? (
        notifications.map(not => {
          const verb = not.type === "like" ? "liked" : "commented on";
          const time = dayjs(not.createdAt).fromNow();
          const iconColor = not.read ? "primary" : "secondary";

          const icon =
            not.type === "like" ? (
              <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
            ) : (
              <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
            );
          return (
            <MenuItem key={not.createdAt} onClick={this.handleClose}>
              {icon}
              <Typography
                component={Link}
                color="default"
                variant="body1"
                to={`users/${not.recipient}/scream/${not.screamId}`}
              >
                {not.sender} {verb} your scream {time}
              </Typography>
            </MenuItem>
          );
        })
      ) : (
        <MenuItem onClick={this.handleClose}>
          You have no notifications yet
        </MenuItem>
      );

    return (
      <Fragment>
        <Tooltip placement="top" title="Notifications">
          <IconButton
            arial-owns={anchorEl ? "simple-menu" : undefined}
            aria-haspopup="true"
            onClick={this.handleOpen}
          >
            {notIcon}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          onEntered={this.onMenuOpen}
        >
          {notificationsMarkup}
        </Menu>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  notifications: state.user.notifications
});

Notifications.propTypes = {
  markNotificationsRead: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired
};

export default connect(mapStateToProps, { markNotificationsRead })(
  Notifications
);
