import React, { useState } from "react";
import "./App.css";
import Headers from "./header";
import Caho from "./Caho";
import Onspot from "./Onspot";
import MiceLogo from "./assets/Img/M&M.png";

const Home = () => {
  const [selection, setSelection] = useState("");

  return (
    <div>
      <Headers />

      <div className="odm">
        <div className="container">
          <div className="search__data">
            <h2 className="dataHead text-center">Conference Registration</h2>

            {/* SELECT BOX */}
            <div className="fetching__data">
              <div className="text-center">
                <select
                  className="input__name"
                  value={selection}
                  onChange={(e) => setSelection(e.target.value)}
                >
                  <option value="">Select Registration Type</option>
                  <option value="old">Already Registered</option>
                  <option value="new">New Registration</option>
                </select>
              </div>
            </div>

            {/* CONDITIONAL RENDER */}
            {selection === "old" && <Caho />}
            {selection === "new" && <Onspot />}
          </div>
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

export default Home;
