import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from "../utils/MyButton";
// Redux stuff
import { connect } from "react-redux";
import { postScream, clearErrors } from "../redux/actions/dataActions";
// MUI Stuff
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
// Icons
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

const styles = theme => ({
  ...theme.spreadThis,
  submitButton: {
    position: "relative",
    float: "right",
    marginBottom: 10,
    marginTop: 10
  },
  progressSpinner: {
    position: "absolute"
  },
  closeButton: {
    position: "absolute",
    right: "1rem",
    top: "6%"
  }
});

class PostScream extends Component {
  state = {
    open: false,
    body: "",
    error: {}
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors
      });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: "", open: false, errors: {} });
    }
  }

  handleOpen = () => {
    this.setState({
      open: true
    });
  };
  handleClose = () => {
    this.setState({
      open: false,
      errors: {}
    });
    this.props.clearErrors();
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });

    if (this.state.body) {
      this.props.UI.errors = {};
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.postScream({ body: this.state.body });
  };

  render() {
    const {
      classes,
      UI: { loading, errors }
    } = this.props;

    return (
      <Fragment>
        <MyButton onClick={this.handleOpen} tip="Post a Scream!">
          <AddIcon />
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
          <DialogTitle>Post a new scream</DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <TextField
                name="body"
                type="text"
                label="Scream"
                multiline
                rows="3"
                placeholder="Type your scream"
                error={errors ? true : false}
                helperText={errors ? errors.body : undefined}
                className={classes.textField}
                onChange={this.handleChange}
                fullWidth
              ></TextField>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submitButton}
                disabled={loading}
              >
                Submit
                {loading && (
                  <CircularProgress className={classes.progressSpinner} />
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

PostScream.propTypes = {
  postScream: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired
};

const mapstateToProps = state => ({
  UI: state.UI
});

export default connect(mapstateToProps, { postScream, clearErrors })(
  withStyles(styles)(PostScream)
);
