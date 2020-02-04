import React, { useEffect, useState } from "react";
import Lorem from "react-lorem-component";
import Button from "@atlaskit/button";
import Modal, { ModalTransition } from "@atlaskit/modal-dialog";
import Tabs from "@atlaskit/tabs";

function Funnel() {
  const [opm, setopm] = useState();

  const tabs = [
    { label: "Integrations", content: <div>A</div> },
    { label: "Conected", content: <div>B</div> }
  ];

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Button onClick={() => setopm(true)}>Open Modal</Button>

      <ModalTransition>
        {opm && (
          <Modal width="large" height="100%" onClose={() => setopm(false)}>
            <Tabs
              tabs={tabs}
              onSelect={(_tab, index) => console.log("Selected Tab", index + 1)}
            />

            <Lorem count={2} />
          </Modal>
        )}
      </ModalTransition>

      <div
        style={{
          height: "100%",
          width: "280px",
          background: "#f2f4f414",
          flexShrink: 0,
          borderRight: "1px solid #f2f2f2"
        }}
      >
        <div
          style={{
            width: "100%",
            height: "50px",
            boxSizing: "border-box",
            padding: "8px 12px 8px 12px",
            display: "flex"
          }}
        >
          <div
            style={{
              color: "#4A5489",
              fontWeight: 600,
              lineHeight: "2px"
            }}
          >
            {" "}
            Integrations
            <svg
              width={22}
              height={22}
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginLeft: "auto" }}
            >
              <rect width={22} height={22} rx={3} fill="#EBF0F5" />
              <rect
                x="0.5"
                y="0.5"
                width={21}
                height={21}
                rx="2.5"
                stroke="#D1DAE1"
                strokeOpacity="0.5"
              />
              <path
                d="M11.8887 10.1357H15.457V11.6738H11.8887V15.7168H10.2539V11.6738H6.68555V10.1357H10.2539V6.40039H11.8887V10.1357Z"
                fill="#C0CCD8"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Funnel;
