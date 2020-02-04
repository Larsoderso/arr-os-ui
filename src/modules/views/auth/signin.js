import React, { Component, Fragment, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
  Redirect
} from "react-router-dom";

import Button, { ButtonGroup } from "@atlaskit/button";
import TextField from "@atlaskit/textfield";
import Form, {
  CheckboxField,
  Field,
  FormFooter,
  HelperMessage,
  ErrorMessage,
  ValidMessage
} from "@atlaskit/form";
import { Checkbox } from "@atlaskit/checkbox";
//import PublicHeader from "./../navigation/header_outside";
import axios from "axios";
import jwtDecode from "jwt-decode";

function SignInPage() {
  // Send Login Credentials to Server
  const [parsedJWT, setJWT] = useState(false);

  // Variablen
  const [anmloading, setanmloading] = useState(false);
  const [email, setemail] = useState("");
  const [pword, setpword] = useState("");
  const [red, setredir] = useState(<div />);
  const [logoutp, setlogoutp] = useState(false);

  useEffect(() => checkjwt(), []);

  function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function(c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }

  function checkjwt() {
    console.log(localStorage.getItem("knock"));
    if (localStorage.getItem("knock") != null) {
      //  localStorage.removeItem("knock");
      setlogoutp(true);
      console.log("logged out");
    }
  }
  function SendLoginCredentials() {
    setanmloading(true);

    const user = {
      email: email,
      password: pword
    };

    axios
      .post(
        `https://api.rpa.rocks/signin`,
        user
        // { user }
      )
      .then(res => {
        setanmloading(false);
        console.log(res);
        console.log(res.data);

        if (res.data.Error == false) {
          var decoded = parseJwt(res.data.Jsontoken);
          localStorage.setItem("knock", res.data.Jsontoken);

          setredir(
            <Redirect
              to={{
                pathname: "/ui/"
              }}
            />
          );
          console.log(decoded);
        }
      });
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden"
      }}
    >
      <div>
        {red}
        <svg
          width={1600}
          height={618}
          viewBox="0 0 1600 618"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100vw", height: "auto", marginTop: "20px" }}
        >
          <path
            d="M717 533C436.161 529.692 0 589 0 589V193C0 193 66.113 187.805 108 181C248.186 158.225 315.387 101.829 452 62.9997C541.377 37.5962 590.743 17.0566 683 5.99967C874.818 -16.9897 984.296 32.6066 1173 73.9997C1343.19 111.332 1601 200 1601 200V490C1601 490 1467.58 567.018 1374 595C1127.09 668.83 974.697 536.035 717 533Z"
            fill="#E3F6F4"
          />
          <path
            d="M717 533C436.161 529.692 0 589 0 589L-15 418C-15 418 121.113 409.805 163 403C303.186 380.226 464.387 356.829 601 318C690.377 292.596 1007.74 228.056 1100 216.999C1291.82 194.01 1250.3 202.607 1439 244C1609.19 281.332 1783 387.001 1783 387.001L1601 490C1601 490 1467.58 567.018 1374 595C1127.09 668.83 974.697 536.035 717 533Z"
            fill="#CCECF2"
          />
          <path
            d="M0 502C0 502 910 409 1215 351C1520 293 1602 369 1602 369"
            stroke="white"
            strokeWidth={2}
          />
          <path
            d="M0 532C0 532 910 439 1215 381C1520 323 1602 399 1602 399"
            stroke="white"
            strokeWidth={2}
          />
          <path
            d="M0 560C0 560 910 467 1215 409C1520 351 1602 427 1602 427"
            stroke="white"
            strokeWidth={2}
          />
        </svg>
        <div
          style={{
            paddingLeft: "22px",
            paddingRight: "22px",
            paddingBottom: "42px",
            paddingTop: "22px",
            width: "432px",
            marginLeft: "-216px",
            position: "absolute",
            background: "white",
            zIndex: 999,
            top: "200px",
            left: "50%",
            borderRadius: "6px",
            boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.11)"
          }}
        >
          {logoutp && (
            <div
              style={{
                padding: 12,
                paddingTop: 22,
                paddingBottom: 22,
                background: "#0096884a",
                color: "#009688",
                borderRadius: 6,
                marginBottom: 10,
                fontWeight: 500,
                boxSizing: "border-box",
                marginLeft: 12
              }}
            >
              Succesfully logged out
            </div>
          )}

          <div style={{ paddingLeft: "12px", paddingTop: "12px" }}>
            <TextField
              value={email}
              onChange={e => setemail(e.target.value)}
              placeholder="john.doe@rpa.rocks"
              autoComplete="off"
            />
            <div style={{ marginTop: "12px" }}>
              <TextField
                value={pword}
                onChange={e => setpword(e.target.value)}
                type="password"
                placeholder="Password"
                autoComplete="off"
              />
            </div>
            <Checkbox label="Always sign in on this device" />
            <FormFooter>
              <ButtonGroup>
                <Button appearance="subtle">Cancel</Button>
                <Button
                  type="submit"
                  appearance="primary"
                  onClick={SendLoginCredentials}
                  isLoading={anmloading}
                >
                  Sign in
                </Button>
              </ButtonGroup>
            </FormFooter>
            {/**      <Link to="/ui"> Weiter Ohne Anmeldung </Link> */}{" "}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
