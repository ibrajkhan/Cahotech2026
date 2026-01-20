import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import "./App.css";
import Headers from "./header";
import BelowImage from "./assets/Img/belowImage1.jpg";
import MiceLogo from "./assets/Img/M&M.png";

const SHEETDB_API = import.meta.env.VITE_SEARCH_REQUESTDB;

const App = () => {
  const { register, handleSubmit } = useForm();
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const searchUser = async (data) => {
    setLoading(true);
    setLoadingMessage("Loading...");
    try {
      const response = await fetch(`${SHEETDB_API}/search?id=${data.name}`);
      const result = await response.json();

      if (result.length > 0) {
        setUserData(result);
        setSelectedUser(null);
      } else {
        setUserData([]);
        setSelectedUser(null);
        Swal.fire({
          icon: "error",
          title: "Not Found",
          text: "No data found for the given ID!",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const updateUserStatus = async (status) => {
    if (!selectedUser) {
      Swal.fire({
        icon: "warning",
        title: "Select User",
        text: "Please select a user before updating the status!",
      });
      return;
    }
    setLoading(true);
    setLoadingMessage("Updating data...");

    try {
      const response = await fetch(`${SHEETDB_API}/id/${selectedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [{ Recieved: status }],
        }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data updated successfully!",
        });

        const updatedUser = {
          ...selectedUser,
          Recieved: status,
        };
        setSelectedUser(updatedUser);
        setUserData((prevData) =>
          prevData.map((user) =>
            user.id === selectedUser.id ? updatedUser : user
          )
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update data!",
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <div>
      <Headers />
      <div className="odm">
        <div className="container">
          <div className="search__data">
            <h3 className="dataHead">
              Search your employee code and share the information with MICE &
              More Team
            </h3>

            <div className="fetching__data">
              <div>
                {/* <h5 className="searchNam">Insert Your Employee id</h5> */}
                <form onSubmit={handleSubmit(searchUser)}>
                  <input
                    {...register("name")}
                    placeholder="Insert Your Emp. ID"
                    required
                    className="input__name"
                  />
                  <button
                    type="submit"
                    className="search__button "
                    disabled={loading}>
                    {loading && loadingMessage === "Loading..."
                      ? "Loading..."
                      : "Search"}
                  </button>
                </form>

                {loading && <p className="loading_message">{loadingMessage}</p>}

                {!selectedUser && userData.length > 0 && (
                  <div>
                    <h4 className="text-center"></h4>
                    {userData.map((user, index) => (
                      <div key={index} className="user-card fetching__data">
                        <div className="imn ">
                          <h4 className="text-center update_text">
                            Employee Details
                          </h4>
                          <p className="">
                            <p className="">
                              <strong>Employee ID:</strong> {user.id}
                            </p>
                            <strong>Name:</strong> {user.name}
                          </p>

                          <p className="">
                            <strong>Email:</strong> {user.email}
                          </p>
                          <p className="">
                            <strong>Phone:</strong> {user.phone}
                          </p>
                          <p className="">
                            <strong>T-Shirt Size:</strong> {user.Size}
                          </p>
                          {/* <p className="">
                            <strong>Organization:</strong> {user.organization}
                          </p> */}
                          <p className="">
                            <strong>Kit & T-Shirt Recieved: </strong>{" "}
                            {user.Recieved || "Not updated"}
                          </p>
                          <div className="btn_Select">
                            <button
                              className="select__button "
                              onClick={() => setSelectedUser(user)}>
                              Select
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedUser && (
                  <>
                    <div className=" imn mt-5">
                      <h4 className="text-center update_text">
                        Employee Details
                      </h4>
                      <p className="">
                        <strong>Employee ID:</strong> {selectedUser.id}
                      </p>
                      <p>
                        <strong>Name:</strong> {selectedUser.name}
                      </p>

                      <p>
                        <strong>Email:</strong> {selectedUser.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {selectedUser.phone}
                      </p>
                      <p className="">
                        <strong>T-Shirt Size:</strong> {selectedUser.Size}
                      </p>
                      {/* <p>
                        <strong>Organization:</strong>{" "}
                        {selectedUser.organization}
                      </p> */}
                      <p>
                        <strong>Kit & T-Shirt Recieved: </strong>{" "}
                        {selectedUser.Recieved || "Not updated"}
                      </p>

                      {/* Show update buttons only if not already updated with "Yes" */}
                      {selectedUser.Recieved !== "Yes" && (
                        <div className="btn_Select">
                          <button
                            className="button__mark"
                            onClick={() => updateUserStatus("Yes")}
                            disabled={loading}>
                            {loading && loadingMessage === "Updating data..."
                              ? "Updating..."
                              : "Update as Received"}
                          </button>
                          {/* <button
                          className="button__mark hi"
                          onClick={() => updateUserStatus("No")}
                          disabled={loading}>
                          {loading && loadingMessage === "Updating data..."
                            ? "Updating..."
                            : "Mark No"}
                        </button> */}
                        </div>
                      )}
                    </div>
                    <div className="btn_Select">
                      <button
                        className="select__button mt-3"
                        onClick={() => setSelectedUser(null)}>
                        Back
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="belowImage">
          <img src={BelowImage} alt="Caho_Diagnostion_Icon" />
        </div>
        <footer className="py-3">
          <div className="center_footer">
            <div className="footer_content">
              <p className="PoweredBy">Powered By</p>
              <img src={MiceLogo} alt="mice-logo" />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
