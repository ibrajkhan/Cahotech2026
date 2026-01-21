import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import "./App.css";
import Headers from "./header";
import MiceLogo from "./assets/Img/M&M.png";

const SHEETDB_API = import.meta.env.VITE_DATABASE;

const Caho = () => {
  const { register, handleSubmit } = useForm();
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // 🔍 SEARCH BY PHONE (FAST)
  const searchUser = async (data) => {
    const phone = data.phone.replace(/\D/g, "");

    setLoading(true);
    setLoadingMessage("Loading...");

    try {
      const response = await fetch(`${SHEETDB_API}/search?Phone=${phone}`);
      const result = await response.json();

      if (result.length > 0) {
        const formatted = result.map((user) => ({
          ...user,
          "Registration Status": user["Registration Status"]?.trim()
            ? user["Registration Status"]
            : "Old Registered",
        }));

        setUserData(formatted);

        setUserData(formatted);
        setSelectedUser(null);
      } else {
        setUserData([]);
        setSelectedUser(null);
        Swal.fire({
          icon: "error",
          title: "Not Found",
          text: "No data found for this phone number!",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  // 🔁 UPDATE STATUS
  const updateUserStatus = async () => {
    if (!selectedUser) {
      Swal.fire({
        icon: "warning",
        title: "Select User",
        text: "Please select a user first!",
      });
      return;
    }

    setLoading(true);
    setLoadingMessage("Updating data...");

    try {
      const response = await fetch(
        `${SHEETDB_API}/Phone/${selectedUser.Phone}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: [
              {
                "Registration Status": "Old Registration Present",
              },
            ],
          }),
        },
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Registration status updated!",
        });

        const updatedUser = {
          ...selectedUser,
          "Registration Status": "Old Registration Present",
        };

        setSelectedUser(updatedUser);
        setUserData((prev) =>
          prev.map((u) => (u.Phone === selectedUser.Phone ? updatedUser : u)),
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update data!",
        });
      }
    } catch (error) {
      console.error(error);
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
          <div className="search__data_field">
            {/* <h3 className="dataHeadSearch">Search your Phone Number</h3> */}
            <h2 className="dataHead_sec text-center">
              Search your phone number
            </h2>

            <div className="fetching__data">
              <div className="input_search">
                {/* SEARCH FORM */}
                <form onSubmit={handleSubmit(searchUser)}>
                  <input
                    {...register("phone")}
                    placeholder="Insert Phone Number"
                    required
                    className="input__name"
                  />
                  <button
                    type="submit"
                    className="search__button"
                    disabled={loading}
                  >
                    {loading && loadingMessage === "Loading..."
                      ? "Loading..."
                      : "Search"}
                  </button>
                </form>

                {loading && <p className="loading_message">{loadingMessage}</p>}

                {/* LIST VIEW */}
                {!selectedUser && userData.length > 0 && (
                  <div>
                    {userData.map((user, index) => (
                      <div key={index} className="user-card fetching__data">
                        <div className="imn">
                          <h4 className="text-center update_text">Details</h4>

                          <p>
                            <strong>Name:</strong> {user.Name}
                          </p>
                          <p>
                            <strong>Email:</strong> {user.Email}
                          </p>
                          <p>
                            <strong>Phone:</strong> {user.Phone}
                          </p>
                          <p>
                            <strong>Organization:</strong> {user.Organisation}
                          </p>
                          <p>
                            <strong>Registration Status:</strong>{" "}
                            {user["Registration Status"]}
                          </p>

                          {user["Registration Status"] === "Old Registered" && (
                            <div className="btn_Select">
                              <button
                                className="select__button"
                                onClick={() => setSelectedUser(user)}
                              >
                                Select
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* SELECTED USER */}
                {selectedUser && (
                  <>
                    <div className="imn mt-5">
                      <h4 className="text-center update_text">User Details</h4>

                      <p>
                        <strong>Name:</strong> {selectedUser.Name}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedUser.Email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {selectedUser.Phone}
                      </p>
                      <p>
                        <strong>Organization:</strong>{" "}
                        {selectedUser.Organisation}
                      </p>
                      <p>
                        <strong>Registration Status:</strong>{" "}
                        {selectedUser["Registration Status"]}
                      </p>

                      {selectedUser["Registration Status"] ===
                        "Old Registered" && (
                        <div className="btn_Select">
                          <button
                            className="button__mark"
                            onClick={updateUserStatus}
                            disabled={loading}
                          >
                            {loading && loadingMessage === "Updating data..."
                              ? "Updating..."
                              : "Update as Present"}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="btn_Select">
                      <button
                        className="select__button mt-3"
                        onClick={() => setSelectedUser(null)}
                      >
                        Back
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* <footer className="py-3">
          <div className="center_footer">
            <div className="footer_content">
              <p className="PoweredBy">Powered By</p>
              <img src={MiceLogo} alt="mice-logo" />
            </div>
          </div>
        </footer> */}
      </div>
    </div>
  );
};

export default Caho;
