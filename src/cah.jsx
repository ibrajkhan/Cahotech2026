import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import "./App.css";
import Headers from "./header";
import MiceLogo from "./assets/Img/M&M.png";

const SHEETDB_API = import.meta.env.VITE_DATABASE;

const Caho = () => {
  const { register, handleSubmit, reset } = useForm();
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔍 SEARCH BY PHONE
  const searchUser = async (data) => {
    const phone = data.phone.replace(/\D/g, "");

    setLoading(true);
    try {
      const response = await fetch(`${SHEETDB_API}/search?Phone=${phone}`);
      const result = await response.json();

      if (result.length > 0) {
        // Force status display as "Old Registered"
        const updated = result.map((u) => ({
          ...u,
          "Registration Status": "Old Registered",
        }));

        setUserData(updated);
        setSelectedUser(null);
      } else {
        setUserData([]);
        Swal.fire({
          icon: "error",
          title: "Not Found",
          text: "No registration found for this phone number",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch data",
      });
    } finally {
      setLoading(false);
      reset();
    }
  };

  // 🔁 UPDATE REGISTRATION STATUS
  const updateUserStatus = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${SHEETDB_API}/Phone/${selectedUser.Phone}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
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
          title: "Updated",
          text: "Registration status updated successfully",
        });

        setSelectedUser({
          ...selectedUser,
          "Registration Status": "Old Registration Present",
        });
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update registration status",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* <Headers /> */}

      <div className="container mt-5">
        <h3 className="text-center mb-3">
          Search Registration by Phone Number
        </h3>

        {/* 🔍 SEARCH FORM */}
        <br />
        <form onSubmit={handleSubmit(searchUser)} className="text-center">
          <input
            {...register("phone")}
            placeholder="Enter Phone Number"
            required
            className="input__name"
          />
          <button type="submit" className="search__button" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* 📋 USER LIST */}
        {!selectedUser &&
          userData.map((user, index) => (
            <div key={index} className="user-card mt-4">
              <h4>Details</h4>
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
                <strong>Organisation:</strong> {user.Organisation}
              </p>
            </div>
          ))}

        {/* ✅ SELECTED USER */}
        {selectedUser && (
          <div className="user-card mt-5">
            <h4>Selected User</h4>
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
              <strong>Organisation:</strong> {selectedUser.Organisation}
            </p>
            <p>
              <strong>Registration Status:</strong>{" "}
              {selectedUser["Registration Status"]}
            </p>

            {selectedUser["Registration Status"] !==
              "Old Registration Present" && (
              <button
                className="button__mark"
                onClick={updateUserStatus}
                disabled={loading}
              >
                {loading ? "Updating..." : "Mark as Present"}
              </button>
            )}

            <button
              className="select__button mt-3"
              onClick={() => setSelectedUser(null)}
            >
              Back
            </button>
          </div>
        )}
      </div>

      {/* <footer className="py-3">
        <div className="center_footer">
          <p className="PoweredBy">Powered By</p>
          <img src={MiceLogo} alt="mice-logo" />
        </div>
      </footer> */}
    </div>
  );
};

export default Caho;
