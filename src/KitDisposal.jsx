import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import "./App.css";
import Headers from "./header";
import MiceLogo from "./assets/Img/M&M.png";
import MiceLogoWhite from "./assets/Img/White-m&m.webp";
import Artwork from "./assets/Img/Newartwork.webp";

const SHEETDB_API = import.meta.env.VITE_DATABASE;

const KitDisposal = () => {
  const { register, handleSubmit } = useForm();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // changes
  const ALLOWED_KIT_STATUSES = [
    "Old Registration Present",
    "New Registration Present",
  ];

  // 🔍 SEARCH USER BY PHONE
  const searchUser = async (data) => {
    const phone = data.phone.replace(/\D/g, "");

    setLoading(true);
    setLoadingMessage("Loading...");

    try {
      const response = await fetch(`${SHEETDB_API}/search?Phone=${phone}`);
      const result = await response.json();

      if (result.length > 0) {
        const user = result[0];

        setUserData({
          ...user,
          Kit: user.Kit?.trim() ? user.Kit : "Not updated",
        });
      } else {
        setUserData(null);
        Swal.fire({
          icon: "error",
          title: "Not Found",
          text: "No user found for this phone number!",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  // 🎁 UPDATE KIT STATUS
  // const updateKitStatus = async () => {
  //   if (!userData) return;

  //   if (userData.Kit === "Received") {
  //     Swal.fire({
  //       icon: "info",
  //       title: "Already Updated",
  //       text: "Kit already marked as received.",
  //     });
  //     return;
  //   }

  //   setLoading(true);
  //   setLoadingMessage("Updating kit...");

  //   try {
  //     const response = await fetch(`${SHEETDB_API}/Phone/${userData.Phone}`, {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         data: [{ Kit: "Received" }],
  //       }),
  //     });

  //     if (response.ok) {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Success",
  //         text: "Kit marked as received!",
  //       });

  //       setUserData({
  //         ...userData,
  //         Kit: "Received",
  //       });
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: "Failed to update kit status!",
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //     setLoadingMessage("");
  //   }
  // };

  const updateKitStatus = async () => {
    if (!userData) return;

    // ❌ Not eligible for kit
    if (!ALLOWED_KIT_STATUSES.includes(userData["Registration Status"])) {
      Swal.fire({
        icon: "warning",
        title: "Not Eligible",
        text: "Kit can only be issued after registration is marked present.",
      });
      return;
    }

    // ❌ Already received
    if (userData.Kit === "Received") {
      Swal.fire({
        icon: "info",
        title: "Already Updated",
        text: "Kit already marked as received.",
      });
      return;
    }

    setLoading(true);
    setLoadingMessage("Updating kit...");

    try {
      const response = await fetch(`${SHEETDB_API}/Phone/${userData.Phone}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [{ Kit: "Received" }],
        }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Kit marked as received!",
        });

        setUserData({
          ...userData,
          Kit: "Received",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update kit status!",
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
          <div className="search__data">
            <h3 className="dataHead">
              Search Phone Number for Kit Distribution
            </h3>

            <div className="fetching__data">
              <div>
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

                {/* USER DETAILS */}
                {userData && (
                  <div className="user-card fetching__data">
                    <div className="imn">
                      <h4 className="text-center update_text">User Details</h4>

                      <p>
                        <strong>Name:</strong> {userData.Name}
                      </p>
                      <p>
                        <strong>Email:</strong> {userData.Email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {userData.Phone}
                      </p>
                      {/* <p>
                        <strong>Organization:</strong> {userData.Organisation}
                      </p> */}
                      <p>
                        <strong>Registration Status:</strong>{" "}
                        {userData["Registration Status"]}
                      </p>
                      <p>
                        <strong>Kit:</strong> {userData.Kit}
                      </p>

                      {userData.Kit !== "Received" && (
                        <div className="btn_Select">
                          <button
                            className="button__mark"
                            onClick={updateKitStatus}
                            disabled={loading}
                          >
                            {loading && loadingMessage === "Updating kit..."
                              ? "Updating..."
                              : "Update as Received"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="belowImage">
          <img src={Artwork} alt="Caho_Diagnostion_Icon" />
        </div>

        <footer className="py-3">
          <div className="center_footer">
            <div className="footer_content">
              <p className="PoweredBy">Powered By</p>
              <img src={MiceLogoWhite} alt="mice-logo" />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default KitDisposal;
