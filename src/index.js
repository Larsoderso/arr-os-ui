import React, { useState } from "react";
import ReactDOM from "react-dom";
import ReactMapboxGl from "react-mapbox-gl";
import DrawControl from "react-mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import {
  DatePicker,
  DateTimePicker,
  TimePicker
} from "@atlaskit/datetime-picker";

import "./styles.css";
import styled from "styled-components";
import Textfield from "@atlaskit/textfield";
import { gridSize, fontSize } from "@atlaskit/theme";

import AppHeader from "./modules/app_header";
import InlineEdit from "@atlaskit/inline-edit";
import AppSidebar from "./modules/app_sidebar";

import Kanban from "./modules/views/overview/kanban";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Funnel from "./modules/views/funnel/funnel";
import AppDemo from "./modules/demo";
import SignInPage from "./modules/views/auth/signin";

const ReadViewContainer = styled.div`
  display: flex;
  font-size: ${fontSize()}px;
  line-height: ${(gridSize() * 2.5) / fontSize()};
  max-width: 100%;
  min-height: ${(gridSize() * 2.5) / fontSize()}em;
  padding: ${gridSize()}px ${gridSize() - 2}px;
  word-break: break-word;
`;

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoiZmFrZXVzZXJnaXRodWIiLCJhIjoiY2pwOGlneGI4MDNnaDN1c2J0eW5zb2ZiNyJ9.mALv0tCpbYUPtzT7YysA2g"
});

function App() {
  const [StopArray, setStopArray] = useState([]);
  const [demo, setDemo] = useState("480px");

  const onDrawCreate = ({ features }) => {
    console.log(features);

    console.log("up", features[0].geometry.coordinates);
    setStopArray(features[0].geometry.coordinates);
  };

  const onDrawUpdate = ({ features }) => {
    console.log(features);
    setStopArray(features[0].geometry.coordinates);
  };

  const ABC = ["A", "B", "C", "D", "E", "F", "G", "H"];
  function onDateChange() {}

  const [editValue, seteditChange] = useState();

  function BoardIcon() {
    return (
      <svg
        width={32}
        height={22}
        viewBox="0 0 32 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x={1}
          y={1}
          width="6.96008"
          height="19.7602"
          rx={1}
          stroke="#ffffff"
          strokeWidth={2}
        />
        <rect
          x="12.5208"
          y={1}
          width="6.96008"
          height="19.7602"
          rx={1}
          stroke="#ffffff"
          strokeWidth={2}
        />
        <rect
          x="24.04"
          y={1}
          width="6.96008"
          height="19.7602"
          rx={1}
          stroke="#ffffff"
          strokeWidth={2}
        />
      </svg>
    );
  }
  return (
    <div style={{ display: "flex", width: "100vw" }}>
      <Router>
        <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
          <AppHeader onDemo={st => setDemo(st)} />
          {/**  <div
        style={{
          background: "#F8FAFB",
          height: "55px",
          borderBottom: "1px solid #DFE5EA",
          display: "flex"
        }}
      >
        <svg
          width={54}
          height={43}
          viewBox="0 0 54 43"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "40px", height: "55px", marginLeft: "12px" }}
        >
          <circle
            cx="32.3994"
            cy="21.3999"
            r="19.75"
            transform="rotate(90 32.3994 21.3999)"
            stroke="#E20073"
            strokeWidth="2.5"
          />
          <mask
            id="mask0"
            mask-type="alpha"
            maskUnits="userSpaceOnUse"
            x={0}
            y={0}
            width={43}
            height={43}
          >
            <circle
              cx="21.5996"
              cy="21.3999"
              r={21}
              transform="rotate(90 21.5996 21.3999)"
              fill="#C4C4C4"
            />
          </mask>
          <g mask="url(#mask0)">
            <path
              d="M40.5996 11.2002L12.1996 39.6002"
              stroke="#040744"
              strokeWidth="2.5"
            />
            <path
              d="M43.3994 17.6006L18.1994 42.4006"
              stroke="#040744"
              strokeWidth="2.5"
            />
            <path
              d="M47.3994 22.4004L22.1994 47.2004"
              stroke="#040744"
              strokeWidth="2.5"
            />
            <path
              d="M36.5996 6.80029L6.99961 36.0003"
              stroke="#040744"
              strokeWidth="2.5"
            />
            <path
              d="M31.7998 2.80029L2.5998 31.2003"
              stroke="#040744"
              strokeWidth="2.5"
            />
            <path
              d="M26.999 -1.19971L-2.20098 27.2003"
              stroke="#040744"
              strokeWidth="2.5"
            />
            <path
              d="M22.1992 -5.19971L-7.00078 23.2003"
              stroke="#040744"
              strokeWidth="2.5"
            />
          </g>
        </svg>
        <div
          style={{
            background: "rgba(198, 208, 219, 0.21)",
            borderRadius: "5px",
            height: "40px",
            paddingLeft: "12px",
            paddingRight: "12px",
            marginTop: "7.5px",
            lineHeight: "40px",
            marginLeft: "12px"
          }}
        >
          Rheinland{" "}
        </div>
      </div>{" "}*/}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100vw",
              height: "100vh",
              overflow: "hidden"
            }}
          >
            <AppSidebar />

            <div>
              {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
              <Switch>
                <Route path="/about">
                  <Funnel />{" "}
                </Route>
                <Route path="/users">
                  <Kanban />{" "}
                </Route>

                <Route path="/signin">
                  <SignInPage />{" "}
                </Route>

                <Route path="/">
                  <div>Hi</div>{" "}
                </Route>
              </Switch>
              <div style={{ padding: "12px" }} />
              <div style={{ padding: "12px" }}>
                {StopArray.length == 0 && (
                  <div
                    style={{
                      padding: "12px",
                      width: "329px",
                      height: "257px",
                      background: "#fcfcfc",
                      borderRadius: "7px",
                      display: "block",
                      margin: "0 auto",
                      marginTop: "22px"
                    }}
                  >
                    <svg
                      width={134}
                      height={81}
                      viewBox="0 0 134 81"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        display: "block",
                        margin: "0 auto",
                        marginTop: "42px"
                      }}
                    >
                      <path
                        d="M5 3.5L32 19.5L5 46.5L39 76L74 41.5L103 63.5L128.5 41.5"
                        stroke="#B6D7DD"
                        strokeWidth={3}
                      />
                      <circle
                        cx={31}
                        cy={19}
                        r={4}
                        fill="white"
                        stroke="#B6D7DD"
                        strokeWidth={2}
                      />
                      <circle
                        cx={7}
                        cy={5}
                        r={4}
                        fill="white"
                        stroke="#3484FF"
                        strokeWidth={2}
                      />
                      <circle
                        cx={129}
                        cy={42}
                        r={4}
                        fill="white"
                        stroke="#3484FF"
                        strokeWidth={2}
                      />
                      <circle
                        cx={5}
                        cy={47}
                        r={4}
                        fill="white"
                        stroke="#B6D7DD"
                        strokeWidth={2}
                      />
                      <circle
                        cx={39}
                        cy={76}
                        r={4}
                        fill="white"
                        stroke="#B6D7DD"
                        strokeWidth={2}
                      />
                      <circle
                        cx={74}
                        cy={42}
                        r={4}
                        fill="white"
                        stroke="#B6D7DD"
                        strokeWidth={2}
                      />
                    </svg>
                    <div> </div>
                  </div>
                )}
                {StopArray.map((iter, item) => (
                  <div>
                    {item == 0 && (
                      <div>
                        <div
                          style={{
                            height: "65px",
                            display: "flex",
                            flexDirection: "row"
                          }}
                        >
                          <div
                            style={{
                              background: "rgb(32, 75, 157)",
                              width: "20px",
                              height: "65px",
                              borderRadius: "12px"
                            }}
                          />
                          <div
                            style={{ paddingTop: "12px", paddingLeft: "9px" }}
                          >
                            <span
                              style={{ fontWeight: 500, marginTop: "12px" }}
                            />
                            <div
                              style={{ paddingTop: "4px", color: "#7d9dad" }}
                            >
                              <span>
                                {" "}
                                {iter[0]}, {iter[1]}{" "}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {item != 0 && item != StopArray.length - 1 && (
                      <div>
                        <div style={{ paddingLeft: "9px", paddingTop: "6px" }}>
                          <svg
                            width="3"
                            height="59"
                            viewBox="0 0 3 59"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              width="3"
                              height="16.11"
                              rx="1.5"
                              fill="#204B9D"
                              fill-opacity="0.53"
                            />
                            <rect
                              y="21"
                              width="3"
                              height="16.11"
                              rx="1.5"
                              fill="#204B9D"
                              fill-opacity="0.53"
                            />
                            <rect
                              y="42"
                              width="3"
                              height="16.11"
                              rx="1.5"
                              fill="#204B9D"
                              fill-opacity="0.53"
                            />
                          </svg>
                        </div>
                        <div
                          style={{
                            height: "65px",
                            display: "flex",
                            flexDirection: "row"
                          }}
                        >
                          <div
                            style={{
                              background: "rgb(32, 75, 157)",
                              width: "20px",
                              height: "65px",
                              borderRadius: "12px"
                            }}
                          />
                          <div
                            style={{ paddingTop: "2px", paddingLeft: "9px" }}
                          >
                            <span
                              style={{ fontWeight: 500, marginTop: "12px" }}
                            >
                              <InlineEdit
                                defaultValue={"Stop" + ABC[item]}
                                editView={fieldProps => (
                                  <Textfield {...fieldProps} autoFocus />
                                )}
                                readView={() => (
                                  <ReadViewContainer>
                                    {editValue || "Stop" + ABC[item]}
                                  </ReadViewContainer>
                                )}
                                onConfirm={value =>
                                  this.setState({ editValue: value })
                                }
                              />
                            </span>
                            <div
                              style={{ paddingTop: "4px", color: "#7d9dad" }}
                            >
                              <span>
                                {" "}
                                {iter[0]}, {iter[1]}{" "}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {item == StopArray.length - 1 && (
                      <div>
                        <div style={{ paddingLeft: "9px", paddingTop: "6px" }}>
                          <svg
                            width="3"
                            height="59"
                            viewBox="0 0 3 59"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              width="3"
                              height="16.11"
                              rx="1.5"
                              fill="#204B9D"
                              fill-opacity="0.53"
                            />
                            <rect
                              y="21"
                              width="3"
                              height="16.11"
                              rx="1.5"
                              fill="#204B9D"
                              fill-opacity="0.53"
                            />
                            <rect
                              y="42"
                              width="3"
                              height="16.11"
                              rx="1.5"
                              fill="#204B9D"
                              fill-opacity="0.53"
                            />
                          </svg>
                        </div>
                        <div
                          style={{
                            height: "65px",
                            display: "flex",
                            flexDirection: "row"
                          }}
                        >
                          <div
                            style={{
                              background: "rgb(32, 75, 157)",
                              width: "20px",
                              height: "65px",
                              borderRadius: "12px"
                            }}
                          />
                          <div
                            style={{ paddingTop: "2px", paddingLeft: "9px" }}
                          >
                            <span
                              style={{ fontWeight: 500, marginTop: "12px" }}
                            >
                              <InlineEdit
                                defaultValue={"Stop" + ABC[item]}
                                editView={fieldProps => (
                                  <Textfield {...fieldProps} autoFocus />
                                )}
                                readView={() => (
                                  <ReadViewContainer>
                                    {editValue || "Stop" + ABC[item]}
                                  </ReadViewContainer>
                                )}
                                onConfirm={value =>
                                  this.setState({ editValue: value })
                                }
                              />
                            </span>
                            <div
                              style={{ paddingTop: "4px", color: "#7d9dad" }}
                            >
                              <span>
                                {" "}
                                {iter[0]}, {iter[1]}{" "}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/**         <Button appeareance="primary" />
               */}{" "}
              <div
                style={{
                  background: "#f4f5f78c",
                  paddingTop: "8px",
                  paddingBottom: "8px",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  marginTop: "auto",
                  display: "flex",
                  flexDirection: "row"
                }}
              >
                <div
                  style={{
                    width: "100px",
                    height: "45px",
                    background: "#9ca2b5",
                    borderRadius: "4px",
                    color: "white",
                    textAlign: "center",
                    lineHeight: "45px"
                  }}
                >
                  Cancel
                </div>
                <div
                  style={{
                    width: "160px",
                    height: "45px",
                    background: "#1E23A3",
                    borderRadius: "4px",
                    color: "white",
                    textAlign: "center",
                    lineHeight: "45px",
                    marginLeft: "auto"
                  }}
                >
                  Create Route
                </div>
              </div>
            </div>

            {/** <div style={{ background: "black" }}>
            <Map
              style="mapbox://styles/mapbox/dark-v9" // eslint-disable-line
              containerStyle={{
                height: "100vh",
                width: "100vw"
              }}
            >
              <DrawControl
                displayControlsDefault={false}
                controls={{ line_string: true, trash: true }}
                onDrawCreate={onDrawCreate}
                onDrawUpdate={onDrawUpdate}
              />
            </Map>
          </div> */}
          </div>{" "}
        </div>
        <div class="demo_port" style={{ width: demo }}>
          <div
            style={{
              width: "100%",
              height: "55px",
              borderBottom: "1px solid #ffffff24"
            }}
          />
          <AppDemo />
        </div>
      </Router>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
