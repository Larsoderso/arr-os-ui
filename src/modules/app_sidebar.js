import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function AppSidebar() {
  return (
    <div className="inapp_sidebar">
      {" "}
      <div style={{ padding: "18px" }}>
        <div style={{ display: "flex", paddingTop: "12px" }}>
          <svg
            width={28}
            height={23}
            viewBox="0 0 28 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x={1}
              y={1}
              width={6}
              height={21}
              rx={1}
              stroke="#7C97A3"
              strokeWidth={2}
            />
            <rect
              x={11}
              y={1}
              width={6}
              height={21}
              rx={1}
              stroke="#7C97A3"
              strokeWidth={2}
            />
            <rect
              x={21}
              y={1}
              width={6}
              height={21}
              rx={1}
              stroke="#7C97A3"
              strokeWidth={2}
            />
          </svg>

          <div className="app_sbar_it_txt">Overview</div>
        </div>
        <div style={{ display: "flex", paddingTop: "12px" }}>
          <svg
            width={30}
            height={37}
            viewBox="0 0 30 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 27.4545V10.9091L15 2L29 10.9091V27.4545L15 35.0909L1 27.4545Z"
              stroke="#7C97A3"
              strokeWidth="1.7"
            />
            <path
              d="M6.09201 13.4541L15.0011 18.545L23.9102 13.4541"
              stroke="#7C97A3"
              strokeWidth="1.7"
            />
            <path d="M15 18.5459V27.455" stroke="#7C97A3" strokeWidth="1.7" />
          </svg>
          <div className="app_sbar_it_txt">Data</div>
        </div>
        <Link to="/about">
          <div style={{ display: "flex", paddingTop: "12px" }}>
            <svg
              width={28}
              height={33}
              viewBox="0 0 28 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.61194 32.061L0 26.6281V5.52365L9.61194 0.0908203L28 10.5386V21.4042L9.61194 32.061Z"
                fill="#7C97A3"
              />
              <path
                d="M7.94109 29.1361L1.25452 25.1659V17.6436L7.94109 21.4047V29.1361Z"
                fill="#FAFAFA"
              />
              <path
                d="M7.94109 19.1048L1.25452 15.1347V7.6123L7.94109 11.3735V19.1048Z"
                fill="#FAFAFA"
              />
              <path
                d="M16.7184 24.5394L10.0319 20.5693V13.0469L16.7184 16.8081V24.5394Z"
                fill="#FAFAFA"
              />
              <path
                d="M15.8789 5.73285L9.40126 9.49404L2.65673 5.61083L9.19231 1.7627L15.8789 5.73285Z"
                fill="#FAFAFA"
              />
              <path
                d="M24.4483 10.3295L17.9707 14.0907L11.2262 10.2075L17.7617 6.35938L24.4483 10.3295Z"
                fill="#FAFAFA"
              />
            </svg>
            <div className="app_sbar_it_txt">API</div>
          </div>
        </Link>
        <Link to="/about">
          <div style={{ display: "flex", paddingTop: "12px" }}>
            <svg
              width={35}
              height={27}
              viewBox="0 0 27 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="13.5" cy="13.5" r="13.5" fill="#7C97A3" />
              <path
                d="M17.5303 13.5303C17.8232 13.2374 17.8232 12.7626 17.5303 12.4697L12.7574 7.6967C12.4645 7.40381 11.9896 7.40381 11.6967 7.6967C11.4038 7.98959 11.4038 8.46447 11.6967 8.75736L15.9393 13L11.6967 17.2426C11.4038 17.5355 11.4038 18.0104 11.6967 18.3033C11.9896 18.5962 12.4645 18.5962 12.7574 18.3033L17.5303 13.5303ZM0 13.75H17V12.25H0V13.75Z"
                fill="#FAFAFA"
              />
            </svg>
            <div className="app_sbar_it_txt">API</div>
          </div>
        </Link>
        <Link to="/about">
          <div style={{ display: "flex", paddingTop: "12px" }}>
            <svg
              width={30}
              height={20}
              viewBox="0 0 30 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx={3} cy={3} r={2} stroke="#7C97A3" strokeWidth={2} />
              <circle cx={3} cy={16} r={2} stroke="#7C97A3" strokeWidth={2} />
              <circle cx={27} cy={3} r={2} stroke="#7C97A3" strokeWidth={2} />
              <path d="M5 3H25" stroke="#7C97A3" strokeWidth={2} />
              <path
                d="M3 5.5V14"
                stroke="#7C97A3"
                strokeWidth={2}
                strokeDasharray="3 2"
              />
              <path
                d="M25 5C25 5 21.0964 10.4449 17.5 12.5C13.1777 14.9699 5 15 5 15"
                stroke="#7C97A3"
                strokeWidth={2}
                strokeDasharray="3 2"
              />
            </svg>
            <div className="app_sbar_it_txt">API</div>
          </div>
        </Link>
        <Link to="/about">
          <div style={{ display: "flex", paddingTop: "12px" }}>
            <svg
              width={30}
              height={19}
              viewBox="0 0 30 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M29.8684 14.67C29.8684 14.67 30.8638 14.67 27.3797 14.67C22.7923 14.67 19.0155 6.43364 14.4387 6.01492C11.41 5.73783 7.1886 9.37445 4.28961 12.3361M4.28961 12.3361C2.34829 14.3194 1 16 1 16L4.28961 12.3361Z"
                stroke="#56B2AD"
                strokeWidth={2}
              />
              <path d="M19 0V19" stroke="#287D79" strokeDasharray="2 2" />
            </svg>
            <div className="app_sbar_it_txt">API</div>
          </div>
        </Link>
        <Link to="/users">
          <div style={{ display: "flex", paddingTop: "12px" }}>
            <svg
              width={25}
              height={31}
              viewBox="0 0 25 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 30.5578C9.18479 30.5578 6.00537 29.2409 3.66116 26.8967C1.31696 24.5525 0 21.373 0 18.0578C0 17.6895 0.146329 17.3362 0.406796 17.0757C0.667263 16.8153 1.02053 16.6689 1.38889 16.6689C1.75724 16.6689 2.11051 16.8153 2.37098 17.0757C2.63145 17.3362 2.77778 17.6895 2.77778 18.0578C2.77778 20.6363 3.80208 23.1092 5.62535 24.9325C7.44862 26.7557 9.9215 27.78 12.5 27.78C12.8683 27.78 13.2216 27.9264 13.4821 28.1868C13.7426 28.4473 13.8889 28.8006 13.8889 29.1689C13.8889 29.5373 13.7426 29.8906 13.4821 30.151C13.2216 30.4115 12.8683 30.5578 12.5 30.5578Z"
                fill="#7C97A3"
              />
              <path
                d="M18.6389 28.7083C18.341 28.709 18.0507 28.6138 17.811 28.4369C17.5713 28.26 17.3948 28.0107 17.3077 27.7258C17.2205 27.441 17.2272 27.1356 17.3269 26.8548C17.4265 26.5741 17.6138 26.3328 17.8611 26.1666C19.2018 25.2804 20.3019 24.0757 21.0629 22.6602C21.824 21.2447 22.2223 19.6627 22.2222 18.0555V12.5C22.2222 9.9215 21.1979 7.44862 19.3746 5.62535C17.5514 3.80208 15.0785 2.77778 12.5 2.77778C9.9215 2.77778 7.44862 3.80208 5.62535 5.62535C3.80208 7.44862 2.77778 9.9215 2.77778 12.5C2.77778 12.8683 2.63145 13.2216 2.37098 13.4821C2.11051 13.7425 1.75724 13.8889 1.38889 13.8889C1.02053 13.8889 0.667263 13.7425 0.406796 13.4821C0.146329 13.2216 0 12.8683 0 12.5C0 9.18479 1.31696 6.00536 3.66116 3.66116C6.00536 1.31696 9.18479 0 12.5 0C15.8152 0 18.9946 1.31696 21.3388 3.66116C23.683 6.00536 25 9.18479 25 12.5V18.0555C25.0038 20.1151 24.4986 22.1438 23.5294 23.961C22.5602 25.7783 21.1569 27.328 19.4444 28.4722C19.2067 28.6321 18.9253 28.7146 18.6389 28.7083Z"
                fill="#7C97A3"
              />
              <path
                d="M19.4445 13.8912C19.0761 13.8912 18.7229 13.7448 18.4624 13.4844C18.2019 13.2239 18.0556 12.8706 18.0556 12.5023C18.0556 11.0288 17.4703 9.61577 16.4284 8.5739C15.3866 7.53204 13.9735 6.94672 12.5001 6.94672C12.1317 6.94672 11.7784 6.80039 11.518 6.53992C11.2575 6.27946 11.1112 5.92619 11.1112 5.55783C11.1112 5.18948 11.2575 4.83621 11.518 4.57574C11.7784 4.31527 12.1317 4.16895 12.5001 4.16895C14.7102 4.16895 16.8298 5.04692 18.3926 6.60972C19.9554 8.17252 20.8334 10.2921 20.8334 12.5023C20.8334 12.8706 20.6871 13.2239 20.4266 13.4844C20.1661 13.7448 19.8129 13.8912 19.4445 13.8912Z"
                fill="#7C97A3"
              />
              <path
                d="M12.4999 26.3861C10.2898 26.3861 8.17017 25.5081 6.60737 23.9453C5.04457 22.3825 4.1666 20.2629 4.1666 18.0528V12.4972C4.1709 11.1974 4.47668 9.91634 5.0599 8.75473C5.64311 7.59312 6.48786 6.58264 7.5277 5.80277C7.82423 5.58175 8.19641 5.48759 8.56237 5.54098C8.92832 5.59438 9.25808 5.79096 9.47909 6.08749C9.7001 6.38402 9.79427 6.7562 9.74088 7.12215C9.68748 7.48811 9.4909 7.81786 9.19437 8.03888C8.4974 8.55484 7.93089 9.22681 7.54019 10.001C7.14948 10.7751 6.94543 11.63 6.94437 12.4972V18.0528C6.94437 19.5262 7.52969 20.9393 8.57155 21.9811C9.61342 23.023 11.0265 23.6083 12.4999 23.6083C13.9733 23.6083 15.3864 23.023 16.4283 21.9811C17.4702 20.9393 18.0555 19.5262 18.0555 18.0528C18.0555 17.6844 18.2018 17.3311 18.4623 17.0707C18.7227 16.8102 19.076 16.6639 19.4444 16.6639C19.8127 16.6639 20.166 16.8102 20.4265 17.0707C20.6869 17.3311 20.8332 17.6844 20.8332 18.0528C20.8332 20.2629 19.9553 22.3825 18.3925 23.9453C16.8297 25.5081 14.7101 26.3861 12.4999 26.3861Z"
                fill="#7C97A3"
              />
              <path
                d="M15.2778 19.4422C14.9095 19.4422 14.5562 19.2958 14.2957 19.0354C14.0353 18.7749 13.8889 18.4216 13.8889 18.0533V12.4977C13.8889 12.1294 13.7426 11.7761 13.4821 11.5156C13.2217 11.2552 12.8684 11.1088 12.5 11.1088C12.1317 11.1088 11.7784 11.2552 11.5179 11.5156C11.2575 11.7761 11.1111 12.1294 11.1111 12.4977V13.8866C11.1111 14.255 10.9648 14.6082 10.7044 14.8687C10.4439 15.1292 10.0906 15.2755 9.72226 15.2755C9.35391 15.2755 9.00064 15.1292 8.74017 14.8687C8.4797 14.6082 8.33337 14.255 8.33337 13.8866V12.4977C8.33337 11.3926 8.77236 10.3328 9.55376 9.55144C10.3352 8.77004 11.395 8.33105 12.5 8.33105C13.6051 8.33105 14.6649 8.77004 15.4463 9.55144C16.2277 10.3328 16.6667 11.3926 16.6667 12.4977V18.0533C16.6667 18.4216 16.5204 18.7749 16.2599 19.0354C15.9994 19.2958 15.6462 19.4422 15.2778 19.4422Z"
                fill="#7C97A3"
              />
              <path
                d="M12.5 22.2245C11.395 22.2245 10.3352 21.7855 9.55376 21.0041C8.77236 20.2227 8.33337 19.1629 8.33337 18.0578C8.33337 17.6895 8.4797 17.3362 8.74017 17.0757C9.00064 16.8153 9.35391 16.6689 9.72226 16.6689C10.0906 16.6689 10.4439 16.8153 10.7044 17.0757C10.9648 17.3362 11.1111 17.6895 11.1111 18.0578C11.1111 18.4262 11.2575 18.7795 11.5179 19.0399C11.7784 19.3004 12.1317 19.4467 12.5 19.4467C12.8684 19.4467 13.2217 19.593 13.4821 19.8535C13.7426 20.114 13.8889 20.4673 13.8889 20.8356C13.8889 21.204 13.7426 21.5572 13.4821 21.8177C13.2217 22.0782 12.8684 22.2245 12.5 22.2245Z"
                fill="#7C97A3"
              />
            </svg>
            <div className="app_sbar_it_txt">Authentication</div>
          </div>
        </Link>
        <div style={{ display: "flex", paddingTop: "12px" }}>
          <svg
            width={70}
            height={70}
            viewBox="0 0 70 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "32px", height: "32px" }}
          >
            <circle cx="34.5" cy="34.5" r="12.5" fill="white" />
            <circle cx={59} cy={34} r={8} fill="white" />
            <circle cx={35} cy={10} r={8} fill="white" />
            <circle cx={11} cy={35} r={8} fill="white" />
            <circle cx={35} cy={59} r={8} fill="white" />
            <circle cx="52.5" cy="53.5" r="5.5" fill="white" />
            <circle cx="52.5" cy="16.5" r="5.5" fill="white" />
            <circle cx="17.5" cy="17.5" r="5.5" fill="white" />
            <circle cx="17.5" cy="53.5" r="5.5" fill="white" />
            <circle cx="21.5" cy="66.5" r="3.5" fill="white" />
            <circle cx="48.5" cy="66.5" r="3.5" fill="white" />
            <circle cx="66.5" cy="48.5" r="3.5" fill="white" />
            <circle cx="66.5" cy="21.5" r="3.5" fill="white" />
            <circle cx="48.5" cy="3.5" r="3.5" fill="white" />
            <circle cx="21.5" cy="3.5" r="3.5" fill="white" />
            <circle cx="3.5" cy="21.5" r="3.5" fill="white" />
            <circle cx="3.5" cy="48.5" r="3.5" fill="white" />
          </svg>
          <div
            style={{ paddingLeft: "22px", color: "white", lineHeight: "32px" }}
          >
            Routing
          </div>
        </div>
        <div
          style={{ display: "flex", paddingTop: "12px", paddingLeft: "12px" }}
        >
          <div style={{ paddingLeft: "42px", color: "white" }}>Indoor</div>
        </div>
        <div
          style={{ display: "flex", paddingTop: "6px", paddingLeft: "12px" }}
        >
          <div style={{ paddingLeft: "42px", color: "white" }}>Mobility</div>
        </div>
        <div
          style={{ display: "flex", paddingTop: "6px", paddingLeft: "12px" }}
        >
          <div style={{ paddingLeft: "42px", color: "white" }}>Shuttle</div>
        </div>
        <div
          style={{ display: "flex", paddingTop: "6px", paddingLeft: "12px" }}
        >
          <div style={{ paddingLeft: "42px", color: "white" }}>Carpooling</div>
        </div>
      </div>
    </div>
  );
}

export default AppSidebar;
