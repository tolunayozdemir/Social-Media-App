import React, { Component } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Scream from "../components/Scream";
import Profile from "../components/Profile";

const CancelToken = axios.CancelToken;

class home extends Component {
  state = {
    screams: null
  };
  requestSource = null;
  mounted = false;

  componentDidMount() {
    this.mounted = true;

    this.requestSource = CancelToken.source();
    axios
      .get("/screams", {
        cancelToken: this.requestSource.token
      })
      .then(res => {
        if (this.mounted) {
          this.setState({
            screams: res.data
          });
        } else console.log("Trying to call setState");
      })
      .catch(err => console.log(err));
  }

  componentWillUnmount() {
    this.mounted = false;
    // this.requestSource.cancel("Operation canceled by the user.");
  }

  render() {
    let recentScreamsMarkup = this.state.screams ? (
      this.state.screams.map(scream => {
        return <Scream scream={scream} key={scream.screamId} />;
      })
    ) : (
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={2}>
        <Grid item sm={8} xs={12}>
          {recentScreamsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

export default home;
