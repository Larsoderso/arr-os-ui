import React, {
  Component,
  Fragment,
  useState,
  useEffect,
  type ComponentType,
  type Node
} from "react";
import Avatar from "@atlaskit/avatar";
import AvatarGroup from "@atlaskit/avatar-group";
import ReactKanban from "react-kanban-dnd";
import {
  FlexibleWidthXYPlot,
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  ChartLabel,
  LabelSeries,
  MarkSeries
} from "react-vis";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
  Redirect
} from "react-router-dom";
import axios from "axios";
import Tabs from "@atlaskit/tabs";
import "../../../../node_modules/react-vis/dist/style.css";

function getAdorableAvatar(id: string, size: number = 80) {
  return `https://api.adorable.io/avatars/${size}/${id}.png`;
}

function Kanban() {
  useEffect(() => getBoard(), []);
  useEffect(() => getEvaluations(), []);

  const [red, setredir] = useState(<div />);
  const [board, setboard] = useState([]);
  const [teamListing, setTeamListing] = useState([]);
  const [comments, setComments] = useState([
    { Author: "user@rpa.rocks", text: "tesckoooomentar" }
  ]);
  const [evaluations, setevaluations] = useState(undefined);
  function getTeams() {
    console.log("--- Load teams----");
    axios
      .get(
        `https://api.rpa.rocks/teams`
        // { user }
      )
      .then(res => {
        console.log(res.data);
        setTeamListing(res.data);

        console.log("teams----", teamListing);
      });
  }
  function getEvaluations() {
    console.log("--- Load Evaluations----");
    axios
      .get(
        `https://api.rpa.rocks/uc/1` + `/evaluatiions`
        // { user }
      )
      .then(res => {
        console.log(res);
        console.log("Evaluations", res.data);

        setevaluations(res.data);
      });
  }

  function getBoard() {
    console.log("--- Load Board----");
    axios
      .get(
        `https://api.rpa.rocks/board`
        // { user }
      )
      .then(res => {
        console.log(res);
        console.log(res.data.Board);

        for (var i = 0; i < 5; i++) {
          if (res.data.Board[i].rows == null) {
            res.data.Board[i].rows = [];
          }
        }
        setboard(res.data.Board);

        console.log(board);
      });
  }

  const columns = [
    {
      id: 1,
      title: "Idea",
      rows: [
        {
          id: "row1",
          Name: "Kundenprojekt Test",
          Description: "",
          Status: 1,
          Team: null
        }
      ]
    },
    {
      id: 2,
      title: "Concept",
      rows: []
    },
    {
      id: 3,
      title: "Development",
      rows: []
    },
    {
      id: 4,
      title: "Testing",
      rows: []
    },
    {
      id: 5,
      title: "Live",
      rows: []
    }
  ];

  function cardChange(info) {
    console.log("cardchange", info);

    if (info.type == "ROW") {
      console.log("cardchange", info);
      console.log("dest", info.destination.droppableId);

      var did = info.draggableId;
      did = did.replace("uc_", "");
      var did_final = parseInt(did);
      console.log("did", did_final);

      axios
        .post(`https://api.rpa.rocks/uc/1/status`, {
          Uc: did_final,
          Status: info.destination.droppableId
        })
        .then(res => {
          console.log(res);
          console.log(res.data);
        });
    }
  }

  function getrealID(did) {
    did = did.replace("uc_", "");
    return parseInt(did);
  }
  const renderCard = row => (
    <div
      style={{
        /* width: '320px', */ background: row.Color,
        borderRadius: "8px",
        padding: "12px",
        textAlign: "center",
        height: "120px",
        color: "white",
        textAlign: "left",
        transition: "1s linear"
      }}
      onClick={() =>
        setredir(
          <Redirect
            to={{
              pathname: "/ui/use-cases/" + getrealID(row.id)
            }}
          />
        )
      }
    >
      <div style={{ fontWeight: 600, fontSize: "18px" }}>{row.Name}</div>
      <br />
      Team
      <AvatarGroup
        appearance="stack"
        onAvatarClick={console.log}
        height={10}
        data={row.Team.map(function(i, el) {
          return { name: i.Email, src: getAdorableAvatar(i.Email) };
        })}
        size="small"
      />
    </div>
  );
  const styles = {
    cardWrapper: {
      borderRadius: 2,
      border: "1px solid rgba(96,115,137,0.12)",
      backgroundColor: "white",
      boxShadow: "none",
      padding: "9px 9px 0px 9px",
      minHeight: 40,
      marginBottom: 8
    },
    columnStyle: {
      background: "#F4F5FE",
      border: "none",
      borderRadius: 2,
      paddingBottom: 0,
      userSelect: "none",
      borderRadius: "8px",
      borderTopRightRadius: "0px",
      borderTopLeftRadius: "0px"
    },
    columnHeaderStyle: {
      background: "#F4F5FE",
      border: "none",
      borderRadius: "8px",
      padding: "2px",
      textAlign: "left"
    },
    columnTitleStyle: {
      fontWeight: 600,
      fontSize: 14,
      color: "#607389",
      marginRight: 5
    }
  };

  useEffect(() => getTeams(), []);

  return (
    <div style={{ overflowX: "hidden" }}>
      {red}

      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            width: "100%",
            height: "30px",
            background: "rgb(255, 255, 255)",
            flexShrink: 0,
            padding: "12px",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              color: "#2f4752",
              lineHeight: "30px",
              fontWeight: 400,
              fontSize: "24px"
            }}
          >
            Platform
          </div>
        </div>
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr",
            marginTop: "5px",
            paddingBottom: "8px",
            height: "100%"
          }}
        >
          <div style={{ height: "70vh" }}>
            {board.length != 0 && (
              <ReactKanban
                style={{
                  height: "80vh",
                  minWidth: "50vw",
                  width: "55vw",
                  maxWidth: "60vw"
                }}
                columns={board}
                renderCard={renderCard}
                columnStyle={styles.columnStyle}
                columnHeaderStyle={styles.columnHeaderStyle}
                onDragEnd={info => {
                  cardChange(info);
                }}
              />
            )}
          </div>
          <div
            style={{
              width: "100%",
              background: "rgba(247, 247, 247, 0.12)",
              height: "100vh",
              marginLeft: "14px"
            }}
          >
            <div
              style={{
                paddingLeft: "12px",
                paddingTop: "12px",
                paddingBottom: "12px",
                fontWeight: 500,
                fontSize: "16px"
              }}
            >
              Legende
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Kanban;
