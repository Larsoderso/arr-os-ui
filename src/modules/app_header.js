import React, { useState } from "react";
import ReactDOM from "react-dom";
import Avatar from "@atlaskit/avatar";

function AppHeader(props) {
  return (
    <div className="inapp_header">
      <svg
        width={53}
        height={42}
        viewBox="0 0 53 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "40px", height: "55px", marginLeft: "12px" }}
      >
        <circle
          cx="31.7999"
          cy={21}
          r="19.75"
          transform="rotate(90 31.7999 21)"
          stroke="#56B2AD"
          strokeWidth="2.5"
        />
        <mask
          id="mask0"
          mask-type="alpha"
          maskUnits="userSpaceOnUse"
          x={-1}
          y={0}
          width={43}
          height={42}
        >
          <circle
            cx="20.9999"
            cy={21}
            r={21}
            transform="rotate(90 20.9999 21)"
            fill="#C4C4C4"
          />
        </mask>
        <g mask="url(#mask0)">
          <path
            d="M39.9994 10.8008L11.5994 39.2008"
            stroke="#647881"
            strokeWidth="2.5"
          />
          <path
            d="M42.7993 17.2002L17.5993 42.0002"
            stroke="#647881"
            strokeWidth="2.5"
          />
          <path
            d="M46.7993 22L21.5993 46.8"
            stroke="#647881"
            strokeWidth="2.5"
          />
          <path
            d="M35.9993 6.40039L6.39933 35.6004"
            stroke="#647881"
            strokeWidth="2.5"
          />
          <path
            d="M31.1995 2.40039L1.99952 30.8004"
            stroke="#647881"
            strokeWidth="2.5"
          />
          <path
            d="M26.3994 -1.59961L-2.80065 26.8004"
            stroke="#647881"
            strokeWidth="2.5"
          />
          <path
            d="M21.5995 -5.59961L-7.60045 22.8004"
            stroke="#647881"
            strokeWidth="2.5"
          />
        </g>
      </svg>

      <div
        style={{
          display: "flex",
          paddingTop: "8px",
          paddingBottom: "8px",
          marginLeft: "auto"
        }}
      >
        <div
          onClick={() => props.onDemo("0px")}
          style={{
            width: "43px",
            height: "39px",
            background: "#56B2AD",
            borderRadius: "5px"
          }}
        >
          A
        </div>
        <div className="app_header_us_bx">
          {" "}
          <Avatar name="small" size="medium" color="red" presence="focus" />
        </div>
      </div>
    </div>
  );
}

export default AppHeader;
