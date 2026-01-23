import React, { useState } from "react";
import "./App.css";
import Headers from "./header";
import Caho from "./Caho";
import Onspot from "./Onspot";
import MiceLogo from "./assets/Img/M&M.png";
import MiceLogoWhite from "./assets/Img/White-m&m.webp";
import Artwork from "./assets/Img/Newartwork.webp";

const Home = () => {
  const [selection, setSelection] = useState(""); // default tab

  return (
    <div>
      <Headers />

      <div className="odm">
        <div className="container">
          <div className="search__data">
            <h2 className="dataHead text-center">Conference Registration</h2>

            {/* TAB BUTTONS */}
            <div className="fetching__data">
              <div className="btn_Select text-center">
                <button
                  className={`select__button ${
                    selection === "old" ? "active_tab" : ""
                  }`}
                  onClick={() => setSelection("old")}
                >
                  Already Registered
                </button>

                <button
                  className={`select__button ms-2 ${
                    selection === "new" ? "active_tab" : ""
                  }`}
                  onClick={() => setSelection("new")}
                >
                  New Registration
                </button>
              </div>
            </div>

            {/* CONDITIONAL RENDER */}
            {selection === "old" && <Caho />}
            {selection === "new" && <Onspot />}
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

export default Home;
