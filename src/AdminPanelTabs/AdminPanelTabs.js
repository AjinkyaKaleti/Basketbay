import React, { useState } from "react";
import AddProducts from "../AddProducts/AddProducts";
import LineupOrders from "../LineupOrders/LineupOrders";
import "./AdminTabs.css";

function AdminTabs() {
  // Define your tabs here
  const tabs = [
    { id: "addProducts", label: "Add Products", content: <AddProducts /> },
    { id: "lineupOrders", label: "Lineup Orders", content: <LineupOrders /> },
    // Example of a disabled tab
    // {
    //   id: "misreport",
    //   label: "MIS Report",
    //   content: <div>MIS Report</div>,
    //   disabled: true,
    // },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="admin-tab-container">
      <ul className="nav nav-tabs">
        {tabs.map((tab) => (
          <li key={tab.id} className="nav-item">
            <button
              className={`nav-link ${activeTab === tab.id ? "active" : ""} ${
                tab.disabled ? "disabled" : ""
              }`}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              disabled={tab.disabled}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="tab-content mt-3">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-pane fade ${
              activeTab === tab.id ? "show active" : ""
            }`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminTabs;
