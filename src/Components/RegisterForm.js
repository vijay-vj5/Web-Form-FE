import React, { useState, useEffect } from "react";
import "../Styles/RegisterForm.css";


export const RegisterForm = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [editUserId, setEditUserId] = useState(null);

  //Create a React useEffect hook that utilizes the fetch API to retrieve a list of all users from a database and executes the side effect when the component mounts to the screen.
  useEffect(() => {
    fetch("https://webform-nq41.onrender.com/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  //Define a handleSubmit function in React that triggers a PUT request to update existing data in a database if the user edits data, or a POST request to store new data in the database if no existing data is being edited, upon submission of a form.
  const handleSubmit = (event) => {
    event.preventDefault();

    const user = {
      name,
      mobile,
      email,
    };

    //Implement a conditional statement in JavaScript that checks if all fields in a form are filled. If any fields are empty, throw an alert message to prompt the user to fill in all required fields.
    if (
      !name ||
      !mobile ||
      !email 
    ) {
      alert("Please fill all the fields");
      return;
    }
    
    // Checks if name is valid
    if (name.length < 5) {
      alert("Name must be at least 5 characters long");
      return;
    }

    // Checks if email is valid
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address");
      return;
    }
    // Checks if mobile is valid
    if (mobile.length > 10 || mobile.length < 10) {
      alert("Mobile number must be 10 digits long and contain only numbers");
      return;
    }

    //Implement a conditional statement in React that checks if the editUserId stored in state is not null. If editUserId is not null, a PUT request will be sent to the server to allow the user to edit and update existing data in the database.
    //If editUserId is null, a POST request will be sent to the server to allow the user to store new data in the database.
    if (editUserId) {
      fetch(`https://webform-nq41.onrender.com/users/${editUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })
        .then((response) => response.json())
        .then((updatedUser) => {
          setUsers((prevUsers) =>
            prevUsers.map((u) => (u._id === updatedUser._id ? updatedUser : u))
          );
          setEditUserId(null);
          setName("");
          setMobile("");
          setEmail("");
        })
        .catch((error) => console.log(error));
    } else {
      fetch("https://webform-nq41.onrender.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })
        .then((response) => response.json())
        .then((newUser) => {
          setUsers((prevUsers) => [...prevUsers, newUser]);
          setName("");
          setMobile("");
          setEmail("");
        })
        .catch((error) => console.log(error));
    }
  };

  //Define a handleDelete function in React that is triggered when a user clicks on a delete button. The function should utilize the DELETE request method to delete the corresponding user from the database.
  const handleDelete = (id) => {
    fetch(`https://webform-nq41.onrender.com/users/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((u) => u._id !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Create a handleEdit function in React that updates the editUserId state with the corresponding user_id when the user clicks on an edit button.
  //This function should utilize the setEditUserId update function and, when the editUserId state changes to a user_id value instead of null, it should send a PUT request to the server to update the data.
  const handleEdit = (user) => {
    setName(user.name);
    setMobile(user.mobile);
    setEmail(user.email);
    setEditUserId(user._id);
  };

  return (
    <div>
      <h1 className="from_heading">Registration Form</h1>
      <div className="register_form">
        <form onSubmit={handleSubmit} className="form_control">
          <h2 className="from_heading">
            Welcome 
          </h2>
          <label className="label_name">
            Name :
            <br />
            <input
              className="input_field"
              type="text"
              placeholder="Enter your full name here"
              style={{ width: "400px", height: "30px" }}
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </label>
          <br />
          <label className="label_name">
            Mobile Number :
            <br />
            <input
              className="input_field"
              type="number"
              // maxLength="10"
              placeholder="Enter your mobile number here"
              style={{ width: "400px", height: "30px" }}
              value={mobile}
              onChange={(event) => {
                setMobile(event.target.value);
              }}
            />
          </label>
          <br />
          <label className="label_name">
            Email ID :
            <br />
            <input
              className="input_field"
              type="email"
              placeholder="Enter Valid Email"
              style={{ width: "400px", height: "30px" }}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </label>
          <br />
          
          <button type="submit" className="register_btn">
            {editUserId ? "Update" : "Register"}
          </button>
        </form>
      </div>
      <div>
        <h2 className="from_heading">User Details :</h2>
        <div>
          <table>
            <thead>
              <tr>
                
                <th>Name</th>
                <th>Mobile No</th>
                <th>Email</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  
                  <td>{user.name}</td>
                  <td>{user.mobile}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className="action_btn"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    </td>
                    <td>
                    <button
                      className="action_btn"
                      onClick={() => {
                        handleDelete(user._id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
