import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import StaticProfile from "../components/profile/StaticProfile";
import Scream from "../components/scream/Scream";
//MUO
import Grid from "@material-ui/core/Grid";
//Redux
import { connect } from "react-redux";
import { getUserScreams } from "../redux/actions/dataActions";
//Icons

class user extends Component {
  state = {
    profile: null
  };
  componentDidMount() {
    const handle = this.props.match.params.handle;
    this.props.getUserScreams(handle);
    axios
      .get(`/user/${handle}`)
      .then(res => {
        this.setState({
          profile: res.data.user
        });
      })
      .catch(err => console.log(err));
  }
  render() {
    const { screams, loading } = this.props.data;

    const userScreams = loading ? (
      <p>Loading...</p>
    ) : screams === null ? (
      <p>No screams from this user</p>
    ) : (
      screams.map(scream => <Scream key={scream.screamId} scream={scream} />)
    );

    console.log(this.state.profile);
    return (
      <Grid container spacing={2}>
        <Grid item sm={8} xs={12}>
          {userScreams}
        </Grid>
        <Grid item sm={4} xs={12}>
          {this.state.profile ? <StaticProfile profile={this.state.profile} /> : <p>Loading..</p>}
        </Grid>
      </Grid>
    );
  }
}

user.propTypes = {
  getUserScreams: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.data
});

export default connect(mapStateToProps, { getUserScreams })(user);
