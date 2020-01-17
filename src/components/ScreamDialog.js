import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from "../utils/MyButton";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";

//MUI

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
// Icons
import CloseIcon from "@material-ui/icons/Close";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import ChatIcon from "@material-ui/icons/Chat";
//Redux
import { connect } from "react-redux";
import { getScream } from "../redux/actions/dataActions";

const styles = theme => ({
  ...theme.spreadThis,
  invisibleSeparator: {
    border: "none",
    margin: 4
  },
  profileImage: {
    maxWidth: 200,
    height: 200,
    borderRadius: "50%",
    objectFit: "cover"
  },
  dialogContent: {
    padding: 20
  },
  closeButton: {
    position: "absolute",
    right: "1rem"
  },
  expandButton: {
    position: "absolute",
    right: "1rem"
  },
  spinner: {
    textAlign: "center",
    marginTop: 50,
    marginBottom: 50
  }
});

class ScreamDialog extends Component {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({
      open: true
    });
    this.props.getScream(this.props.screamId);
  };

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  render() {
    console.log(this.props);
    const {
      classes,
      scream: {
        screamId,
        createdAt,
        body,
        likeCount,
        commentCount,
        userImage,
        userHandle
      },
      UI: { loading }
    } = this.props;

    const dialogMarkup = loading ? (
      <div className={classes.spinner}>
        <CircularProgress size={200} thickness={2} />
      </div>
    ) : (
      <Grid container spacing={4}>
        <Grid item sm={5}>
          <img src={userImage} alt="Profile" className={classes.profileImage} />
        </Grid>
        <Grid item sm={7}>
          <Typography
            component={Link}
            color="primary"
            variant="h5"
            to={`/users/${userHandle}`}
          >
            @{userHandle}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).format("h:mm a, DD MMM YYYY")}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body1">{body}</Typography>
          <LikeButton screamId={screamId} />
          <span>{likeCount} likes</span>
          <MyButton tip="comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} comments</span>
        </Grid>
      </Grid>
    );

    return (
      <Fragment>
        <MyButton
          onClick={this.handleOpen}
          tip="Expand scream"
          tipClassName={classes.expandButton}
        >
          <UnfoldMoreIcon color="primary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <MyButton
            tip="Close"
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </MyButton>
          <DialogContent className={classes.DialogContent}>
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}
ScreamDialog.propTypes = {
  getScream: PropTypes.func.isRequired,
  screamId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  scream: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  scream: state.data.scream,
  UI: state.UI
});

const mapActionsToProps = {
  getScream
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(ScreamDialog));
