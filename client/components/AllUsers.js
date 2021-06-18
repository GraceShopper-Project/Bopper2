import React from "react";
import { connect } from "react-redux";
import { fetchUsers } from "../store/allUsers";

export class AllUsers extends React.Component {

   componentDidMount() {
      this.props.fetchUsers();
   }

   render() {
      const users = this.props.users || [];
      return (
        <div className="users">
            {users.map((user) => {
                return (
                  <div key={user.id}>
                    <h1>{user.name}</h1>
                    <i>
                      <h4>
                          <p>{user.email}</p>
                      </h4>
                    </i>
                  </div>
                );
            })}
        </div>
      );
   }
}

const mapState = (state) => {
   return {
   users: state.users,
}};

const mapDispatch = (dispatch) => {
   return {
      fetchUsers: () => dispatch(fetchUsers())
   }
};

export default connect(mapState, mapDispatch)(AllUsers);