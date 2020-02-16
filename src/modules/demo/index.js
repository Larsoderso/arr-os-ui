import React, { Component } from "react";
import ReactDOM from "react-dom";
import MapGL, { Marker, StaticMap } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import DeckGL, { GeoJsonLayer, IconLayer, ScatterplotLayer } from "deck.gl";
import axios from "axios";
import scootermarker from "./img/scootermarker.png";
import tierscooterpng from "./img/tier_scooter.png";
import bahn_icon_png from "./img/bahn.png";
import airport_icon from "./img/airport_icon.png";
import Mobike_logo from "./img/Mobike_logo.png";
import Nextbike_logo from "./img/Nextbike_logo.png";
import Carsharing_logo from "./img/carsharing.png";
import mileslogo from "./img/miles-logo.png";
import emmy_icon from "./img/emmy_icon.png";
import emmy_scooter from "./img/emmy_scooter.png";

import empty_state_png from "./img/drone_empty.png";
import "./styles.css";


const MAPBOX_TOKEN =
  "pk.eyJ1IjoibGFyc2RpIiwiYSI6ImNrMXY1NzllOTAwZGYza3RrbWVpeDl1NTMifQ.iFu8GW4UGAtz9wtC3ILchA";
const MAPBOX_STYLE = "mapbox://styles/mapbox/light-v9";


export default class AppDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: "calc(5.26vh * 9)",
        height: window.innerHeight,
        longitude: 6.959704,
        latitude: 50.922482,
        zoom: 16,
        maxZoom: 17
      },
      sensordata: {
        lat: null,
        long: null,
        alt: null,
        bright: null,
        rssi: null,
        snr: null
      },
      mscreen: {
        mleft: "0px",
        opacity: 100
      },
      show: "",
      currentDisplay: "",
      displayTripOverlay: "none",
      searchInteraction: 0,
      userPosition: {
        lat: null,
        lon: null,
        txt: "Aktueller Standpunkt"
      },
      start: {
        lat: null,
        lon: null,
        txt: null
      },
      end: {
        lat: null,
        lon: null,
        txt: null
      },
      scooterdata: [],
      bikes: [],
      placesres: [],
      carparkcity: [],
      parkandride: [],
      emmyList: [],
      milesList: [],
      trips: [],
      BusList: [],
      undergroundList: [],
      showStartEnd: "flex",
      showResTypes: "none"
    };

    this._resize = this._resize.bind(this);
    this.changetoScooter = this.changetoScooter.bind(this);
    this.changetoMetro = this.changetoMetro.bind(this);
    this.changetoBahn = this.changetoBahn.bind(this);
    this.changetoSBahn = this.changetoSBahn.bind(this);
    this.changetoBikes = this.changetoBikes.bind(this);
    this.changetoParken = this.changetoParken.bind(this);
    this.changetoAirports = this.changetoAirports.bind(this);
    this.changetoRoller = this.changetoRoller.bind(this);
    this.changetoCarsharing = this.changetoCarsharing.bind(this);

    this.changetomainScreen = this.changetomainScreen.bind(this);
    this.displayTripOverlay = this.displayTripOverlay.bind(this);
    this.closeTripOverlay = this.closeTripOverlay.bind(this);
  }
  showPosition(position) {
    console.log(position);
  }
  componentDidMount() {
    window.addEventListener("resize", this._resize);
    this._resize();

    var that = this;
    if (navigator.geolocation) {
      console.log(navigator.geolocation.getCurrentPosition(that.showPosition));
    } else {
      console.log("geonot");
    }

    axios
      .get(`https://api.arrive-mobility.com/circle/tier/50.922482/6.959704`)
      .then(res => {
        const sdata = res.data;
        this.setState({ scooterdata: sdata.data });

        console.log(this.state);
      });

    axios
      .get(`https://api.arrive-mobility.com/circle/50.922482/6.959704`)
      .then(res => {
        const sdata = res.data;
        this.setState({ bikes: sdata });

        console.log(this.state);
      });
    /*
    axios
      .get(`https://api.arrive-mobility.com/places/olof-palme-allee`)
      .then(res => {
        const placesdata = res.data.results;
        this.setState({ placesres: placesdata });

        console.log(this.state);
      });
*/
    axios
      .get(`https://api.arrive-mobility.com/circle/parking/50.922482/6.959704`)
      .then(res => {
        const parkingarages = res.data;
        console.log(parkingarages);
        this.setState({ carparkcity: parkingarages.features });
        console.log(this.state);
      });

    axios
      .get(`https://api.arrive-mobility.com/circle/emmy/50.922482/6.959704`)
      .then(res => {
        const emmyL = res.data;
        console.log(emmyL);
        this.setState({ emmyList: emmyL });
        console.log(this.state);
      });

    axios
      .get(`https://api.arrive-mobility.com/circle/emmy/50.922482/6.959704`)
      .then(res => {
        const emmyL = res.data;
        console.log(emmyL);
        this.setState({ emmyList: emmyL });
        console.log(this.state);
      });

    axios
      .get(`https://api-dev.arrive-mobility.com/circle/bus/50.922482/6.959704`)
      .then(res => {
        const milesLista = res.data.StopLocation;
        this.setState({ BusList: milesLista });
        console.log(this.state.BusList);
      });

    axios
      .get(
        `https://api-dev.arrive-mobility.com/circle/underground/50.922482/6.959704`
      )
      .then(res => {
        const milesLista = res.data.StopLocation;
        this.setState({ undergroundList: milesLista });
        console.log(this.state.BusList);
      });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  }

  getPlaces(e) {
    console.log("hi");

    this.setState({ loadingPlaces: true });
    var oV = e.target.value;
    var nV = oV.replace(" ", "+");

    axios.get("https://api-dev.arrive-mobility.com/places/" + nV).then(res => {
      const result = res.data;
      this.setState({ loadingPlaces: false });
      this.setState({ placesres: result.results });

      console.log(this.state);
    });
  }

  _getAtlasJourney(start_lat, start_lon, end_lat, end_lon) {
    axios
      .get(
        "https://api-dev.arrive-mobility.com/atlas/" +
          start_lat +
          "/" +
          start_lon +
          "/" +
          end_lat +
          "/" +
          end_lon +
          "/2019-10-15"
      )
      .then(res => {
        const result = res.data;
        this.setState({ trips: result.response.Trips });

        console.log(this.state);
      });
  }
  changetoScooter() {
    console.log("change to scooter");
    this.setState({
      mscreen: { mleft: " calc((5.26vh * 9) - (5.26vh * 18))", opacity: 100 }
    });

    this.setState({
      show: "escooter"
    });
  }

  changetoBikes() {
    console.log("change to scooter");
    this.setState({
      mscreen: { mleft: " -100%", opacity: 100 }
    });

    this.setState({
      show: "bikes"
    });
  }

  changetoMetro() {
    console.log("change to scooter");
    this.setState({
      mscreen: { mleft: " -100%", opacity: 100 }
    });

    this.setState({
      show: "metro"
    });
  }

  changetoBahn() {
    console.log("change to scooter");
    this.setState({
      mscreen: { mleft: " -100%", opacity: 100 }
    });

    this.setState({
      show: "bahn"
    });
  }

  changetoSBahn() {
    console.log("change to scooter");
    this.setState({
      mscreen: { mleft: " -100%", opacity: 100 }
    });

    this.setState({
      show: "SBahn"
    });
  }
  changetoParken() {
    console.log("change to scooter");
    this.setState({
      mscreen: { mleft: " -100%", opacity: 100 }
    });

    this.setState({
      show: "parking"
    });
  }
  changetoRoller() {
    console.log("change to scooter");
    this.setState({
      mscreen: { mleft: " -100%", opacity: 100 }
    });

    this.setState({
      show: "roller"
    });
  }
  changetoAirports() {
    console.log("change to scooter");
    this.setState({
      mscreen: { mleft: " -100%", opacity: 100 }
    });

    this.setState({
      show: "airport"
    });
  }

  changetoCarsharing() {
    console.log("change to scooter");
    this.setState({
      mscreen: { mleft: " calc((5.26vh * 9) - (5.26vh * 18))", opacity: 100 }
    });

    this.setState({
      show: "carsharing"
    });
  }
  displayTripOverlay() {
    this.setState({
      displayTripOverlay: "block"
    });
  }

  closeTripOverlay() {
    console.log("close Trip overlay __2");

    this.setState({
      displayTripOverlay: "none",
      trips: [],
      start: { txt: null, lat: null, lon: null },
      end: { txt: null, lat: null, lon: null }
    });
    /** 
    this.setState({ start: { txt: null, lat: null, lon: null } });
    this.setState({ end: { txt: null, lat: null, lon: null } });
    this.setState({ placesres: [] });

    this.setState({ showResTypes: "none" });
    this.setState({ showStartEnd: "flex" });
    this.setState({ trips: [] });
*/
    console.log(this.state);
  }
  changetomainScreen() {
    console.log("change to scooter");
    this.setState({
      mscreen: { mleft: " 0px", opacity: 100 }
    });
  }

  _clickedPlaceResult(x, y, text) {
    console.log("x", x);
    console.log("text", text);

    if (this.state.searchInteraction == 0) {
      console.log("chnaging start place");
      this.setState({ start: { txt: text, lat: x, lon: y } });
    }
    if (this.state.searchInteraction == 1) {
      console.log("chnaging end place");
      this.setState({ end: { txt: text, lat: x, lon: y } });

      this.setState({ placesres: [] });
      // this.setState({ showStartEnd: "none" });
      // this.setState({ showResTypes: "flex" });

      this._getAtlasJourney(this.state.start.lat, this.state.start.lon, x, y);
    }
  }

  _setPlaceResultTap() {}
  _resize() {
    this._onViewportChange({
      width: "calc(5.26vh * 9)",
      height: window.innerHeight
    });
  }

  handlePlaceChange(e) {
    e.persist();
    console.log(e);
    console.log(e.target.name);
    if (e.target.name == "startPlace") {
      this.setState({ start: { txt: e.target.value, lat: 0, lon: 0 } });
      this.setState({ searchInteraction: 0 });

      this.getPlaces(e);
    }
    if (e.target.name == "endPlace") {
      this.setState({ end: { txt: e.target.value, lat: 0, lon: 0 } });
      this.setState({ searchInteraction: 1 });
      this.getPlaces(e);
    }
  }
  render() {
    const { viewport } = this.state;
    var that = this;
    const viewState = {
      longitude: -122.41669,
      latitude: 37.7853,
      zoom: 13,
      pitch: 0,
      bearing: 0
    };

    const data = [
      {
        name: "12th St. Oakland City Center (12TH)",
        code: "12",
        exits: "13547",
        Longitude: 6.959704,
        Latitude: 50.922482,
        coordinates: [-122.271604, 37.803664]
      }
    ];

    const dpoptions = ["KÃÂ¶ln", "Bonn", "ZÃÂ¼rich"];
    const empty_state = (
      <div style={{ width: "100%", display: "flex", paddingTop: "24px" }}>
        <div
          style={{
            width: "190px",
            display: "flex",
            flexDirection: "column",
            margin: "0 auto"
          }}
        >
          <img src={empty_state_png} style={{ marginLeft: "-30px" }} />
          <div style={{ color: "#959fb7", paddingTop: "22px" }}>
            {" "}
            Noch keine Daten da. Aber wir arbeiten daran
          </div>
        </div>
      </div>
    );
    const ICON_MAPPING = {
      marker: { x: 0, y: 0, width: 32, height: 32, mask: true }
    };
    const layer = new IconLayer({
      id: "icon-layer",
      data: data,
      pickable: true,
      // iconAtlas and iconMapping are required
      // getIcon: return a string
      // your icon image url
      getIcon: d => ({
        url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Map_marker.svg/2000px-Map_marker.svg.png",
        width: 128,
        height: 128,
        anchorY: 128
      }),
      // the icon info

      sizeScale: 15,
      getPosition: d => [d.Longitude, d.Latitude],
      getSize: d => 33,
      getColor: d => [226, 0, 116]
    });

    const layer2 = new IconLayer({
      id: "icon-layer",
      data,
      pickable: true,
      // iconAtlas and iconMapping are required
      // getIcon: return a string
      iconAtlas: { scootermarker },
      iconMapping: ICON_MAPPING,
      getIcon: d => "marker",

      sizeScale: 15,
      getPosition: d => d.coordinates,
      getSize: d => 5,
      getColor: d => [Math.sqrt(d.exits), 140, 0]
    });

    const layer_bus = new ScatterplotLayer({
      id: "scatterplot-layer",
      data: this.state.BusList,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 6,
      radiusMinPixels: 1,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: d => [d.Lat, d.Lon, 0],
      getRadius: 2,
      getFillColor: d => [106, 116, 19],
      getLineColor: d => [0, 0, 0]
      /**    onHover: ({object, x, y}) => {*/
      /* Update tooltip
           http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object
        */
    });

    const mapStyle = "mapbox://styles/mapbox/light-v9";
    return (
      <div className="App" >
        <svg
          style={{
            position: "absolute",
            left: "calc(30% - 136.5px ",
            top: "24px"
          }}
          width={408}
          height={706}
          viewBox="0 0 408 706"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M204.157 657.288C291.55 657.288 362.396 655.179 362.396 652.577C362.396 649.976 265.358 648.796 204.157 648.796C142.955 648.796 45.9172 649.976 45.9172 652.577C45.9172 655.179 116.763 657.288 204.157 657.288Z"
              fill="black"
              fillOpacity="0.01"
            />
          </g>
          <g filter="url(#filter1_d)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M203.924 655.919C288.404 655.919 356.888 654.266 356.888 652.227C356.888 650.188 263.086 649.264 203.924 649.264C144.762 649.264 50.959 650.188 50.959 652.227C50.959 654.266 119.444 655.919 203.924 655.919Z"
              fill="black"
              fillOpacity="0.01"
            />
          </g>
          <g filter="url(#filter2_d)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M204.365 654.076C283.019 654.076 346.78 653.221 346.78 652.167C346.78 651.112 259.447 650.634 204.365 650.634C149.283 650.634 61.9495 651.112 61.9495 652.167C61.9495 653.221 125.711 654.076 204.365 654.076Z"
              fill="black"
              fillOpacity="0.01"
            />
          </g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M95.7159 0H311.909C325.539 0 333.125 1.47074 341.037 5.70209C348.532 9.71064 354.522 15.7001 358.53 23.1954C362.762 31.1073 364.232 38.693 364.232 52.3228V600.372C364.232 614.002 362.762 621.587 358.53 629.499C354.522 636.995 348.532 642.984 341.037 646.992C333.125 651.224 325.539 652.695 311.909 652.695H95.7159C82.0861 652.695 74.5004 651.224 66.5885 646.992C59.0931 642.984 53.1037 636.995 49.0952 629.499C44.8638 621.587 43.3931 614.002 43.3931 600.372V52.3228C43.3931 38.693 44.8638 31.1073 49.0952 23.1954C53.1037 15.7001 59.0931 9.71064 66.5885 5.70209C74.5004 1.47074 82.0861 0 95.7159 0Z"
            fill="black"
          />
          <g filter="url(#filter3_i)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M96.1384 1.8269H312.332C325.67 1.8269 332.975 3.23762 340.594 7.312C347.769 11.1494 353.496 16.8768 357.334 24.0522C361.408 31.6706 362.819 38.9759 362.819 52.3137V600.363C362.819 613.7 361.408 621.006 357.334 628.624C353.496 635.8 347.769 641.527 340.594 645.364C332.975 649.439 325.67 650.849 312.332 650.849H96.1384C82.8006 650.849 75.4953 649.439 67.8769 645.364C60.7015 641.527 54.9741 635.8 51.1367 628.624C47.0623 621.006 45.6516 613.7 45.6516 600.363V52.3137C45.6516 38.9759 47.0623 31.6706 51.1367 24.0522C54.9741 16.8768 60.7015 11.1494 67.8769 7.312C75.4953 3.23762 82.8006 1.8269 96.1384 1.8269Z"
              fill="url(#paint0_linear)"
            />
          </g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M95.1837 4.82959H313.254C326.708 4.82959 334.077 6.22533 341.761 10.2565C348.999 14.0532 354.776 19.7198 358.647 26.819C362.756 34.3567 364.179 41.5844 364.179 54.7807V597.015C364.179 610.211 362.756 617.439 358.647 624.977C354.776 632.076 348.999 637.742 341.761 641.539C334.077 645.57 326.708 646.966 313.254 646.966H95.1837C81.73 646.966 74.3613 645.57 66.6768 641.539C59.4391 637.742 53.662 632.076 49.7913 624.977C45.6815 617.439 44.2585 610.211 44.2585 597.015V54.7807C44.2585 41.5844 45.6815 34.3567 49.7913 26.819C53.662 19.7198 59.4391 14.0532 66.6768 10.2565C74.3613 6.22533 81.73 4.82959 95.1837 4.82959Z"
            fill="url(#paint1_linear)"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M95.1837 4.82959H313.254C326.708 4.82959 334.077 6.22533 341.761 10.2565C348.999 14.0532 354.776 19.7198 358.647 26.819C362.756 34.3567 364.179 41.5844 364.179 54.7807V597.015C364.179 610.211 362.756 617.439 358.647 624.977C354.776 632.076 348.999 637.742 341.761 641.539C334.077 645.57 326.708 646.966 313.254 646.966H95.1837C81.73 646.966 74.3613 645.57 66.6768 641.539C59.4391 637.742 53.662 632.076 49.7913 624.977C45.6815 617.439 44.2585 610.211 44.2585 597.015V54.7807C44.2585 41.5844 45.6815 34.3567 49.7913 26.819C53.662 19.7198 59.4391 14.0532 66.6768 10.2565C74.3613 6.22533 81.73 4.82959 95.1837 4.82959Z"
            fill="url(#paint2_linear)"
          />
          <g opacity="0.500781">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M98.6674 3.67627H308.916C321.887 3.67627 328.992 5.079 336.401 9.13033C343.379 12.9461 348.949 18.641 352.68 25.7758C356.643 33.3511 358.015 40.6151 358.015 53.8774V598.826C358.015 612.088 356.643 619.352 352.68 626.927C348.949 634.062 343.379 639.757 336.401 643.573C328.992 647.624 321.887 649.027 308.916 649.027H98.6674C85.6963 649.027 78.5919 647.624 71.183 643.573C64.2049 639.757 58.635 634.062 54.9031 626.927C50.9408 619.352 49.5688 612.088 49.5688 598.826V53.8774C49.5688 40.6151 50.9408 33.3511 54.9031 25.7758C58.635 18.641 64.2049 12.9461 71.183 9.13033C78.5919 5.079 85.6963 3.67627 98.6674 3.67627Z"
              fill="url(#paint3_linear)"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M98.6674 3.67627H308.916C321.887 3.67627 328.992 5.079 336.401 9.13033C343.379 12.9461 348.949 18.641 352.68 25.7758C356.643 33.3511 358.015 40.6151 358.015 53.8774V598.826C358.015 612.088 356.643 619.352 352.68 626.927C348.949 634.062 343.379 639.757 336.401 643.573C328.992 647.624 321.887 649.027 308.916 649.027H98.6674C85.6963 649.027 78.5919 647.624 71.183 643.573C64.2049 639.757 58.635 634.062 54.9031 626.927C50.9408 619.352 49.5688 612.088 49.5688 598.826V53.8774C49.5688 40.6151 50.9408 33.3511 54.9031 25.7758C58.635 18.641 64.2049 12.9461 71.183 9.13033C78.5919 5.079 85.6963 3.67627 98.6674 3.67627Z"
              fill="url(#paint4_linear)"
            />
          </g>
          <path
            d="M95.5096 6.32959H313.08C325.85 6.32959 332.408 7.63814 339.227 11.2848C345.621 14.7044 350.708 19.7917 354.128 26.1858C357.775 33.0044 359.083 39.5632 359.083 52.3329V600.382C359.083 613.152 357.775 619.71 354.128 626.529C350.708 632.923 345.621 638.01 339.227 641.43C332.408 645.077 325.85 646.385 313.08 646.385H95.5096C82.7399 646.385 76.1811 645.077 69.3625 641.43C62.9684 638.01 57.8811 632.923 54.4615 626.529C50.8149 619.71 49.5063 613.152 49.5063 600.382V52.3329C49.5063 39.5632 50.8149 33.0044 54.4615 26.1858C57.8811 19.7917 62.9684 14.7044 69.3625 11.2848C76.1811 7.63814 82.7399 6.32959 95.5096 6.32959Z"
            fill="url(#paint5_linear)"
            stroke="black"
            strokeWidth={3}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M95.6567 8.26611H312.829C325.111 8.26611 331.497 9.43692 338.174 12.9917C344.257 16.2303 349.088 21.0403 352.342 27.0959C355.913 33.7428 357.089 40.1 357.089 52.3269V600.375C357.089 612.602 355.913 618.959 352.342 625.606C349.088 631.661 344.257 636.472 338.174 639.71C331.497 643.265 325.111 644.436 312.829 644.436H95.6567C83.3745 644.436 76.9885 643.265 70.3114 639.71C64.2285 636.472 59.3967 631.661 56.1435 625.606C52.5726 618.959 51.3965 612.602 51.3965 600.375V52.3269C51.3965 40.1 52.5726 33.7428 56.1435 27.0959C59.3967 21.0403 64.2285 16.2303 70.3114 12.9917C76.9885 9.43692 83.3745 8.26611 95.6567 8.26611Z"
            fill="url(#paint6_linear)"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M95.6567 8.26611H312.829C325.111 8.26611 331.497 9.43692 338.174 12.9917C344.257 16.2303 349.088 21.0403 352.342 27.0959C355.913 33.7428 357.089 40.1 357.089 52.3269V600.375C357.089 612.602 355.913 618.959 352.342 625.606C349.088 631.661 344.257 636.472 338.174 639.71C331.497 643.265 325.111 644.436 312.829 644.436H95.6567C83.3745 644.436 76.9885 643.265 70.3114 639.71C64.2285 636.472 59.3967 631.661 56.1435 625.606C52.5726 618.959 51.3965 612.602 51.3965 600.375V52.3269C51.3965 40.1 52.5726 33.7428 56.1435 27.0959C59.3967 21.0403 64.2285 16.2303 70.3114 12.9917C76.9885 9.43692 83.3745 8.26611 95.6567 8.26611Z"
            fill="url(#paint7_radial)"
          />
          <path
            d="M96.1806 12.3992H312.374C324.118 12.3992 329.777 13.4919 335.657 16.6366C340.993 19.4901 345.213 23.7105 348.067 29.0461C351.211 34.9261 352.304 40.5849 352.304 52.329V600.377C352.304 612.121 351.211 617.78 348.067 623.66C345.213 628.996 340.993 633.216 335.657 636.07C329.777 639.214 324.118 640.307 312.374 640.307H96.1806C84.4365 640.307 78.7776 639.214 72.8977 636.07C67.562 633.216 63.3417 628.996 60.4881 623.66C57.3435 617.78 56.2507 612.121 56.2507 600.377V52.329C56.2507 40.5849 57.3435 34.9261 60.4881 29.0461C63.3417 23.7105 67.562 19.4901 72.8977 16.6366C78.7776 13.4919 84.4365 12.3992 96.1806 12.3992Z"
            fill="black"
          />
          <g filter="url(#filter4_i)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M189.013 651.783C195.127 651.783 212.346 651.783 218.512 651.783C219.331 651.783 219.11 652.701 218.291 652.701H189.234C188.415 652.701 188.194 651.783 189.013 651.783Z"
              fill="#191919"
            />
          </g>
          <g filter="url(#filter5_i)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M70.3122 639.824C64.2292 636.585 59.3974 631.775 56.1442 625.72C52.5733 619.073 51.3972 612.716 51.3972 600.489V52.4406C51.3972 40.2137 52.5733 33.8565 56.1442 27.2096C59.3974 21.154 64.2292 16.344 70.3122 13.1055C71.2879 12.586 55.9147 19.9565 55.9147 50.1456C55.9147 146.961 55.9147 449.603 55.9147 602.784C55.9147 631.8 70.7667 640.066 70.3122 639.824Z"
              fill="white"
              fillOpacity="0.599524"
            />
          </g>
          <g filter="url(#filter6_i)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M338.182 639.824C344.265 636.586 349.097 631.776 352.35 625.72C355.921 619.073 357.097 612.716 357.097 600.489V52.4409C357.097 40.214 355.921 33.8568 352.35 27.2098C349.097 21.1543 344.265 16.3442 338.182 13.1057C337.207 12.5862 352.58 19.9568 352.58 50.1459C352.58 146.961 352.58 449.603 352.58 602.784C352.58 631.8 337.728 640.066 338.182 639.824Z"
              fill="white"
              fillOpacity="0.599524"
            />
          </g>
          <rect
            opacity="0.602808"
            x="43.3923"
            y="57.6028"
            width="5.27847"
            height="3.90148"
            fill="black"
          />
          <rect
            opacity="0.602808"
            x="359.842"
            y="57.6028"
            width="4.36047"
            height="3.90148"
            fill="black"
          />
          <rect
            opacity="0.602808"
            x="43.3923"
            y="591.188"
            width="5.27847"
            height="3.90148"
            fill="black"
          />
          <rect
            opacity="0.602808"
            x="359.842"
            y="591.188"
            width="4.36047"
            height="3.90148"
            fill="black"
          />
          <rect
            opacity="0.602808"
            x="303.635"
            y="5.27881"
            width="5.27847"
            height="3.90148"
            transform="rotate(-90 303.635 5.27881)"
            fill="black"
          />
          <rect
            opacity="0.602808"
            x="100.993"
            y="652.694"
            width="5.27847"
            height="3.90148"
            transform="rotate(-90 100.993 652.694)"
            fill="black"
          />
          <g filter="url(#filter7_ii)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M43.6021 80.7876C42.7173 80.7876 42 81.5068 42 82.3941V102.131C42 103.018 42.7173 103.737 43.6021 103.737H44.5176C44.5176 102.53 44.5331 81.9676 44.5176 80.7876H43.6021Z"
              fill="url(#paint8_linear)"
            />
          </g>
          <g filter="url(#filter8_ii)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M43.6021 122.791C43.0812 122.92 42.4566 123.248 42.123 123.714C42.0543 123.811 42 124.115 42 124.202C42 128.613 42 142.048 42 164.508C42 164.601 42.0765 165.075 42.1233 165.19C42.3932 165.853 42.8622 166.013 43.6021 166.396H44.5176C44.5176 165.189 44.5331 123.971 44.5176 122.791H43.6021Z"
              fill="url(#paint9_linear)"
            />
          </g>
          <g filter="url(#filter9_ii)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M43.6021 177.171C43.0812 177.299 42.4566 177.628 42.123 178.094C42.0543 178.19 42 178.494 42 178.582C42 182.993 42 196.428 42 218.887C42 218.981 42.0765 219.455 42.1233 219.57C42.3932 220.232 42.8622 220.393 43.6021 220.776H44.5176C44.5176 219.568 44.5331 178.351 44.5176 177.171H43.6021Z"
              fill="url(#paint10_linear)"
            />
          </g>
          <g filter="url(#filter10_ii)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M364.679 137.017C365.2 137.145 365.825 137.474 366.158 137.94C366.227 138.036 366.281 138.34 366.281 138.428C366.281 142.839 366.281 181.978 366.281 204.437C366.281 204.531 366.205 205.005 366.158 205.12C365.888 205.782 365.419 205.943 364.679 206.326H363.764C363.764 205.119 363.748 138.197 363.764 137.017H364.679Z"
              fill="url(#paint11_linear)"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M364.679 137.017C365.2 137.145 365.825 137.474 366.158 137.94C366.227 138.036 366.281 138.34 366.281 138.428C366.281 142.839 366.281 181.978 366.281 204.437C366.281 204.531 366.205 205.005 366.158 205.12C365.888 205.782 365.419 205.943 364.679 206.326H363.764C363.764 205.119 363.748 138.197 363.764 137.017H364.679Z"
              fill="url(#paint12_linear)"
            />
          </g>
          <g opacity="0.801364">
            <rect
              x="186.345"
              y="22.4919"
              width="35.8018"
              height="5.50796"
              rx="2.75398"
              fill="#1D1C1C"
            />
            <mask
              id="mask0"
              mask-type="alpha"
              maskUnits="userSpaceOnUse"
              x={186}
              y={22}
              width={37}
              height={6}
            >
              <rect
                x="186.345"
                y="22.4919"
                width="35.8018"
                height="5.50796"
                rx="2.75398"
                fill="white"
              />
            </mask>
            <g mask="url(#mask0)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M186.345 22.4919H222.147V22.8936H186.345V22.4919ZM186.346 23.6877H222.147V24.0893H186.346V23.6877ZM222.147 24.6994H186.346V25.1011H222.147V24.6994ZM186.346 25.8952H222.147V26.2969H186.346V25.8952ZM222.147 26.9069H186.346V27.3086H222.147V26.9069Z"
                fill="black"
                fillOpacity="0.15"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M186.343 23.405H222.144V23.8067H186.343V23.405ZM186.343 24.6218H222.145V25.0234H186.343V24.6218ZM222.145 25.6127H186.343V26.0143H222.145V25.6127ZM186.343 26.8317H222.145V27.2333H186.343V26.8317ZM222.145 27.821H186.343V28.2226H222.145V27.821Z"
                fill="white"
                fillOpacity="0.03"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M188.385 22.4912H188.792V27.9992H188.385V22.4912ZM187.171 22.4914H187.578V27.9994H187.171V22.4914ZM189.775 22.4912H189.368V27.9992H189.775V22.4912ZM190.583 22.4912H190.99V27.9992H190.583V22.4912ZM192.062 22.4912H191.655V27.9992H192.062V22.4912ZM192.873 22.4912H193.28V27.9992H192.873V22.4912ZM194.26 22.4912H193.853V27.9992H194.26V22.4912ZM195.067 22.4912H195.474V27.9992H195.067V22.4912ZM196.547 22.4912H196.14V27.9992H196.547V22.4912ZM197.354 22.4912H197.761V27.9992H197.354V22.4912ZM198.744 22.4912H198.337V27.9992H198.744V22.4912ZM199.551 22.4912H199.958V27.9992H199.551V22.4912ZM201.031 22.4912H200.624V27.9992H201.031V22.4912ZM201.841 22.4912H202.248V27.9992H201.841V22.4912ZM203.463 22.4912H203.056V27.9992H203.463V22.4912ZM204.036 22.4912H204.443V27.9992H204.036V22.4912ZM205.657 22.4912H205.25V27.9992H205.657V22.4912ZM206.323 22.4912H206.73V27.9992H206.323V22.4912ZM207.947 22.4912H207.54V27.9992H207.947V22.4912ZM208.52 22.4912H208.927V27.9992H208.52V22.4912ZM210.142 22.4912H209.734V27.9992H210.142V22.4912ZM210.792 22.4912H211.199V27.9992H210.792V22.4912ZM212.432 22.4912H212.025V27.9992H212.432V22.4912ZM213.005 22.4912H213.412V27.9992H213.005V22.4912ZM214.626 22.4912H214.219V27.9992H214.626V22.4912ZM215.224 22.4912H215.631V27.9992H215.224V22.4912ZM216.897 22.4912H216.49V27.9992H216.897V22.4912ZM217.723 22.4912H218.13V27.9992H217.723V22.4912ZM219.11 22.4912H218.703V27.9992H219.11V22.4912ZM219.918 22.4912H220.325V27.9992H219.918V22.4912ZM221.333 22.4912H220.925V27.9992H221.333V22.4912Z"
                fill="black"
                fillOpacity="0.15"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M187.407 22.4915H187.814V27.9994H187.407V22.4915ZM186.191 22.4916H186.598V27.9996H186.191V22.4916ZM188.889 22.4915H188.482V27.9994H188.889V22.4915ZM189.697 22.4915H190.104V27.9994H189.697V22.4915ZM191.084 22.4915H190.677V27.9994H191.084V22.4915ZM191.894 22.4915H192.301V27.9994H191.894V22.4915ZM193.374 22.4915H192.967V27.9994H193.374V22.4915ZM194.181 22.4915H194.588V27.9994H194.181V22.4915ZM195.568 22.4915H195.161V27.9994H195.568V22.4915ZM196.376 22.4915H196.783V27.9994H196.376V22.4915ZM197.858 22.4915H197.451V27.9994H197.858V22.4915ZM198.666 22.4915H199.073V27.9994H198.666V22.4915ZM200.053 22.4915H199.646V27.9994H200.053V22.4915ZM200.863 22.4915H201.27V27.9994H200.863V22.4915ZM202.484 22.4915H202.077V27.9994H202.484V22.4915ZM203.15 22.4915H203.557V27.9994H203.15V22.4915ZM204.771 22.4915H204.364V27.9994H204.771V22.4915ZM205.344 22.4915H205.751V27.9994H205.344V22.4915ZM206.969 22.4915H206.562V27.9994H206.969V22.4915ZM207.625 22.4915H208.032V27.9994H207.625V22.4915ZM209.256 22.4915H208.849V27.9994H209.256V22.4915ZM209.832 22.4915H210.239V27.9994H209.832V22.4915ZM211.453 22.4915H211.046V27.9994H211.453V22.4915ZM212.06 22.4915H212.467V27.9994H212.06V22.4915ZM213.734 22.4915H213.327V27.9994H213.734V22.4915ZM214.313 22.4915H214.72V27.9994H214.313V22.4915ZM215.938 22.4915H215.531V27.9994H215.938V22.4915ZM216.745 22.4915H217.152V27.9994H216.745V22.4915ZM218.166 22.4915H217.759V27.9994H218.166V22.4915ZM219.026 22.4915H219.433V27.9994H219.026V22.4915ZM220.422 22.4915H220.015V27.9994H220.422V22.4915Z"
                fill="white"
                fillOpacity="0.03"
              />
            </g>
            <g opacity="0.244441" filter="url(#filter11_iii)">
              <rect
                x="186.345"
                y="22.4919"
                width="35.8018"
                height="5.50796"
                rx="2.75398"
                fill="black"
                fillOpacity="0.01"
              />
            </g>
            <mask
              id="mask1"
              mask-type="alpha"
              maskUnits="userSpaceOnUse"
              x={186}
              y={22}
              width={37}
              height={6}
            >
              <rect
                x="186.345"
                y="22.4919"
                width="35.8018"
                height="5.50796"
                rx="2.75398"
                fill="white"
              />
            </mask>
            <g mask="url(#mask1)" />
          </g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M235.885 29.6074C238.547 29.6074 240.705 27.4497 240.705 24.788C240.705 22.1263 238.547 19.9685 235.885 19.9685C233.224 19.9685 231.066 22.1263 231.066 24.788C231.066 27.4497 233.224 29.6074 235.885 29.6074Z"
            fill="url(#paint13_radial)"
          />
          <g opacity="0.387535" filter="url(#filter12_dd)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M235.944 27.3004C237.338 27.3004 238.468 26.1702 238.468 24.7759C238.468 23.3817 237.338 22.2515 235.944 22.2515C234.549 22.2515 233.419 23.3817 233.419 24.7759C233.419 26.1702 234.549 27.3004 235.944 27.3004Z"
              fill="url(#paint14_radial)"
            />
          </g>
          <mask
            id="mask2"
            mask-type="alpha"
            maskUnits="userSpaceOnUse"
            x={233}
            y={22}
            width={6}
            height={6}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M235.944 27.3004C237.338 27.3004 238.468 26.1702 238.468 24.7759C238.468 23.3817 237.338 22.2515 235.944 22.2515C234.549 22.2515 233.419 23.3817 233.419 24.7759C233.419 26.1702 234.549 27.3004 235.944 27.3004Z"
              fill="white"
            />
          </mask>
          <g mask="url(#mask2)">
            <g filter="url(#filter13_f)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M234.228 24.011C234.45 23.1231 235.083 22.4206 234.608 22.3021C234.133 22.1835 234.02 22.1875 233.323 23.8753C232.626 25.5631 233.421 26.2634 233.896 26.382C234.371 26.5005 234.007 24.8989 234.228 24.011Z"
                fill="#3E89CC"
              />
            </g>
            <g filter="url(#filter14_f)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M237.866 26.1529C238.69 26.1529 239.358 25.2796 239.358 24.2022C239.358 23.1248 238.69 22.2515 237.866 22.2515C237.043 22.2515 236.375 23.1248 236.375 24.2022C236.375 25.2796 237.043 26.1529 237.866 26.1529Z"
                fill="#1C5894"
              />
            </g>
            <g filter="url(#filter15_f)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M236.882 28.2739C238.101 27.9245 238.904 26.9993 238.677 26.2074C238.45 25.4154 237.278 25.0566 236.06 25.406C234.841 25.7554 234.038 26.6806 234.265 27.4725C234.492 28.2645 235.664 28.6233 236.882 28.2739Z"
                fill="#0A152B"
              />
            </g>
          </g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M63.4646 114.952C61.7522 124.851 61.7522 136.706 61.7522 160.415V492.27C61.7522 515.979 61.7522 527.834 63.4646 537.733C71.8965 586.473 110.068 624.644 158.808 633.076C168.707 634.788 180.561 634.788 204.271 634.788C227.98 634.788 239.835 634.788 249.734 633.076C298.474 624.644 336.645 586.473 345.077 537.733C346.789 527.834 346.789 515.979 346.789 492.27V160.415C346.789 136.706 346.789 124.851 345.077 114.952C338.233 75.389 311.793 42.7892 276.012 27.4064C275.671 28.914 275.19 30.1082 274.573 31.2617C273.253 33.7301 271.315 35.6673 268.847 36.9874C266.379 38.3075 263.723 39.0105 258.213 39.0105H150.394C144.884 39.0105 142.229 38.3075 139.761 36.9874C137.292 35.6673 135.355 33.7301 134.035 31.2617C133.415 30.103 132.93 28.9007 132.588 27.3813C96.7772 42.7538 70.3127 75.3675 63.4646 114.952Z"
            fill="#1D2129"
          />
          <mask
            id="mask3"
            mask-type="alpha"
            maskUnits="userSpaceOnUse"
            x={61}
            y={17}
            width={286}
            height={618}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M63.7141 27.7249C61.7522 31.5753 61.7522 36.6158 61.7522 46.6967V605.988C61.7522 616.069 61.7522 621.11 63.7141 624.96C65.4398 628.347 68.1935 631.101 71.5804 632.827C75.4308 634.788 80.4712 634.788 90.5522 634.788H317.989C328.07 634.788 333.111 634.788 336.961 632.827C340.348 631.101 343.102 628.347 344.827 624.96C346.789 621.11 346.789 616.069 346.789 605.989V46.6967C346.789 36.6158 346.789 31.5753 344.827 27.7249C343.102 24.338 340.348 21.5843 336.961 19.8586C333.111 17.8967 328.07 17.8967 317.989 17.8967H90.5522C80.4713 17.8967 75.4308 17.8967 71.5804 19.8586C68.1935 21.5843 65.4398 24.338 63.7141 27.7249ZM276.596 22.0277C276.661 19.7463 278.445 17.8967 280.727 17.8967H127.881C130.162 17.8967 131.95 19.7463 132.012 22.0277C132.136 26.6012 132.832 29.0136 134.035 31.2618C135.355 33.7302 137.292 35.6674 139.761 36.9875C142.229 38.3076 144.884 39.0106 150.394 39.0106H258.213C263.723 39.0106 266.379 38.3076 268.847 36.9875C271.315 35.6674 273.253 33.7302 274.573 31.2618C275.776 29.0125 276.464 26.6081 276.596 22.0277Z"
              fill="white"
            />
          </mask>
          <g mask="url(#mask3)">
            <rect
              x="61.7522"
              y="18.356"
              width="285.037"
              height="616.892"
              rx={6}
              fill="#1D2129"
            />
            <rect
              x="49.9272"
              y="19.0293"
              width="313.974"
              height="342.517"
              fill="#C4C4C4"
            />
            <rect x={61} y={4} width={285} height={637} rx={9} fill="white" />
          </g>
          <defs>
            <filter
              id="filter0_d"
              x="0.917236"
              y="606.796"
              width="406.479"
              height="98.4914"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy={3} />
              <feGaussianBlur stdDeviation="22.5" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow"
                result="shape"
              />
            </filter>
            <filter
              id="filter1_d"
              x="32.959"
              y="634.264"
              width="341.929"
              height="42.6555"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy={3} />
              <feGaussianBlur stdDeviation={9} />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow"
                result="shape"
              />
            </filter>
            <filter
              id="filter2_d"
              x="49.9495"
              y="641.634"
              width="308.831"
              height="27.4425"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy={3} />
              <feGaussianBlur stdDeviation={6} />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow"
                result="shape"
              />
            </filter>
            <filter
              id="filter3_i"
              x="45.6516"
              y="1.8269"
              width="317.167"
              height="649.023"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation={4} />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2={-1}
                k3={1}
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0"
              />
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
            </filter>
            <filter
              id="filter4_i"
              x="188.498"
              y="651.783"
              width="30.5288"
              height="1.91799"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy={1} />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2={-1}
                k3={1}
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.299054 0 0 0 0 0.299054 0 0 0 0 0.299054 0 0 0 1 0"
              />
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
            </filter>
            <filter
              id="filter5_i"
              x="40.3972"
              y="13.0803"
              width="29.9595"
              height="626.749"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx={-11} />
              <feGaussianBlur stdDeviation="8.5" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2={-1}
                k3={1}
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0"
              />
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
            </filter>
            <filter
              id="filter6_i"
              x="327.138"
              y="13.0806"
              width="29.9595"
              height="626.749"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx={-11} />
              <feGaussianBlur stdDeviation="8.5" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2={-1}
                k3={1}
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0"
              />
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
            </filter>
            <filter
              id="filter7_ii"
              x={42}
              y="77.7876"
              width="2.52448"
              height="28.9499"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy={6} />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2={-1}
                k3={1}
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.757614 0"
              />
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy={-6} />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2={-1}
                k3={1}
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.757614 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_innerShadow"
                result="effect2_innerShadow"
              />
            </filter>
            <filter
              id="filter8_ii"
              x={42}
              y="119.791"
              width="2.52448"
              height="49.6047"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy={6} />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2={-1}
                k3={1}
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.757614 0"
              />
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy={-6} />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2={-1}
                k3={1}
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.757614 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_innerShadow"
                result="effect2_innerShadow"
              />
            </filter>
            <filter
              id="filter9_ii"
              x={42}
              y="174.171"
              width="2.52448"
              height="49.6047"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy={6} />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2={-1}
                k3={1}
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.757614 0"
              />
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy={-6} />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2={-1}
                k3={1}
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.757614 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_innerShadow"
                result="effect2_innerShadow"
              />
            </filter>
            <filter
              id="filter10_ii"
              x="363.757"
              y="134.017"
              width="2.52448"
              height="75.3086"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy={6} />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2={-1}
                k3={1}
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.757614 0"
              />
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy={-6} />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2={-1}
                k3={1}
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.757614 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_innerShadow"
                result="effect2_innerShadow"
              />
            </filter>
            <filter
              id="filter11_iii"
              x="186.345"
              y="22.4919"
              width="35.8018"
              height="5.50796"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation={2} />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2={-1}
                k3={1}
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.795035 0"
              />
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy={-4} />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2={-1}
                k3={1}
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.80013 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_innerShadow"
                result="effect2_innerShadow"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy={-2} />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2={-1}
                k3={1}
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.197067 0"
              />
              <feBlend
                mode="normal"
                in2="effect2_innerShadow"
                result="effect3_innerShadow"
              />
            </filter>
            <filter
              id="filter12_dd"
              x="227.419"
              y="16.2515"
              width="17.049"
              height="17.049"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset />
              <feGaussianBlur stdDeviation={3} />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_dropShadow"
                result="effect2_dropShadow"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect2_dropShadow"
                result="shape"
              />
            </filter>
            <filter
              id="filter13_f"
              x="226.722"
              y="16.0802"
              width="14.3371"
              height="16.3431"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="3.00042"
                result="effect1_foregroundBlur"
              />
            </filter>
            <filter
              id="filter14_f"
              x="230.374"
              y="16.2506"
              width="14.9851"
              height="15.9031"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="3.00042"
                result="effect1_foregroundBlur"
              />
            </filter>
            <filter
              id="filter15_f"
              x="229.348"
              y="20.2681"
              width="14.2452"
              height="13.1437"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="2.25266"
                result="effect1_foregroundBlur"
              />
            </filter>
            <linearGradient
              id="paint0_linear"
              x1="45.6516"
              y1="1.8269"
              x2="45.6516"
              y2="650.849"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#C9C6C8" />
              <stop offset="0.0168336" stopColor="#2C2A2A" />
              <stop offset="0.0782507" stopColor="#C9C6C8" />
              <stop offset="0.920557" stopColor="#C9C6C8" />
              <stop offset="0.980426" stopColor="#2C2A2A" />
              <stop offset={1} stopColor="#C9C6C8" />
            </linearGradient>
            <linearGradient
              id="paint1_linear"
              x1="193.976"
              y1="4.82959"
              x2="193.976"
              y2="45.948"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0.7" />
              <stop offset={1} stopOpacity="0.01" />
            </linearGradient>
            <linearGradient
              id="paint2_linear"
              x1="215.526"
              y1="646.966"
              x2="215.526"
              y2="601.576"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0.7" />
              <stop offset={1} stopOpacity="0.01" />
            </linearGradient>
            <linearGradient
              id="paint3_linear"
              x1="205.573"
              y1="649.027"
              x2="205.573"
              y2="641.572"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0.75" />
              <stop offset={1} stopColor="white" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient
              id="paint4_linear"
              x1="202.697"
              y1="3.80517"
              x2="202.697"
              y2="8.38661"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0.75" />
              <stop offset={1} stopColor="white" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient
              id="paint5_linear"
              x1="48.0063"
              y1="4.82959"
              x2="48.0063"
              y2="647.885"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#5F5F5F" />
              <stop offset="0.0101238" stopColor="#222222" />
              <stop offset={1} stopColor="#252525" />
            </linearGradient>
            <linearGradient
              id="paint6_linear"
              x1="51.3965"
              y1="8.26611"
              x2="51.3965"
              y2="644.436"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6D6D6D" />
              <stop offset="0.0161168" />
              <stop offset="0.984697" />
              <stop offset={1} stopColor="#5C5C5C" />
            </linearGradient>
            <radialGradient
              id="paint7_radial"
              cx={0}
              cy={0}
              r={1}
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(197.052 638.029) rotate(90) scale(184.212 64.6216)"
            >
              <stop stopColor="white" stopOpacity="0.151268" />
              <stop offset={1} stopColor="white" stopOpacity="0.01" />
            </radialGradient>
            <linearGradient
              id="paint8_linear"
              x1="42.6862"
              y1="94.2656"
              x2="43.3801"
              y2="94.2656"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A5A5A5" />
              <stop offset="0.00734796" stopColor="#E2E2E2" />
              <stop offset="0.994739" stopColor="#BEBEBE" />
              <stop offset={1} stopColor="#9D9D9D" />
            </linearGradient>
            <linearGradient
              id="paint9_linear"
              x1="42.6862"
              y1="148.399"
              x2="43.3801"
              y2="148.399"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A5A5A5" />
              <stop offset="0.00734796" stopColor="#E2E2E2" />
              <stop offset="0.994739" stopColor="#BEBEBE" />
              <stop offset={1} stopColor="#9D9D9D" />
            </linearGradient>
            <linearGradient
              id="paint10_linear"
              x1="42.6862"
              y1="202.779"
              x2="43.3801"
              y2="202.779"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A5A5A5" />
              <stop offset="0.00734796" stopColor="#E2E2E2" />
              <stop offset="0.994739" stopColor="#BEBEBE" />
              <stop offset={1} stopColor="#9D9D9D" />
            </linearGradient>
            <linearGradient
              id="paint11_linear"
              x1="365.409"
              y1="168.73"
              x2="365.37"
              y2="168.73"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#8E8E8E" />
              <stop offset={1} stopColor="#BCBCBC" />
            </linearGradient>
            <linearGradient
              id="paint12_linear"
              x1="366.281"
              y1="137.017"
              x2="366.281"
              y2="206.326"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopOpacity="0.996971" />
              <stop offset="0.0951211" stopOpacity="0.01" />
              <stop offset="0.895463" stopOpacity="0.01" />
              <stop offset={1} stopOpacity="0.881058" />
            </linearGradient>
            <radialGradient
              id="paint13_radial"
              cx={0}
              cy={0}
              r={1}
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(242.735 32.8968) rotate(45.1938) scale(9.70268)"
            >
              <stop stopColor="#434343" />
              <stop offset={1} stopColor="#121212" />
            </radialGradient>
            <radialGradient
              id="paint14_radial"
              cx={0}
              cy={0}
              r={1}
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(235.944 22.2515) rotate(90) scale(5.04897)"
            >
              <stop stopColor="#2A4893" />
              <stop offset={1} stopColor="#213054" />
            </radialGradient>
          </defs>
        </svg>

        <div
          style={{
            position: "absolute",
            width: "285px",
            left: "calc(30% - 74.5px)",
            top: "41px",
            borderTopLeftRadius: "22px",
            borderTopRightRadius: "22px",
            borderBottomLeftRadius: "22px",
            borderBottomRightRadius: "22px",
            height: "620px",
            overflow: "hidden"
          }}
        >
          <div
            className="iphone_box"
            style={{
              position: "relative",
              width: "285px"
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                background: "white",
                border: "1.5px solid #FFFFFF",
                boxSizing: "border-box",
                position: "absolute",
                zIndex: 99,
                left: "9px",
                top: "8px",
                borderRadius: "50%",
                boxShadow: "0px 1px 4px rgba(109, 121, 141, 0.23)",
                textAlign: "center"
              }}
            >
              <svg
                width={17}
                height={34}
                viewBox="0 0 18 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  style={{ fill: this.props.brandColor }}
                  d="M0.884385 21.9437C0.77501 21.9437 0.665635 21.9218 0.55626 21.8562C0.25001 21.6812 0.140635 21.2874 0.315635 20.9593C2.08751 17.853 5.41251 15.9062 9.00001 15.9062C12.5875 15.9062 15.9125 17.853 17.6844 20.9593C17.8594 21.2655 17.75 21.6812 17.4438 21.8562C17.1375 22.0312 16.7219 21.9218 16.5469 21.6155C14.9938 18.903 12.1063 17.2187 9.00001 17.2187C5.89376 17.2187 3.00626 18.903 1.45314 21.6155C1.34376 21.8124 1.12501 21.9437 0.884385 21.9437ZM11.975 2.36553L11.8875 2.23428C11.2531 1.3374 10.2031 0.790527 9.10939 0.790527H7.25001C4.47189 0.790527 2.21876 3.04365 2.21876 5.82178C2.21876 6.19365 2.50314 6.47803 2.87501 6.47803H4.01251C4.03439 6.47803 4.03439 6.47803 4.05626 6.47803C6.57189 6.47803 9.13126 6.47803 10.9688 4.8374V4.85928C11.0563 4.77178 11.1438 4.70615 11.2094 4.61865C11.45 4.35615 11.8656 4.3124 12.1281 4.55303C12.4125 4.79365 12.4344 5.23115 12.1719 5.51553C12.0625 5.6249 11.975 5.7124 11.8656 5.82178C11.5813 6.10615 11.6906 6.5874 12.0625 6.74053C12.2813 6.82803 12.5219 6.87178 12.7625 6.89365C13.0906 6.9374 13.3531 7.1999 13.3531 7.5499V9.0374C13.3531 11.3562 11.6031 13.3468 9.28439 13.4999C6.76876 13.6749 4.64689 11.6624 4.62501 9.14678C4.62501 8.79678 4.36251 8.49053 4.01251 8.46865C3.64064 8.44678 3.31251 8.75303 3.31251 9.1249C3.31251 12.253 5.87189 14.8124 9.00001 14.8124C12.0406 14.8124 14.5344 12.428 14.6875 9.40928C14.6875 9.3874 14.6875 9.36553 14.6875 9.34365V6.28115V5.6249V5.40615C14.6875 3.83115 13.5063 2.54053 11.975 2.36553Z"
                  fill="white"
                />
              </svg>
            </div>

            <div
              style={{
                width: "34px",
                height: "34px",
                background: "white",
                border: "1.5px solid #FFFFFF",
                boxSizing: "border-box",
                position: "absolute",
                zIndex: 99,
                left: "9px",
                top: "54px",
                borderRadius: "50%",
                boxShadow: "0px 1px 4px rgba(109, 121, 141, 0.23)",
                textAlign: "center"
              }}
            >
              <svg
                width={16}
                height={34}
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M46.4428 0.934645L2.14791 19.7391C0.551821 20.4167 0.515294 22.6656 2.08854 23.3947L17.8454 30.6966C18.2685 30.8927 18.6097 31.2304 18.8102 31.6514L26.5896 47.9883C27.3309 49.5448 29.5626 49.4969 30.2363 47.9099L49.0654 3.55717C49.7683 1.90141 48.0986 0.231732 46.4428 0.934645Z"
                  fill="#B6BCC0"
                />
              </svg>
            </div>

            <DeckGL
              layers={[layer_bus]}
              initialViewState={this.state.viewport}
              controller={true}
            >
              <StaticMap
                reuseMaps
                mapStyle={mapStyle}
                preventStyleDiffing={true}
                mapboxApiAccessToken={MAPBOX_TOKEN}
              />
            </DeckGL>
            <div
              style={{
                background: "white",
                width: "100%",
                height: "100vh",
                zIndex: 99,
                position: "absolute",
                boxSizing: "border-box",

                display: this.state.displayTripOverlay
              }}
            >
              <div style={{ background: "#0B6E70", paddingBottom: "12px" }}>
                <div>
                  <div
                    style={{ paddingTop: "12px", display: "flex" }}
                    onClick={this.closeTripOverlay}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 45 45"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M27 8L13 22L27 38" stroke="#fff" />
                    </svg>{" "}
                  </div>

                  <div
                    style={{
                      /* rectangle 3.2 */
                      /* position: 'absolute', */
                      width: "calc(100% - 12px)",
                      marginLeft: "6px",
                      height: "76px",
                      left: "22px",
                      top: "102px",
                      background: "#FFFFFF",
                      boxShadow: "0px 1px 3px rgba(8, 15, 86, 0.42)",
                      borderRadius: "5px",
                      marginTop: "8px",
                      display: this.state.showStartEnd
                    }}
                  >
                    <div style={{ width: "30px" }}>
                      <svg
                        width={11}
                        height={80}
                        viewBox="0 0 11 80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ width: "5px", height: "76px" }}
                      >
                        <circle
                          cx="5.5"
                          cy="5.5"
                          r="4.5"
                          fill="#fff"
                          stroke="#3AA1AE"
                          strokewidth={2}
                        />
                        <circle
                          cx="5.5"
                          cy="74.5"
                          r="4.5"
                          fill="#fff"
                          stroke="#3AA1AE"
                          strokewidth={2}
                        />
                        <circle
                          cx="5.5"
                          cy="20.5"
                          r="2.5"
                          fill="#3AA1AE"
                          stroke="#3AA1AE"
                          strokewidth={2}
                        />
                        <circle
                          cx="5.5"
                          cy="33.5"
                          r="2.5"
                          fill="#3AA1AE"
                          stroke="#3AA1AE"
                          strokewidth={2}
                        />
                        <circle
                          cx="5.5"
                          cy="46.5"
                          r="2.5"
                          fill="#3AA1AE"
                          stroke="#3AA1AE"
                          strokewidth={2}
                        />
                        <circle
                          cx="5.5"
                          cy="59.5"
                          r="2.5"
                          fill="#3AA1AE"
                          stroke="#3AA1AE"
                          strokewidth={2}
                        />
                      </svg>
                    </div>

                    <div style={{ width: "100%" }}>
                      <input
                        autocomplete="off"
                        name="startPlace"
                        onChange={this.handlePlaceChange.bind(this)}
                        value={this.state.start.txt}
                        type="text"
                        style={{
                          width: "100%",
                          height: "38px",
                          background: "transparent",
                          border: "none"
                        }}
                      />
                      <div
                        style={{
                          borderBottom: "1px solid #b6dde0",
                          marginRight: "8px"
                        }}
                      />

                      <input
                        name="endPlace"
                        autocomplete="off"
                        onChange={this.handlePlaceChange.bind(this)}
                        value={this.state.end.txt}
                        type="text"
                        style={{
                          width: "100%",
                          height: "38px",
                          background: "transparent",
                          border: "none"
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="am_atlas_res_types_list"
                  style={{
                    width: "100%",
                    height: "28px",
                    paddingBottom: "8px",
                    display: this.state.showResTypes,
                    flexDirection: "row"
                  }}
                >
                  <div>
                    <svg
                      width={40}
                      height={26}
                      viewBox="0 0 40 39"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="10.1299"
                        cy="7.23533"
                        r="7.23533"
                        fill="white"
                        fillOpacity="0.79"
                      />
                      <path
                        d="M17.3652 7.23533C17.3652 5.80432 16.9408 4.40544 16.1458 3.2156C15.3508 2.02575 14.2208 1.09838 12.8987 0.550757C11.5766 0.00313169 10.1218 -0.140152 8.71832 0.139025C7.3148 0.418202 6.02559 1.1073 5.01371 2.11918C4.00183 3.13106 3.31273 4.42027 3.03356 5.82379C2.75438 7.2273 2.89766 8.68209 3.44529 10.0042C3.99291 11.3263 4.92028 12.4563 6.11013 13.2513C7.29997 14.0463 8.69885 14.4707 10.1299 14.4707V7.23533H17.3652Z"
                        fill="white"
                        fillOpacity="0.79"
                      />
                      <circle
                        cx="29.665"
                        cy="7.23537"
                        r="7.23533"
                        transform="rotate(-90 29.665 7.23537)"
                        fill="white"
                        fillOpacity="0.79"
                      />
                      <path
                        d="M29.665 4.1008e-05C28.234 4.1008e-05 26.8351 0.424386 25.6453 1.21941C24.4554 2.01444 23.5281 3.14445 22.9804 4.46653C22.4328 5.78861 22.2895 7.2434 22.5687 8.64691C22.8479 10.0504 23.537 11.3396 24.5489 12.3515C25.5607 13.3634 26.85 14.0525 28.2535 14.3317C29.657 14.6109 31.1118 14.4676 32.4339 13.9199C33.7559 13.3723 34.8859 12.445 35.681 11.2551C36.476 10.0653 36.9003 8.66639 36.9003 7.23537L29.665 7.23537L29.665 4.1008e-05Z"
                        fill="white"
                        fillOpacity="0.79"
                      />
                      <circle
                        cx="29.7675"
                        cy="28.3206"
                        r="7.23533"
                        transform="rotate(-45 29.7675 28.3206)"
                        fill="white"
                        fillOpacity="0.79"
                      />
                      <path
                        d="M34.8836 23.2044C33.8717 22.1925 32.5825 21.5034 31.179 21.2243C29.7755 20.9451 28.3207 21.0884 26.9986 21.636C25.6765 22.1836 24.5465 23.111 23.7515 24.3008C22.9565 25.4907 22.5321 26.8895 22.5321 28.3206C22.5321 29.7516 22.9565 31.1504 23.7515 32.3403C24.5465 33.5301 25.6765 34.4575 26.9986 35.0051C28.3207 35.5528 29.7755 35.696 31.179 35.4169C32.5825 35.1377 33.8717 34.4486 34.8836 33.4367L29.7675 28.3206L34.8836 23.2044Z"
                        fill="white"
                        fillOpacity="0.79"
                      />
                      <circle
                        cx="10.2323"
                        cy="28.3206"
                        r="7.23533"
                        transform="rotate(-45 10.2323 28.3206)"
                        fill="white"
                        fillOpacity="0.79"
                      />
                      <path
                        d="M15.3485 23.2044C14.3366 22.1925 13.0474 21.5034 11.6438 21.2243C10.2403 20.9451 8.78555 21.0884 7.46346 21.636C6.14138 22.1836 5.01137 23.111 4.21635 24.3008C3.42132 25.4907 2.99697 26.8895 2.99697 28.3206C2.99697 29.7516 3.42132 31.1504 4.21635 32.3403C5.01137 33.5301 6.14138 34.4575 7.46346 35.0051C8.78555 35.5528 10.2403 35.696 11.6438 35.4169C13.0474 35.1377 14.3366 34.4486 15.3485 33.4367L10.2323 28.3206L15.3485 23.2044Z"
                        fill="white"
                        fillOpacity="0.79"
                      />
                    </svg>
                  </div>
                  <div>
                    <svg
                      width={24}
                      height={26}
                      viewBox="0 0 46 46"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="38.6954"
                        cy="39.9848"
                        r="5.15932"
                        fill="#BDCCD5"
                      />
                      <path
                        d="M6.4502 7.73901V31.5183C6.4502 32.4574 6.88997 33.3423 7.63851 33.9095L13.1511 38.0861C13.6725 38.4811 14.3087 38.6949 14.9628 38.6949H30.9347C32.4277 38.6949 33.6693 37.536 34.5122 36.3037C35.2526 35.2215 36.5281 34.1805 38.6959 34.1805C43.8553 34.1805 44.5002 38.6949 44.5002 38.6949"
                        stroke="#DFE9F0"
                        strokeWidth="1.7"
                      />
                      <path
                        d="M5.15918 6.44897H7.73884V41.2744H5.15918V6.44897Z"
                        fill="white"
                      />
                      <circle
                        cx="6.44936"
                        cy="39.9848"
                        r="5.15932"
                        fill="#C9D1D7"
                      />
                      <circle
                        cx="6.4488"
                        cy="39.9849"
                        r="2.57966"
                        fill="#001C6E"
                      />
                      <circle
                        cx="38.6949"
                        cy="39.9849"
                        r="2.57966"
                        fill="#001C6E"
                      />
                      <path
                        d="M2.5791 2.57983L6.44859 5.15949V9.6739"
                        stroke="white"
                        strokeWidth={2}
                      />
                      <circle
                        cx="1.93474"
                        cy="1.93474"
                        r="1.93474"
                        fill="white"
                      />
                      <rect
                        x="15.4785"
                        y="37.4053"
                        width="15.478"
                        height="0.515932"
                        fill="#00144F"
                      />
                      <path
                        d="M3.9863 18.1748L5.76596 19.9544C6.01794 20.2064 6.4488 20.028 6.4488 19.6716V9.42881C6.4488 9.20789 6.26971 9.02881 6.0488 9.02881H4.26914C4.04823 9.02881 3.86914 9.20789 3.86914 9.42881V17.8919C3.86914 17.998 3.91128 18.0998 3.9863 18.1748Z"
                        fill="#4D5D8B"
                      />
                    </svg>
                  </div>
                  <div>
                    <svg
                      width={60}
                      height={26}
                      viewBox="0 0 60 38"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M47.518 12.3581C45.7878 12.3581 44.1195 12.7289 42.5747 13.3468L40.4737 9.26855V2.78039C40.4737 2.40964 40.2266 2.03889 39.8558 1.91531L34.9125 0.0615478C34.4181 -0.123828 33.9238 0.123339 33.7384 0.617675C33.553 1.11201 33.8002 1.60635 34.2945 1.79172L38.6818 3.39831V8.65063H20.5767V6.85866H22.8012C23.2956 6.85866 23.7281 6.42612 23.7281 5.93178C23.7281 5.43745 23.2956 5.0049 22.8012 5.0049H17.0546C16.5602 5.0049 16.1277 5.43745 16.1277 5.93178C16.1277 6.42612 16.5602 6.85866 17.0546 6.85866H18.723V9.39213L16.931 13.285C15.5716 12.7289 14.0268 12.4199 12.482 12.4199C5.62307 12.4199 0 17.9812 0 24.9019C0 31.8226 5.56128 37.3839 12.482 37.3839C19.0319 37.3839 24.4078 32.2552 24.9022 25.8288H28.9186C29.2276 25.8288 29.4748 25.7052 29.6601 25.458L39.3615 11.4313L40.9063 14.3355C37.3841 16.4364 35.036 20.3911 35.036 24.8401C35.036 31.699 40.5973 37.3221 47.518 37.3221C54.4387 37.3221 60 31.7608 60 24.8401C60 17.9194 54.4387 12.3581 47.518 12.3581ZM12.482 35.4683C6.61174 35.4683 1.85376 30.7104 1.85376 24.8401C1.85376 18.9699 6.61174 14.2119 12.482 14.2119C13.7796 14.2119 15.0154 14.4591 16.1277 14.8916L11.6169 24.4694C11.6169 24.4694 11.6169 24.4694 11.6169 24.5312C11.5551 24.6547 11.5551 24.7165 11.5551 24.8401C11.5551 24.8401 11.5551 24.8401 11.5551 24.9019C11.5551 25.0255 11.5551 25.0873 11.6169 25.2109V25.2727C11.6169 25.3345 11.6169 25.3345 11.6787 25.3963C11.6787 25.458 11.7405 25.458 11.8023 25.5198C11.8023 25.5198 11.8023 25.5198 11.8023 25.5816C11.8641 25.6434 11.9876 25.7052 12.0494 25.767H12.1112C12.2348 25.8288 12.2966 25.8288 12.4202 25.8288H22.9866C22.5541 31.2047 18.0433 35.4683 12.482 35.4683ZM13.9032 23.9132L17.7961 15.6949C20.7003 17.3633 22.7394 20.3911 23.0484 23.9132H13.9032ZM28.4243 23.9132H24.8404C24.5314 19.6496 22.0597 16.0039 18.5376 13.9647L20.206 10.4426H37.6931L28.4243 23.9132ZM47.4562 35.4683C41.586 35.4683 36.828 30.7104 36.828 24.8401C36.828 21.0708 38.8054 17.7958 41.7714 15.8803L46.6529 25.2727C46.8383 25.5816 47.1473 25.767 47.4562 25.767C47.5798 25.767 47.7652 25.7052 47.8888 25.6434C48.3213 25.3963 48.5067 24.8401 48.2595 24.4076L43.378 15.0152C44.6756 14.5209 46.035 14.2119 47.4562 14.2119C53.3265 14.2119 58.0844 18.9699 58.0844 24.8401C58.0844 30.7104 53.3265 35.4683 47.4562 35.4683Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div>
                    <svg
                      width={40}
                      height={26}
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M28.5909 15.7495H27.1595C26.7888 15.7495 26.4883 16.05 26.4883 16.4207C26.4883 16.7913 26.7887 17.0919 27.1595 17.0919H28.5909C28.9616 17.0919 29.2621 16.7914 29.2621 16.4207C29.262 16.05 28.9616 15.7495 28.5909 15.7495Z"
                        fill="white"
                      />
                      <path
                        d="M28.7669 21.2939C28.5022 20.955 28.1037 20.7605 27.6736 20.7605H12.3262C11.8961 20.7605 11.4976 20.955 11.2329 21.2939C10.9682 21.633 10.8762 22.0667 10.9805 22.4839L11.3385 23.9158C11.4932 24.5343 12.0465 24.9664 12.6841 24.9664H27.3157C27.9533 24.9664 28.5065 24.5343 28.6613 23.9157L29.0193 22.4839C29.1236 22.0666 29.0315 21.6329 28.7669 21.2939ZM27.717 22.1585L27.359 23.5902C27.354 23.6103 27.3362 23.6241 27.3157 23.6241H12.6841C12.6636 23.6241 12.6456 23.6101 12.6407 23.5903L12.2827 22.1585C12.2811 22.1521 12.2774 22.1373 12.2908 22.1201C12.3043 22.1029 12.3196 22.1029 12.3261 22.1029H27.6736C27.6801 22.1029 27.6954 22.1029 27.7088 22.1201C27.7223 22.1373 27.7187 22.1521 27.717 22.1585Z"
                        fill="white"
                      />
                      <path
                        d="M37.8971 17.0917C39.0566 17.0917 40 16.1484 40 14.9888C40 13.8293 39.0566 12.886 37.8971 12.886H37.1813C36.1357 12.886 35.2662 13.6531 35.1052 14.654L33.3148 9.73033C32.9113 8.62041 31.8467 7.87478 30.6658 7.87478H25.5613L25.1835 5.98596C24.9877 5.00635 24.1204 4.29541 23.1215 4.29541H16.8784C15.8795 4.29541 15.0123 5.00635 14.8163 5.98596L14.4386 7.87478H9.33414C8.1532 7.87478 7.08859 8.62049 6.68508 9.73025L4.89477 14.6539C4.73391 13.6531 3.86438 12.886 2.81883 12.886H2.10297C0.943359 12.886 0 13.8293 0 14.9888C0 16.1484 0.943359 17.0917 2.10289 17.0917H2.81875C3.1493 17.0917 3.46211 17.0149 3.7407 16.8784L2.20633 18.7964C1.7068 19.4208 1.43172 20.2049 1.43172 21.0045V34.3177C1.43172 35.0825 2.05391 35.7047 2.81875 35.7047H4.96641C5.73125 35.7047 6.35344 35.0825 6.35344 34.3177V31.4094H33.6465V34.3177C33.6465 35.0825 34.2687 35.7047 35.0335 35.7047H37.1812C37.946 35.7047 38.5682 35.0825 38.5682 34.3177V21.0045C38.5682 20.2049 38.2931 19.4207 37.7936 18.7964L36.2592 16.8784C36.5378 17.0149 36.8506 17.0917 37.1812 17.0917H37.8971ZM2.81883 15.7495H2.10297C1.68352 15.7495 1.34234 15.4083 1.34234 14.9888C1.34234 14.5694 1.68352 14.2282 2.10297 14.2282H2.81883C3.23828 14.2282 3.57945 14.5694 3.57945 14.9888C3.57945 15.4082 3.2382 15.7495 2.81883 15.7495ZM16.1326 6.24908C16.2034 5.89479 16.5171 5.6376 16.8784 5.6376H23.1215C23.4828 5.6376 23.7965 5.89479 23.8673 6.24908L24.1924 7.87478H15.8074L16.1326 6.24908ZM5.01117 34.3177C5.01117 34.3424 4.99109 34.3624 4.96641 34.3624H2.81875C2.79406 34.3624 2.77398 34.3424 2.77398 34.3177V30.9905C3.20367 31.2558 3.70945 31.4094 4.25047 31.4094H5.01109V34.3177H5.01117ZM27.9195 30.0671H12.0805V28.5906C12.0805 28.566 12.1006 28.5459 12.1253 28.5459H27.8748C27.8995 28.5459 27.9195 28.566 27.9195 28.5906V30.0671H27.9195ZM37.2259 34.3177C37.2259 34.3424 37.2059 34.3624 37.1812 34.3624H35.0335C35.0088 34.3624 34.9888 34.3424 34.9888 34.3177V31.4094H35.7494C36.2904 31.4094 36.7962 31.2558 37.2259 30.9905V34.3177H37.2259ZM36.7456 19.6349C37.0553 20.0222 37.226 20.5086 37.226 21.0046V28.5906C37.226 29.4048 36.5637 30.0671 35.7495 30.0671H29.2617V28.5906C29.2617 27.8258 28.6395 27.2036 27.8747 27.2036H12.1253C11.3605 27.2036 10.7383 27.8258 10.7383 28.5906V30.0671H4.25055C3.43641 30.0671 2.77406 29.4048 2.77406 28.5906V21.0046C2.77406 20.5086 2.94469 20.0222 3.25453 19.6349L5.28898 17.0917H24.2953C24.6659 17.0917 24.9665 16.7913 24.9665 16.4206C24.9665 16.0499 24.666 15.7494 24.2953 15.7494H5.92469L7.94672 10.1888C8.15805 9.60752 8.7157 9.21697 9.3343 9.21697H30.6659C31.2845 9.21697 31.842 9.6076 32.0534 10.1888L34.0755 15.7494H31.4543C31.0837 15.7494 30.7831 16.0499 30.7831 16.4206C30.7831 16.7912 31.0836 17.0917 31.4543 17.0917H34.7112L36.7456 19.6349ZM36.4205 14.9888C36.4205 14.5694 36.7617 14.2282 37.1812 14.2282H37.897C38.3165 14.2282 38.6577 14.5694 38.6577 14.9888C38.6577 15.4083 38.3165 15.7495 37.897 15.7495H37.1812C36.7618 15.7495 36.4205 15.4082 36.4205 14.9888Z"
                        fill="white"
                      />
                      <path
                        d="M7.11457 25.7717C6.34973 25.7717 5.72754 26.3939 5.72754 27.1588C5.72754 27.9236 6.34973 28.5458 7.11457 28.5458C7.87941 28.5458 8.5016 27.9236 8.5016 27.1588C8.5016 26.3939 7.87941 25.7717 7.11457 25.7717Z"
                        fill="white"
                      />
                      <path
                        d="M32.8861 25.7717C32.1212 25.7717 31.499 26.3939 31.499 27.1588C31.499 27.9236 32.1212 28.5458 32.8861 28.5458C33.6509 28.5458 34.2731 27.9236 34.2731 27.1588C34.2731 26.3939 33.6508 25.7717 32.8861 25.7717Z"
                        fill="white"
                      />
                      <path
                        d="M6.75578 20.0447C5.39883 20.0447 4.29492 21.1486 4.29492 22.5055C4.29492 23.8625 5.39883 24.9664 6.75578 24.9664C8.11273 24.9664 9.21664 23.8625 9.21664 22.5055C9.21664 21.1486 8.11273 20.0447 6.75578 20.0447ZM6.75578 23.6241C6.13898 23.6241 5.63719 23.1223 5.63719 22.5055C5.63719 21.8886 6.13891 21.3869 6.75578 21.3869C7.37265 21.3869 7.87437 21.8886 7.87437 22.5055C7.87437 23.1223 7.37258 23.6241 6.75578 23.6241Z"
                        fill="white"
                      />
                      <path
                        d="M33.2441 20.0447C31.8871 20.0447 30.7832 21.1486 30.7832 22.5055C30.7832 23.8625 31.8871 24.9664 33.2441 24.9664C34.601 24.9664 35.7049 23.8625 35.7049 22.5055C35.7049 21.1486 34.601 20.0447 33.2441 20.0447ZM33.2441 23.6241C32.6273 23.6241 32.1255 23.1223 32.1255 22.5055C32.1255 21.8886 32.6272 21.3869 33.2441 21.3869C33.8609 21.3869 34.3627 21.8886 34.3627 22.5055C34.3627 23.1223 33.8609 23.6241 33.2441 23.6241Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {this.state.placesres.length > 0 && (
                <ul className="am_places_res_list">
                  <li>
                    <div style={{ width: "45px" }}>
                      {" "}
                      <svg
                        width={30}
                        height={30}
                        viewBox="0 0 30 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ width: "25px" }}
                      >
                        <rect width={30} height={30} rx={6} fill="#00B9B9" />
                        <circle
                          cx="15.5"
                          cy="15.5"
                          r="11.5"
                          fill="white"
                          fillOpacity="0.45"
                        />
                        <circle
                          cx="15.5"
                          cy="15.5"
                          r="5.75"
                          fill="white"
                          fillOpacity="0.73"
                        />
                      </svg>
                    </div>{" "}
                    <div>Aktueller Standort</div>
                  </li>

                  {this.state.placesres.map(bike => (
                    <li
                      onClick={e =>
                        this._clickedPlaceResult(
                          bike.position[0],
                          bike.position[1],
                          bike.title
                        )
                      }
                    >
                      <div style={{ width: "45px" }}>
                        {" "}
                        <svg
                          width={30}
                          height={30}
                          viewBox="0 0 30 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ width: "25px" }}
                        >
                          <rect width={30} height={30} rx={6} fill="#919DB0" />
                          <path
                            d="M15 6C13.1435 6 11.363 6.7375 10.0503 8.05025C8.7375 9.36301 8 11.1435 8 13C8 16.8646 15 24.6667 15 24.6667C15 24.6667 22 16.8646 22 13C22 11.1435 21.2625 9.36301 19.9497 8.05025C18.637 6.7375 16.8565 6 15 6ZM15 15.3333C14.5385 15.3333 14.0874 15.1965 13.7037 14.9401C13.32 14.6837 13.0209 14.3193 12.8443 13.8929C12.6677 13.4666 12.6215 12.9974 12.7115 12.5448C12.8015 12.0922 13.0238 11.6764 13.3501 11.3501C13.6764 11.0238 14.0922 10.8015 14.5448 10.7115C14.9974 10.6215 15.4666 10.6677 15.8929 10.8443C16.3193 11.0209 16.6837 11.32 16.9401 11.7037C17.1965 12.0874 17.3333 12.5385 17.3333 13C17.3333 13.6188 17.0875 14.2123 16.6499 14.6499C16.2123 15.0875 15.6188 15.3333 15 15.3333Z"
                            fill="white"
                          />
                        </svg>
                      </div>{" "}
                      <div> {bike.title}</div>
                    </li>
                  ))}
                </ul>
              )}

              {this.state.trips.length > 0 && (
                <ul className="am_places_res_list">
                  {this.state.trips.map(trip => (
                    <div
                      style={{
                        width: "100%",
                        height: "128px",
                        background: "#FFFFFF",
                        borderRadius: "5px"
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", paddingBottom: "8px" }}>
                          <div
                            style={{
                              fontFamily: "Roboto",
                              fontStyle: "normal",
                              fontWeight: 500,
                              fontSize: "12px",
                              display: "flex"
                            }}
                          >
                            {trip.Details.Duration} Min
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            height: "30px",
                            width: "calc(268px - 3%)",
                            overflowY: "scroll"
                          }}
                        >
                          {trip.Legs.map((leg, i) => (
                            <div style={{ display: "flex" }}>
                              {leg.Type == "Walk" && (
                                <div style={{ display: "flex" }}>
                                  <svg
                                    width={16}
                                    height={25}
                                    viewBox="0 0 16 25"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M9.51468 0C8.13578 0 7.01468 1.12109 7.01468 2.5C7.01468 3.87891 8.13578 5 9.51468 5C10.8936 5 12.0147 3.87891 12.0147 2.5C12.0147 1.12109 10.8936 0 9.51468 0ZM7.07718 5.9375C6.99124 5.94922 6.90921 5.96875 6.82718 6C6.74124 6.01953 6.65531 6.05078 6.57718 6.09375L2.57718 8.09375C2.41312 8.16797 2.2725 8.28906 2.17093 8.4375L0.170932 11.4375C-0.141568 11.9023 -0.012662 12.5312 0.452182 12.8438C0.917026 13.1562 1.54593 13.0273 1.85843 12.5625L3.70218 9.78125L5.98343 8.625C5.94828 8.81641 5.92093 9 5.92093 9C5.62015 10.5 5.2139 12.3984 5.01468 13C4.7139 14.3984 5.70218 15.1875 5.70218 15.1875L9.17093 18.6562L11.0772 23.375C11.2842 23.8945 11.8702 24.1445 12.3897 23.9375C12.9092 23.7305 13.1592 23.1445 12.9522 22.625L10.9522 17.625C10.9209 17.5469 10.878 17.4727 10.8272 17.4062L10.0772 16.4062L8.51468 13.9062L9.23343 10.4062L9.76468 11.8438C9.85843 12.0938 10.0498 12.2969 10.2959 12.4062L13.6084 13.9062C13.9405 14.1055 14.3545 14.0938 14.6748 13.8828C14.9952 13.668 15.167 13.2891 15.1123 12.9062C15.0577 12.5273 14.7881 12.207 14.4209 12.0938L11.4834 10.75L9.95218 6.65625C9.80765 6.26172 9.43265 6 9.01468 6H7.45218C7.33109 5.95703 7.20609 5.93359 7.07718 5.9375ZM4.70218 15.4062L4.04593 18.5938L1.20218 22.4062C0.874057 22.8555 0.971713 23.4844 1.42093 23.8125C1.87015 24.1406 2.49906 24.043 2.82718 23.5938L5.67093 19.7812C5.7139 19.75 5.72953 19.6953 5.76468 19.6562L5.82718 19.5938C5.85062 19.5742 5.87015 19.5547 5.88968 19.5312C5.89359 19.5234 5.88578 19.5078 5.88968 19.5C5.9014 19.4805 5.91312 19.457 5.92093 19.4375C5.9639 19.3594 5.99515 19.2734 6.01468 19.1875L6.70218 17.5L5.10843 15.9062C5.00687 15.8047 4.80374 15.6055 4.70218 15.4062Z"
                                      fill="#426385"
                                      fillOpacity="0.47"
                                    />
                                  </svg>
                                  <div
                                    className="am_tripres_flow_itm"
                                    style={{
                                      backgroundColor: "#E8ECF0",
                                      color: "#475475"
                                    }}
                                  >
                                    {leg.Details.Duration} Min
                                  </div>
                                </div>
                              )}

                              {leg.Type == "Interchange" && (
                                <div style={{ display: "flex" }}>
                                  <svg
                                    width={51}
                                    height={51}
                                    viewBox="0 0 51 51"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{
                                      width: "24px",
                                      height: "16px",
                                      marginTop: "7px"
                                    }}
                                  >
                                    <path
                                      d="M25.25 0C11.35 0 0 11.35 0 25.25C0 39.15 11.35 50.5 25.25 50.5C39.15 50.5 50.5 39.15 50.5 25.25C50.5 11.35 39.15 0 25.25 0ZM25.25 3C37.5 3 47.5 13 47.5 25.25C47.5 37.5 37.5 47.5 25.25 47.5C13 47.5 3 37.5 3 25.25C3 13 13 3 25.25 3ZM25.25 8.75C24.4 8.75 23.75 9.4 23.75 10.25V22.6504C22.85 23.1504 22.25 24.15 22.25 25.25C22.25 26.9 23.6 28.25 25.25 28.25C26.35 28.25 27.3496 27.65 27.8496 26.75H35.25C36.1 26.75 36.75 26.1 36.75 25.25C36.75 24.4 36.1 23.75 35.25 23.75H27.8496C27.5996 23.3 27.2 22.9004 26.75 22.6504V10.25C26.75 9.4 26.1 8.75 25.25 8.75ZM22.75 36.25C21.9 36.25 21.25 36.9 21.25 37.75C21.25 38.6 21.9 39.25 22.75 39.25H27.75C28.6 39.25 29.25 38.6 29.25 37.75C29.25 36.9 28.6 36.25 27.75 36.25H22.75Z"
                                      fill="#3E4D66"
                                    />
                                  </svg>
                                  <div
                                    className="am_tripres_flow_itm"
                                    style={{
                                      backgroundColor: "#E8ECF0",
                                      color: "#475475"
                                    }}
                                  >
                                    {leg.Details.Duration} Min
                                  </div>
                                </div>
                              )}

                              {leg.Type != "Walk" && (
                                <div
                                  className="am_tripres_flow_itm"
                                  style={{
                                    backgroundColor: leg.Product.DisplayColor
                                  }}
                                >
                                  {leg.Product.Name}
                                </div>
                              )}

                              {i != trip.Legs.length - 1 && (
                                <svg
                                  width={10}
                                  height={9}
                                  viewBox="0 0 10 9"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  style={{
                                    width: "15px",
                                    height: "14px",
                                    marginTop: "auto",
                                    marginBottom: "auto",
                                    marginLeft: "4px",
                                    marginRight: "4px"
                                  }}
                                >
                                  <path
                                    d="M3.46716 1.99456L9.46185 5.46785L3.45655 8.92276L3.46716 1.99456Z"
                                    fill="#012739"
                                  />
                                </svg>
                              )}
                            </div>
                          ))}
                        </div>

                        <div style={{ display: "flex", paddingBottom: "8px" }}>
                          <div
                            style={{
                              fontFamily: "Roboto",
                              fontStyle: "normal",
                              fontWeight: 500,
                              fontSize: "12px",
                              display: "flex"
                            }}
                          >
                            <div>{trip.Legs[0].Onboard.Departuretime}</div> -{" "}
                            <div>
                              {
                                trip.Legs[trip.Legs.length - 1].Deboard
                                  .ArrivalTime
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          paddingTop: "8px"
                        }}
                      >
                        <div style={{ display: "flex" }}>
                          <div
                            style={{
                              width: "92%",
                              fontSize: "12px",
                              textAlign: "left"
                            }}
                          >
                            <div>{trip.Legs[0].Onboard.Stopname}</div>
                            <div>{trip.Details.Interchanges} Umstiege</div>

                            <div>
                              {trip.Legs[trip.Legs.length - 1].Deboard.Stopname}
                            </div>
                          </div>
                          <svg
                            style={{
                              display: "block",
                              marginTop: "auto",
                              marginBottom: "auto"
                            }}
                            width={7}
                            height={19}
                            viewBox="0 0 7 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M1 1L6 9.94737L1 18" stroke="#E8E8E8" />
                          </svg>
                        </div>

                        <div
                          style={{
                            textAlign: "right",
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#505050",
                            paddingBottom: "6px"
                          }}
                        >
                          {trip.Details.Fare} â¬
                        </div>
                        <div className="am_tripres_itm" />
                      </div>
                    </div>
                  ))}
                </ul>
              )}
            </div>

            <div className="circle_box" style={{ width: "100%" }}>
              <div className="tap_bx" />

              <div className="am_mid_wp" style={{ width: "100%" }}>
                <div
                  className="pp_wrapper"
                  style={{
                    width: "100%",
                    marginLeft: this.state.mscreen.mleft,
                    opacity: this.state.mscreen.opacity
                  }}
                >
                  <div className="am_hero_txt">
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#263059",
                        fontSize: "18px",
                        paddingBottom: "2px"
                      }}
                    >
                      Wohin geht es heute ?
                    </div>
                  </div>
                  <div
                    className="pp_search"
                    style={{ display: "flex" }}
                    onClick={this.displayTripOverlay}
                  >
                    <svg
                      width={12}
                      height={40}
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx={16}
                        cy={16}
                        r={14}
                        stroke="#929DB0"
                        strokeWidth={4}
                      />
                      <path
                        d="M26 26L38 38.5"
                        stroke="#929DB0"
                        strokeWidth={4}
                      />
                    </svg>
                    {/**    <input
                    type="text"
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none"
                    }}
                  /> */}
                  </div>

                  <div
                    className="am_closest_bounding"
                    style={{ display: "none" }}
                  >
                    <div className="am_closest_bounding_heading">
                      <svg
                        width={15}
                        height={19}
                        viewBox="0 0 15 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.3161 0.578696L0.84484 12.2705C0.183487 12.8905 0.622243 14 1.52878 14H7.63008C7.86879 14 8.09962 14.0854 8.28087 14.2407L13.3492 18.585C13.9979 19.141 15 18.6801 15 17.8258V1.30823C15 0.432792 13.9547 -0.0200539 13.3161 0.578696Z"
                          fill="#A0C3DA"
                        />
                      </svg>

                      <div className="am_closest_bounding_heading_txt">
                        {" "}
                        In der Umgebung{" "}
                      </div>
                    </div>

                    <div className="am_closest_item">
                      <svg
                        width="22"
                        height="40"
                        viewBox="0 0 46 46"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="38.695"
                          cy="39.985"
                          r="5.159"
                          fill="#3D6F8F"
                        />
                        <path
                          d="M6.4502 7.73901V31.5183C6.4502 32.4574 6.88997 33.3423 7.63851 33.9095L13.1511 38.0861C13.6725 38.4811 14.3087 38.6949 14.9628 38.6949H30.9347C32.4277 38.6949 33.6693 37.536 34.5122 36.3037C35.2526 35.2215 36.5281 34.1805 38.6959 34.1805C43.8553 34.1805 44.5002 38.6949 44.5002 38.6949"
                          stroke="#2D8B9F"
                          strokeWidth="1.7"
                        />
                        <path
                          d="M5.15967 6.44897H7.73933V41.2744H5.15967V6.44897Z"
                          fill="#2D8B9F"
                        />
                        <circle
                          cx="6.45"
                          cy="39.985"
                          r="5.159"
                          fill="#3D6F8F"
                        />
                        <circle cx="6.449" cy="39.985" r="2.58" fill="#fff" />
                        <circle cx="38.695" cy="39.985" r="2.58" fill="#fff" />
                        <path
                          d="M2.57861 2.57983L6.4481 5.15949V9.6739"
                          stroke="#2D8B9F"
                          strokeWidth="2"
                        />
                        <circle
                          cx="1.935"
                          cy="1.935"
                          r="1.935"
                          fill="#156678"
                        />
                        <rect
                          x="15.478"
                          y="37.405"
                          width="15.478"
                          height="0.516"
                          fill="#176B7D"
                        />
                        <path
                          d="M3.9863 18.1748L5.76596 19.9544C6.01794 20.2064 6.4488 20.028 6.4488 19.6716V9.42881C6.4488 9.20789 6.26971 9.02881 6.0488 9.02881H4.26914C4.04823 9.02881 3.86914 9.20789 3.86914 9.42881V17.8919C3.86914 17.998 3.91128 18.0998 3.9863 18.1748Z"
                          fill="#226C7C"
                        />
                      </svg>
                      <div style={{ width: "100%" }}> Elektroroller</div>
                      <div style={{ paddingRight: "48px" }}>500m </div>
                      <div>
                        <svg
                          width="12"
                          height="40"
                          viewBox="0 0 12 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M1 1L11 11L1 23" stroke="#DCE1EC" />
                        </svg>
                      </div>
                    </div>

                    <div className="am_closest_item">
                      <svg
                        width="22"
                        height="40"
                        viewBox="0 0 46 46"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="38.695"
                          cy="39.985"
                          r="5.159"
                          fill="#3D6F8F"
                        />
                        <path
                          d="M6.4502 7.73901V31.5183C6.4502 32.4574 6.88997 33.3423 7.63851 33.9095L13.1511 38.0861C13.6725 38.4811 14.3087 38.6949 14.9628 38.6949H30.9347C32.4277 38.6949 33.6693 37.536 34.5122 36.3037C35.2526 35.2215 36.5281 34.1805 38.6959 34.1805C43.8553 34.1805 44.5002 38.6949 44.5002 38.6949"
                          stroke="#2D8B9F"
                          strokeWidth="1.7"
                        />
                        <path
                          d="M5.15967 6.44897H7.73933V41.2744H5.15967V6.44897Z"
                          fill="#2D8B9F"
                        />
                        <circle
                          cx="6.45"
                          cy="39.985"
                          r="5.159"
                          fill="#3D6F8F"
                        />
                        <circle cx="6.449" cy="39.985" r="2.58" fill="#fff" />
                        <circle cx="38.695" cy="39.985" r="2.58" fill="#fff" />
                        <path
                          d="M2.57861 2.57983L6.4481 5.15949V9.6739"
                          stroke="#2D8B9F"
                          strokeWidth="2"
                        />
                        <circle
                          cx="1.935"
                          cy="1.935"
                          r="1.935"
                          fill="#156678"
                        />
                        <rect
                          x="15.478"
                          y="37.405"
                          width="15.478"
                          height="0.516"
                          fill="#176B7D"
                        />
                        <path
                          d="M3.9863 18.1748L5.76596 19.9544C6.01794 20.2064 6.4488 20.028 6.4488 19.6716V9.42881C6.4488 9.20789 6.26971 9.02881 6.0488 9.02881H4.26914C4.04823 9.02881 3.86914 9.20789 3.86914 9.42881V17.8919C3.86914 17.998 3.91128 18.0998 3.9863 18.1748Z"
                          fill="#226C7C"
                        />
                      </svg>
                      <div style={{ width: "100%" }}> Elektroroller</div>
                      <div style={{ paddingRight: "48px" }}>500m </div>
                      <div>
                        <svg
                          width="12"
                          height="40"
                          viewBox="0 0 12 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M1 1L11 11L1 23" stroke="#DCE1EC" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      paddingBottom: "12px",
                      borderBottom: "1px solid #efefef"
                    }}
                  >
                    <ul
                      style={{
                        paddingInlineEnd: "0px",
                        paddingInlineStart: "0px",
                        marginBlockEnd: "0px"
                      }}
                    >
                      <li>
                        <div
                          style={{
                            background: this.props.brandColor,
                            width: "45px",
                            height: "38px",
                            borderRadius: "5px",
                            lineHeight: "38px"
                          }}
                        >
                          <svg
                            width={16}
                            height={18}
                            viewBox="0 0 16 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ width: "19px", height: "38px" }}
                          >
                            <path
                              d="M1 14.8983V7.86895C1 7.27539 1.26365 6.7125 1.71963 6.33251L6.81636 2.08524C7.56775 1.45908 8.66179 1.46823 9.4026 2.10686L14.3059 6.33382C14.7466 6.71375 15 7.26677 15 7.84864V14.8983C15 16.0029 14.1046 16.8983 13 16.8983H3C1.89543 16.8983 1 16.0029 1 14.8983Z"
                              stroke="white"
                              strokeWidth="1.5"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.83008 10.9663C5.06042 12.5761 6.44492 13.8136 8.11845 13.8136C9.79197 13.8136 11.1765 12.5761 11.4068 10.9663H10.3919C10.1728 12.021 9.23818 12.8136 8.11845 12.8136C6.99872 12.8136 6.0641 12.021 5.84498 10.9663H4.83008Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            paddingLeft: "12px"
                          }}
                        >
                          <span style={{ fontWeight: 600, textAlign: "left" }}>
                            {" "}
                            Zuhause{" "}
                          </span>
                          <span style={{ color: "#85878e" }}>
                            {" "}
                            Rheinauhafen, KÃ¶ln{" "}
                          </span>
                        </div>
                      </li>
                      <li>
                        <div
                          style={{
                            background: this.props.brandColor,
                            width: "45px",
                            height: "38px",
                            borderRadius: "5px",
                            lineHeight: "38px"
                          }}
                        >
                          <svg
                            width={17}
                            height={21}
                            viewBox="0 0 17 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ marginTop: "8px" }}
                          >
                            <path
                              d="M1 18V9.42045V3C1 1.89543 1.89543 1 3 1H14C15.1046 1 16 1.89543 16 3V9.42045V18C16 19.1046 15.1046 20 14 20H3C1.89543 20 1 19.1046 1 18Z"
                              stroke="white"
                              strokeWidth="1.5"
                            />
                            <path
                              d="M4 6.5V5.32955V4.5C4 4.22386 4.22386 4 4.5 4H6.5C6.77614 4 7 4.22386 7 4.5V5.32955V6.5C7 6.77614 6.77614 7 6.5 7H4.5C4.22386 7 4 6.77614 4 6.5Z"
                              stroke="white"
                            />
                            <path
                              d="M10 6.5V5.32955V4.5C10 4.22386 10.2239 4 10.5 4H12.5C12.7761 4 13 4.22386 13 4.5V5.32955V6.5C13 6.77614 12.7761 7 12.5 7H10.5C10.2239 7 10 6.77614 10 6.5Z"
                              stroke="white"
                            />
                            <path
                              d="M4 11.5V10.3295V9.5C4 9.22386 4.22386 9 4.5 9H6.5C6.77614 9 7 9.22386 7 9.5V10.3295V11.5C7 11.7761 6.77614 12 6.5 12H4.5C4.22386 12 4 11.7761 4 11.5Z"
                              stroke="white"
                            />
                            <path
                              d="M10 11.5V10.3295V9.5C10 9.22386 10.2239 9 10.5 9H12.5C12.7761 9 13 9.22386 13 9.5V10.3295V11.5C13 11.7761 12.7761 12 12.5 12H10.5C10.2239 12 10 11.7761 10 11.5Z"
                              stroke="white"
                            />
                            <path
                              d="M4 16.5V15.3295V14.5C4 14.2239 4.22386 14 4.5 14H6.5C6.77614 14 7 14.2239 7 14.5V15.3295V16.5C7 16.7761 6.77614 17 6.5 17H4.5C4.22386 17 4 16.7761 4 16.5Z"
                              stroke="white"
                            />
                            <path
                              d="M10 16.5V15.3295V14.5C10 14.2239 10.2239 14 10.5 14H12.5C12.7761 14 13 14.2239 13 14.5V15.3295V16.5C13 16.7761 12.7761 17 12.5 17H10.5C10.2239 17 10 16.7761 10 16.5Z"
                              stroke="white"
                            />
                          </svg>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            paddingLeft: "12px"
                          }}
                        >
                          <span style={{ fontWeight: 600, textAlign: "left" }}>
                            {" "}
                            Acme Headquarter{" "}
                          </span>
                          <span style={{ color: "#85878e" }}>
                            Regierungviertel, Bonn
                          </span>
                        </div>
                      </li>

                      <li>
                        <div
                          style={{
                            background: this.props.brandColor,
                            width: "45px",
                            height: "38px",
                            borderRadius: "5px",
                            lineHeight: "38px"
                          }}
                        >
                          <svg
                            width={17}
                            height={21}
                            viewBox="0 0 17 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ marginTop: "8px" }}
                          >
                            <path
                              d="M1 18V9.42045V3C1 1.89543 1.89543 1 3 1H14C15.1046 1 16 1.89543 16 3V9.42045V18C16 19.1046 15.1046 20 14 20H3C1.89543 20 1 19.1046 1 18Z"
                              stroke="white"
                              strokeWidth="1.5"
                            />
                            <path
                              d="M4 6.5V5.32955V4.5C4 4.22386 4.22386 4 4.5 4H6.5C6.77614 4 7 4.22386 7 4.5V5.32955V6.5C7 6.77614 6.77614 7 6.5 7H4.5C4.22386 7 4 6.77614 4 6.5Z"
                              stroke="white"
                            />
                            <path
                              d="M10 6.5V5.32955V4.5C10 4.22386 10.2239 4 10.5 4H12.5C12.7761 4 13 4.22386 13 4.5V5.32955V6.5C13 6.77614 12.7761 7 12.5 7H10.5C10.2239 7 10 6.77614 10 6.5Z"
                              stroke="white"
                            />
                            <path
                              d="M4 11.5V10.3295V9.5C4 9.22386 4.22386 9 4.5 9H6.5C6.77614 9 7 9.22386 7 9.5V10.3295V11.5C7 11.7761 6.77614 12 6.5 12H4.5C4.22386 12 4 11.7761 4 11.5Z"
                              stroke="white"
                            />
                            <path
                              d="M10 11.5V10.3295V9.5C10 9.22386 10.2239 9 10.5 9H12.5C12.7761 9 13 9.22386 13 9.5V10.3295V11.5C13 11.7761 12.7761 12 12.5 12H10.5C10.2239 12 10 11.7761 10 11.5Z"
                              stroke="white"
                            />
                            <path
                              d="M4 16.5V15.3295V14.5C4 14.2239 4.22386 14 4.5 14H6.5C6.77614 14 7 14.2239 7 14.5V15.3295V16.5C7 16.7761 6.77614 17 6.5 17H4.5C4.22386 17 4 16.7761 4 16.5Z"
                              stroke="white"
                            />
                            <path
                              d="M10 16.5V15.3295V14.5C10 14.2239 10.2239 14 10.5 14H12.5C12.7761 14 13 14.2239 13 14.5V15.3295V16.5C13 16.7761 12.7761 17 12.5 17H10.5C10.2239 17 10 16.7761 10 16.5Z"
                              stroke="white"
                            />
                          </svg>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            paddingLeft: "12px"
                          }}
                        >
                          <span style={{ fontWeight: 600, textAlign: "left" }}>
                            {" "}
                            Acme Campus Bonn{" "}
                          </span>
                          <span style={{ color: "#85878e", textAlign: "left" }}>
                            Bonn
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div />

                    <div>
                      <div
                        style={{
                          textAlign: "left",
                          paddingTop: "8px",
                          paddingBottom: "8px"
                        }}
                      >
                        <span
                          style={{
                            textAlign: "left",
                            width: "100%",
                            marginTop: "8px",
                            color: "#556671",
                            fontWeight: 500,
                            fontFamily: "sans-serif",
                            fontSize: "15px"
                          }}
                        >
                          In deiner Umgebung
                        </span>
                      </div>
                      <div style={{ display: "flex" }}>
                        <svg
                          width={50}
                          height={38}
                          viewBox="0 0 50 38"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ width: "30px" }}
                        >
                          <path
                            d="M35.1562 0C32.0859 0 29.6875 1.53906 29.6875 3.53125C29.6875 5.52344 32.0859 7.09375 35.1562 7.09375C36.3984 7.09375 37.2578 6.83984 37.8125 6.28125C38.5352 5.55859 38.5039 4.60547 38.5 3.75V3.34375C38.5039 2.49219 38.5352 1.53516 37.8125 0.8125C37.2578 0.253906 36.3984 0 35.1562 0ZM27.7188 3.875C25.8047 4.70703 25.625 4.78125 25.5625 4.8125C24.3281 5.40625 24.0547 6.40234 24.2188 7.125C24.4805 8.27344 25.8633 9 27.2188 8.6875C28.0117 8.50391 28.8906 7.95703 29.5625 7.4375C30.8516 11.2812 32.0977 17.6758 29.7188 21.1875C28.5703 22.8867 26.7031 23.7188 24 23.7188H22.5625C21.0938 23.7188 20.1133 23.625 19.6875 23.0625C19.3203 22.5742 19.0664 21.332 19.875 18.3438C17.9805 19.3086 14.7461 19.7188 9.90625 19.7188C5.78125 19.7188 2.86328 19.3984 0.9375 18.6875C0.4375 20.0352 6.51341e-08 21.7773 6.51341e-08 23.7188C6.51341e-08 30.5234 20.7891 30.7188 23.1562 30.7188C25.3125 30.7188 27.2812 30.582 29.125 30.3438C29.0391 29.8516 29 29.3125 29 28.7188C29 22.6758 34.1094 17.75 40.4062 17.75C40.4609 17.75 40.5391 17.7812 40.5938 17.7812C40.3594 17.418 40.082 17.0078 39.7812 16.5625C38.5391 14.7188 36.832 12.1562 35.5 9.0625C35.3867 9.06641 35.2734 9.09375 35.1562 9.09375C32.0156 9.09375 29.4492 7.79297 28.3125 5.84375L28.2812 5.8125C27.9453 5.22266 27.7695 4.5625 27.7188 3.875ZM2.78125 11.7188C1.21484 11.7188 6.51341e-08 13.5312 6.51341e-08 15.0938C6.51341e-08 15.7461 -0.0117188 17.7188 9.90625 17.7188C20 17.7188 20 15.7461 20 15.0938C20 13.5312 18.7852 11.7188 17.2188 11.7188H2.78125ZM40.4062 19.75C35.2148 19.75 31 23.7812 31 28.7188C31 32.0234 32.6328 32.7188 34 32.7188C34.5117 32.7188 34.9023 32.5938 35.2188 32.4062C35.9766 35.4531 38.7227 37.7188 42 37.7188C45.8594 37.7188 49 34.5781 49 30.7188C49 29.6406 48.75 28.5781 48.2812 27.625C49.0938 27.4648 50 26.9805 50 25.4375C50 23.0547 46.6602 19.75 40.4062 19.75ZM44.625 27.7188C45.4688 28.4492 46 29.5156 46 30.7188C46 32.9258 44.207 34.7188 42 34.7188C39.793 34.7188 38 32.9258 38 30.7188C38 30.4062 38.0234 30.1016 38.0938 29.8125C38.6641 29.457 39.4102 29.0859 40.375 28.6875C42.0625 27.9922 43.4531 27.7812 44.625 27.7188ZM42 28.7188C40.8945 28.7188 40 29.6133 40 30.7188C40 31.8242 40.8945 32.7188 42 32.7188C43.1055 32.7188 44 31.8242 44 30.7188C44 29.6133 43.1055 28.7188 42 28.7188ZM3.0625 29.75C3.01953 30.0664 3 30.3984 3 30.7188C3 34.5781 6.14062 37.7188 10 37.7188C13.2422 37.7188 15.957 35.4961 16.75 32.5C15.7539 32.4336 14.7266 32.3633 13.6875 32.25C13.0859 33.7031 11.668 34.7188 10 34.7188C7.82812 34.7188 6.05078 32.9727 6 30.8125C4.95312 30.5117 3.96484 30.1523 3.0625 29.75ZM8.125 31.3438C8.39062 32.1406 9.11719 32.7188 10 32.7188C10.6289 32.7188 11.1953 32.4219 11.5625 31.9688C10.3984 31.8008 9.24609 31.5898 8.125 31.3438Z"
                            fill="black"
                            style={{ fill: this.props.brandColor }}
                          />
                        </svg>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            paddingLeft: "12px",
                            width: "100%",
                            paddingRight: "12px"
                          }}
                        >
                          <span style={{ fontWeight: 600, lineHeight: "30px" }}>
                            Coup{" "}
                          </span>
                          <span
                            style={{
                              color: "#97afbb",
                              marginLeft: "auto",
                              lineHeight: "30px"
                            }}
                          >
                            {" "}
                            2 Min{" "}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex" }}>
                        <svg
                          width={24}
                          height={18}
                          viewBox="0 0 24 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ width: "30px" }}
                        >
                          <path
                            d="M15 0C14.7348 2.65169e-05 14.4805 0.105392 14.2929 0.292922C14.1054 0.480453 14 0.734792 14 1V1.18555C14 1.29448 14.0178 1.40267 14.0527 1.50586L14.9785 4.23828L9.95508 12H9.89258C9.56022 10.4161 8.45415 9.12776 6.99609 8.49219L8.55273 6H11V4H5V6H6.19727L4.94531 8.00195C2.22496 8.032 0 10.273 0 13C0 15.7455 2.25455 18 5 18C7.40359 18 9.43082 16.2726 9.89844 14H10.5C10.667 14 10.8314 13.9582 10.9781 13.8784C11.1248 13.7985 11.2492 13.6832 11.3398 13.543L15.7969 6.65625L16.5059 8.75C15.0206 9.60474 14 11.171 14 13C14 15.7455 16.2545 18 19 18C21.7455 18 24 15.7455 24 13C24 10.381 21.9297 8.26682 19.3574 8.07227C19.2437 8.02648 19.1226 8.00198 19 8C18.9667 8.00029 18.9335 8.00225 18.9004 8.00586C18.8669 8.01004 18.8337 8.0159 18.8008 8.02344C18.7461 8.03521 18.6926 8.05154 18.6406 8.07227C18.5589 8.07848 18.483 8.10324 18.4023 8.11328L16.332 2H21V0H15ZM5 10C6.30204 10 7.40226 10.8386 7.81641 12H5V14H7.81641C7.40226 15.1614 6.30204 16 5 16C3.34545 16 2 14.6545 2 13C2 11.3455 3.34545 10 5 10ZM19.041 10.0039C20.6762 10.0265 22 11.3595 22 13C22 14.6545 20.6545 16 19 16C17.3455 16 16 14.6545 16 13C16 12.0466 16.4552 11.2061 17.1504 10.6562L18.0527 13.3203L19.9473 12.6797L19.041 10.0039Z"
                            fill="black"
                            style={{ fill: this.props.brandColor }}
                          />
                        </svg>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            paddingLeft: "12px",
                            width: "100%",
                            paddingRight: "12px"
                          }}
                        >
                          <span style={{ fontWeight: 600, lineHeight: "30px" }}>
                            Mobike{" "}
                          </span>
                          <span
                            style={{
                              color: "#97afbb",
                              marginLeft: "auto",
                              lineHeight: "30px"
                            }}
                          >
                            {" "}
                            2 Min{" "}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: "34px",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      paddingLeft: "0px",
                      display: "none"
                    }}
                  >
                    <div className="am_circ_bx" onClick={this.changetoMetro}>
                      <div
                        className="circle_type_dot"
                        style={{ background: "#655F65" }}
                      >
                        <svg
                          width={35}
                          height={45}
                          viewBox="0 0 65 65"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            opacity="0.4"
                            d="M65 52.8125C64.995 56.0433 63.7093 59.1403 61.4248 61.4248C59.1403 63.7093 56.0433 64.995 52.8125 65H17.5449C19.7011 62.4094 21.7061 59.6965 23.5498 56.875H52.8125C53.8899 56.875 54.9233 56.447 55.6851 55.6851C56.447 54.9233 56.875 53.8899 56.875 52.8125C56.875 51.7351 56.447 50.7017 55.6851 49.9399C54.9233 49.178 53.8899 48.75 52.8125 48.75H40.625C37.3927 48.75 34.2927 47.466 32.0071 45.1804C29.7215 42.8948 28.4375 39.7948 28.4375 36.5625C28.4375 33.3302 29.7215 30.2302 32.0071 27.9446C34.2927 25.659 37.3927 24.375 40.625 24.375H46.3684C48.3766 27.1913 50.5275 29.9032 52.8125 32.5H40.625C39.5476 32.5 38.5142 32.928 37.7524 33.6899C36.9905 34.4517 36.5625 35.4851 36.5625 36.5625C36.5625 37.6399 36.9905 38.6733 37.7524 39.4351C38.5142 40.197 39.5476 40.625 40.625 40.625H52.8125C56.0433 40.63 59.1403 41.9157 61.4248 44.2002C63.7093 46.4847 64.995 49.5817 65 52.8125Z"
                            fill="white"
                          />
                          <path
                            d="M12.1875 32.5C8.95517 32.5 5.85524 33.784 3.56964 36.0696C1.28404 38.3552 0 41.4552 0 44.6875C0 51.416 12.1875 65 12.1875 65C12.1875 65 24.375 51.416 24.375 44.6875C24.375 41.4552 23.091 38.3552 20.8054 36.0696C18.5198 33.784 15.4198 32.5 12.1875 32.5ZM12.1875 48.75C11.384 48.75 10.5986 48.5117 9.9305 48.0653C9.26242 47.619 8.74172 46.9845 8.43424 46.2422C8.12676 45.4998 8.04631 44.683 8.20306 43.8949C8.35981 43.1069 8.74673 42.383 9.31488 41.8149C9.88303 41.2467 10.6069 40.8598 11.3949 40.7031C12.183 40.5463 12.9998 40.6268 13.7422 40.9342C14.4845 41.2417 15.119 41.7624 15.5653 42.4305C16.0117 43.0986 16.25 43.884 16.25 44.6875C16.25 45.7649 15.822 46.7983 15.0601 47.5601C14.2983 48.322 13.2649 48.75 12.1875 48.75ZM52.8125 0C49.5802 0 46.4802 1.28404 44.1946 3.56964C41.909 5.85524 40.625 8.95517 40.625 12.1875C40.625 18.916 52.8125 32.5 52.8125 32.5C52.8125 32.5 65 18.916 65 12.1875C65 8.95517 63.716 5.85524 61.4304 3.56964C59.1448 1.28404 56.0448 0 52.8125 0V0ZM52.8125 16.25C52.009 16.25 51.2236 16.0117 50.5555 15.5653C49.8874 15.119 49.3667 14.4845 49.0592 13.7422C48.7518 12.9998 48.6713 12.183 48.8281 11.3949C48.9848 10.6069 49.3717 9.88303 49.9399 9.31488C50.508 8.74673 51.2319 8.35981 52.0199 8.20306C52.808 8.04631 53.6248 8.12676 54.3672 8.43424C55.1095 8.74172 55.744 9.26242 56.1903 9.9305C56.6367 10.5986 56.875 11.384 56.875 12.1875C56.875 13.2649 56.447 14.2983 55.6851 15.0601C54.9233 15.822 53.8899 16.25 52.8125 16.25Z"
                            fill="white"
                          />
                        </svg>

                        <div className="am_circ_bx_txt">Haltestellen</div>
                      </div>
                    </div>

                    <div className="am_circ_bx" onClick={this.changetoMetro}>
                      <div
                        className="circle_type_dot"
                        style={{ background: "#3f78a5" }}
                      >
                        <svg
                          style={{ width: "17px", height: "65px" }}
                          width="37"
                          height="45"
                          viewBox="0 0 67 66"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect width="67" height="66" rx="8" fill="#fff" />
                          <path
                            style={{ fill: "#3f78a5" }}
                            d="M45.2656 17.1406V36.8076C45.2656 40.0752 44.2402 42.6592 42.1895 44.5596C40.1523 46.46 37.3633 47.4102 33.8223 47.4102C30.3359 47.4102 27.5674 46.4873 25.5166 44.6416C23.4658 42.7959 22.4199 40.2598 22.3789 37.0332V17.1406H28.5312V36.8486C28.5312 38.8037 28.9961 40.2324 29.9258 41.1348C30.8691 42.0234 32.168 42.4678 33.8223 42.4678C37.2812 42.4678 39.0381 40.6494 39.0928 37.0127V17.1406H45.2656Z"
                            fill="#2D3F9F"
                          />
                        </svg>
                        <div className="am_circ_bx_txt">U-Bahn</div>
                      </div>
                    </div>

                    {/** <div className="am_circ_bx" onClick={this.changetoBahn}>
                    <div
                      className="circle_type_dot"
                      style={{ background: "#F44336" }}
                    >
                      <img
                        src={bahn_icon_png}
                        style={{ width: "40px", marginTop: "10px" }}
                      />
                    </div>
                    <div className="am_circ_bx_txt">Bahn</div>
                  </div>
                */}
                    <div className="am_circ_bx" onClick={this.changetoBahn}>
                      <div
                        className="circle_type_dot"
                        style={{ background: "#F44336" }}
                      >
                        <svg
                          width={81}
                          height={75}
                          viewBox="0 0 81 75"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ width: "26px", height: "38px" }}
                        >
                          <rect
                            x={10}
                            y={3}
                            width={62}
                            height={60}
                            rx={3}
                            stroke="white"
                            strokeWidth={6}
                          />
                          <rect
                            x={12}
                            y={48}
                            width={58}
                            height={13}
                            fill="white"
                          />
                          <rect
                            x={12}
                            y={10}
                            width={58}
                            height={6}
                            fill="white"
                          />
                          <rect
                            x={38}
                            y={13}
                            width={6}
                            height={36}
                            fill="white"
                          />
                          <rect
                            x={14}
                            y={63}
                            width={10}
                            height={12}
                            rx={2}
                            fill="white"
                          />
                          <rect
                            x={76}
                            y={18}
                            width={5}
                            height={12}
                            rx={2}
                            fill="white"
                          />
                          <rect
                            y={17}
                            width={5}
                            height={12}
                            rx={2}
                            fill="white"
                          />
                          <rect
                            x={59}
                            y={63}
                            width={10}
                            height={12}
                            rx={2}
                            fill="white"
                          />
                        </svg>
                      </div>
                      <div className="am_circ_bx_txt">Bus</div>
                    </div>

                    <div className="am_circ_bx" onClick={this.changetoSBahn}>
                      <div
                        className="circle_type_dot"
                        style={{ background: "#1AAB83" }}
                      >
                        <svg
                          width="20"
                          height="38"
                          viewBox="0 0 51 64"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.3189 14.0928C14.3189 10.6466 17.4987 7.70308 23.0637 7.70308C32.8922 7.70308 41.2753 12.9441 46.84 18.903V8.49282C40.4081 3.53902 32.3138 0.595459 23.2802 0.595459C12.4399 0.595459 0.371094 7.20076 0.371094 19.4773C0.371094 42.8825 36.144 34.4826 36.144 48.0514C36.144 51.6411 31.3746 55.0157 25.4485 55.0157C15.7645 55.0157 6.15282 49.2004 0.877214 41.662V54.1539C6.44189 59.1077 16.6318 63.0564 25.4485 63.0564C41.2753 63.0564 50.6705 51.8563 50.6705 42.2358C50.6707 18.4004 14.3189 28.5947 14.3189 14.0928Z"
                            fill="#fff"
                          />
                        </svg>
                      </div>
                      <div className="am_circ_bx_txt">S-Bahn</div>
                    </div>

                    <div className="am_circ_bx" onClick={this.changetoBikes}>
                      <div
                        className="circle_type_dot"
                        style={{
                          background: " #28E8E8"
                        }}
                      >
                        <svg
                          width={44}
                          height={33}
                          viewBox="0 0 38 23"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M22.0645 6.1984e-05V1.22587L21.6312 1.04391C22.1363 1.55387 22.8283 1.84117 23.5489 1.84117L24.8106 1.83877L25.9885 4.90329H13.8837L12.7441 3.06458H14.0968C14.317 3.06697 14.5229 2.95205 14.6355 2.76052C14.7456 2.56899 14.7456 2.33436 14.6355 2.14283C14.5229 1.9513 14.317 1.83638 14.0968 1.83877H11.7337C11.7098 1.83398 11.6835 1.83159 11.6595 1.83159C11.6212 1.83159 11.5853 1.83398 11.547 1.83877H9.80645C9.58619 1.83638 9.38029 1.9513 9.26777 2.14283C9.15764 2.33436 9.15764 2.56899 9.26777 2.76052C9.38029 2.95205 9.58619 3.06697 9.80645 3.06458H11.3028L12.792 5.46831L10.7162 8.789C9.70829 8.26707 8.56628 7.9678 7.35484 7.9678C3.29914 7.9678 0 11.2669 0 15.3226C0 19.3783 3.29914 22.6775 7.35484 22.6775C11.2022 22.6775 14.3649 19.7039 14.6786 15.9355H19.4573C19.7757 16.0289 20.1109 15.8494 20.2114 15.5333L26.5368 6.3326L27.449 8.70999C24.9926 9.90228 23.2903 12.4137 23.2903 15.3226C23.2903 19.3783 26.5895 22.6775 30.6452 22.6775C34.7009 22.6775 38 19.3783 38 15.3226C38 11.2669 34.7009 7.9678 30.6452 7.9678C29.9317 7.9678 29.2446 8.07554 28.591 8.26468L25.8018 1.00561C25.7108 0.768585 25.4834 0.612965 25.232 0.612965L23.5465 0.615359C23.1563 0.615359 22.7876 0.459739 22.5122 0.186806C22.3949 0.064704 22.2321 -0.00233202 22.0645 6.1984e-05ZM14.6426 6.12909H25.1889L19.6392 14.2022L14.6426 6.12909ZM13.5126 6.62947L18.514 14.7097H14.6786C14.499 12.5574 13.3905 10.6684 11.7529 9.4426L13.5126 6.62947ZM7.35484 9.19361C8.32926 9.19361 9.24861 9.42584 10.065 9.82806L6.83531 14.997C6.71799 15.1862 6.71081 15.4256 6.81855 15.6195C6.92629 15.8134 7.13218 15.9355 7.35484 15.9355H13.4551C13.1463 19.0384 10.5391 21.4517 7.35484 21.4517C3.96232 21.4517 1.22581 18.7152 1.22581 15.3226C1.22581 11.9301 3.96232 9.19361 7.35484 9.19361ZM30.6452 9.19361C34.0377 9.19361 36.7742 11.9301 36.7742 15.3226C36.7742 18.7152 34.0377 21.4517 30.6452 21.4517C27.2526 21.4517 24.5161 18.7152 24.5161 15.3226C24.5161 12.9237 25.888 10.8599 27.8871 9.852L30.073 15.5429C30.1951 15.8589 30.5494 16.0169 30.8654 15.8948C31.1815 15.7727 31.3395 15.4184 31.2174 15.1024L29.0339 9.41387C29.5462 9.27501 30.0849 9.19361 30.6452 9.19361ZM11.1065 10.4769C12.3993 11.48 13.2828 12.9859 13.4551 14.7097H8.45854L11.1065 10.4769Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                      <div className="am_circ_bx_txt">Bikesharing</div>
                    </div>

                    <div className="am_circ_bx" onClick={this.changetoScooter}>
                      <div
                        className="circle_type_dot"
                        style={{ background: "#3AA1AE" }}
                      >
                        <svg
                          width={28}
                          height={60}
                          viewBox="0 0 46 46"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="38.6954"
                            cy="39.9848"
                            r="5.15932"
                            fill="#3D6F8F"
                          />
                          <path
                            d="M6.4502 7.73901V31.5183C6.4502 32.4574 6.88997 33.3423 7.63851 33.9095L13.1511 38.0861C13.6725 38.4811 14.3087 38.6949 14.9628 38.6949H30.9347C32.4277 38.6949 33.6693 37.536 34.5122 36.3037C35.2526 35.2215 36.5281 34.1805 38.6959 34.1805C43.8553 34.1805 44.5002 38.6949 44.5002 38.6949"
                            stroke="white"
                            strokeWidth="1.7"
                          />
                          <path
                            d="M5.15918 6.44897H7.73884V41.2744H5.15918V6.44897Z"
                            fill="white"
                          />
                          <circle
                            cx="6.44936"
                            cy="39.9848"
                            r="5.15932"
                            fill="#3D6F8F"
                          />
                          <circle
                            cx="6.4488"
                            cy="39.9849"
                            r="2.57966"
                            fill="#3AA1AE"
                          />
                          <circle
                            cx="38.6949"
                            cy="39.9849"
                            r="2.57966"
                            fill="#3AA1AE"
                          />
                          <path
                            d="M2.5791 2.57983L6.44859 5.15949V9.6739"
                            stroke="#E0F9FF"
                            strokeWidth={2}
                          />
                          <circle
                            cx="1.93474"
                            cy="1.93474"
                            r="1.93474"
                            fill="#E7EDEE"
                          />
                          <rect
                            x="15.4785"
                            y="37.4053"
                            width="15.478"
                            height="0.515932"
                            fill="#CADCE0"
                          />
                          <path
                            d="M3.9863 18.1748L5.76596 19.9544C6.01794 20.2064 6.4488 20.028 6.4488 19.6716V9.42881C6.4488 9.20789 6.26971 9.02881 6.0488 9.02881H4.26914C4.04823 9.02881 3.86914 9.20789 3.86914 9.42881V17.8919C3.86914 17.998 3.91128 18.0998 3.9863 18.1748Z"
                            fill="#DDE8EB"
                          />
                        </svg>
                      </div>

                      <div className="am_circ_bx_txt">Elektro-roller</div>
                    </div>

                    <div className="am_circ_bx" onClick={this.changetoRoller}>
                      <div
                        className="circle_type_dot"
                        style={{ background: "#9328E8" }}
                      >
                        <svg
                          width={38}
                          height={26}
                          viewBox="0 0 38 26"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M28.8455 0C27.4636 0 26.3234 1.1396 26.3234 2.52141C26.3234 2.6596 26.3239 2.83259 26.3585 2.97077H20.4506C19.8634 2.97077 19.4143 3.41987 19.4143 4.00714C19.4143 4.59441 19.8634 5.0435 20.4506 5.0435H23.8364C23.5255 5.63077 23.3526 6.25246 23.3526 6.97791V18.1708H18.2403L16.4435 12.8162C16.3399 12.4708 16.3745 12.125 16.5818 11.8487C16.7891 11.5378 17.1343 11.3656 17.5143 11.3656C18.1015 11.3656 18.5506 10.9165 18.5506 10.3292V8.46364C18.5506 7.22 17.5494 6.25259 16.3403 6.25259H7.6C6.35636 6.25259 5.38896 7.25455 5.38896 8.46364V10.3292V10.398C2.17623 12.0908 0 15.4071 0 19.2071C0 19.7944 0.449091 20.2435 1.03636 20.2435H1.58896H2.93636C3.14364 21.418 3.6965 22.489 4.4565 23.3526H2.76364C2.17636 23.3526 1.72727 23.8017 1.72727 24.389C1.72727 24.9762 2.17636 25.4253 2.76364 25.4253H32.1273C32.2309 25.4253 32.2997 25.4255 32.3688 25.3909C35.5125 25.08 38 22.4199 38 19.2071C38 17.4108 37.2397 15.8218 35.9961 14.6818C36.2725 14.1982 36.411 13.6109 36.411 12.9545C36.411 12.5745 36.2038 12.2292 35.8929 12.0565C34.6147 11.331 33.1639 10.9506 31.713 10.9506C31.2294 10.9506 30.7453 10.9853 30.2617 11.089L28.7071 5.0435H28.8455C29.4327 5.0435 29.8818 4.59441 29.8818 4.00714V1.03636C29.8818 0.449091 29.4327 0 28.8455 0ZM26.6344 5.18182L28.3273 11.676C27.1873 12.1596 26.2199 12.885 25.4253 13.7487V6.9435C25.4253 6.14896 25.909 5.45818 26.6344 5.18182ZM10.0182 11.3656H14.5091C14.2673 12.022 14.2329 12.7818 14.4747 13.4727L16.0636 18.1708H15.3039H15.0961H2.93636H2.14155C2.65973 14.3362 5.97636 11.3656 10.0182 11.3656ZM31.713 12.989C32.5766 12.989 33.4399 13.1617 34.2344 13.5071C33.889 14.3708 32.7834 14.9579 31.1597 15.787C29.2943 16.7197 27.049 17.8601 26.289 20.1747H25.3909V19.2071C25.4255 15.7871 28.2585 12.989 31.713 12.989ZM34.6143 16.2364C35.4088 16.9964 35.9273 18.067 35.9273 19.2415C35.9273 21.487 34.0275 23.3526 31.713 23.3526C30.193 23.3526 28.88 22.5583 28.1545 21.3838C28.3273 20.1056 29.2599 19.276 30.4344 18.585L30.7455 19.5526C30.8836 20.0017 31.2983 20.2779 31.7474 20.2779C31.851 20.2779 31.9548 20.278 32.0585 20.2435C32.6112 20.0708 32.887 19.4832 32.7143 18.9305L32.3 17.6182C33.0945 17.2036 33.9234 16.7891 34.6143 16.2364ZM5.0435 20.2435H13.1617C12.678 22.0399 11.0548 23.3526 9.08572 23.3526C7.15118 23.3526 5.52714 22.0399 5.0435 20.2435ZM15.3039 20.2435H16.6506H17.5143H23.3526V21.2455C23.3526 21.8327 23.8017 22.2818 24.389 22.2818H26.2545C26.4618 22.6618 26.7385 23.0417 27.0494 23.3526H13.7838C14.5438 22.489 15.0966 21.418 15.3039 20.2435Z"
                            fill="white"
                          />
                        </svg>
                      </div>

                      <div className="am_circ_bx_txt">Scooter</div>
                    </div>

                    <div
                      className="am_circ_bx"
                      onClick={this.changetoCarsharing}
                    >
                      <div
                        className="circle_type_dot"
                        style={{ background: "#a65c3b" }}
                      >
                        <img
                          style={{
                            borderRadius: "30px",
                            width: "50px",
                            marginTop: "5px"
                          }}
                          src={Carsharing_logo}
                        />
                      </div>

                      <div className="am_circ_bx_txt">carsharing</div>
                    </div>

                    <div className="am_circ_bx" onClick={this.changetoParken}>
                      <div
                        className="circle_type_dot"
                        style={{ background: "#182FB4" }}
                      >
                        <svg
                          width={17}
                          height={20}
                          viewBox="0 0 17 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ height: "60px", width: "20px" }}
                        >
                          <path
                            d="M4.87891 12.9863V20H0.777344V0.09375H8.54297C10.0378 0.09375 11.3503 0.367188 12.4805 0.914062C13.6198 1.46094 14.4948 2.24023 15.1055 3.25195C15.7161 4.25456 16.0215 5.39844 16.0215 6.68359C16.0215 8.63411 15.3516 10.1745 14.0117 11.3047C12.681 12.4258 10.8353 12.9863 8.47461 12.9863H4.87891ZM4.87891 9.66406H8.54297C9.6276 9.66406 10.4525 9.40885 11.0176 8.89844C11.5918 8.38802 11.8789 7.65885 11.8789 6.71094C11.8789 5.73568 11.5918 4.94727 11.0176 4.3457C10.4434 3.74414 9.65039 3.43424 8.63867 3.41602H4.87891V9.66406Z"
                            fill="white"
                          />
                        </svg>
                      </div>

                      <div className="am_circ_bx_txt">Parken</div>
                    </div>

                    <div className="am_circ_bx" onClick={this.changetoParken}>
                      <div
                        className="circle_type_dot"
                        style={{ background: "#59E828" }}
                      >
                        <svg
                          width={26}
                          height={65}
                          viewBox="0 0 26 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.80328 0C8.43934 0 7.33123 1.10803 7.33123 2.49328V20.3525H6.13787H3.83607C3.47377 20.3525 3.19672 20.6295 3.19672 20.9918C3.19672 21.3541 3.47377 21.6311 3.83607 21.6311H6.1591H20.2459H22.6326C22.9949 21.6311 23.272 21.3541 23.272 20.9918C23.272 20.6295 22.9949 20.3525 22.6326 20.3525H21.4393V10.5067H21.7165C21.8657 10.5067 21.9933 10.6343 21.9933 10.7835V18.1789C21.9933 19.0313 22.6967 19.7343 23.5492 19.7343C24.4016 19.7343 25.1051 19.0313 25.1051 18.1789V8.6736H25.3607C25.723 8.6736 26 8.39655 26 8.03426V4.3264C26 3.98541 25.723 3.68705 25.3607 3.68705H25.1051V2.85582C25.1051 2.49353 24.828 2.21648 24.4657 2.21648C24.1034 2.21648 23.8264 2.49353 23.8264 2.85582V3.68705H23.528C23.1657 3.68705 22.8886 3.9641 22.8886 4.3264V8.01303C22.8886 8.37533 23.1657 8.65238 23.528 8.65238H23.8264V18.1789C23.8264 18.328 23.6984 18.4557 23.5492 18.4557C23.4 18.4557 23.272 18.328 23.272 18.1789V10.8048C23.272 9.95229 22.5689 9.24926 21.7165 9.24926H21.4393V2.49328C21.4393 1.12934 20.3311 0 18.9672 0H9.80328ZM9.82451 1.27869H17.4966C18.1573 1.27869 18.69 1.81131 18.69 2.49328V2.57861C18.4129 2.36549 18.072 2.21648 17.7098 2.21648H11.1032C10.2507 2.21648 9.54771 2.91951 9.54771 3.77196V8.03426C9.54771 8.88672 10.2507 9.59016 11.1032 9.59016H17.6885C18.0721 9.59016 18.413 9.46246 18.6688 9.22803V20.3525H8.63115V2.49328C8.63115 1.83262 9.16385 1.27869 9.82451 1.27869ZM11.1032 3.49516H17.6885C17.8377 3.49516 17.9657 3.62278 17.9657 3.77196V8.03426C17.9657 8.18344 17.8377 8.31147 17.6885 8.31147H11.1032C10.954 8.31147 10.8264 8.18344 10.8264 8.03426V3.77196C10.8264 3.62278 10.954 3.49516 11.1032 3.49516ZM14.9176 11.9028C14.7112 11.9134 14.513 12.0252 14.4065 12.2116L12.6162 15.1099C12.4884 15.323 12.4884 15.5999 12.6162 15.7917C12.7441 16.0048 12.9999 16.1116 13.2343 16.0689L14.0231 15.9411L12.9575 17.6673C12.7657 17.9657 12.8723 18.3705 13.1707 18.541C13.2772 18.6049 13.3837 18.6263 13.5116 18.6263C13.7247 18.6263 13.9377 18.5197 14.0656 18.3279L15.8558 15.4296C15.9837 15.2165 15.9837 14.9392 15.8558 14.7474C15.7066 14.5343 15.4509 14.428 15.2165 14.4706L14.4277 14.5984L15.4933 12.8722C15.6851 12.5739 15.5785 12.169 15.2802 11.9985C15.1683 11.9266 15.0415 11.8964 14.9176 11.9028ZM0.639344 20.3683C0.47418 20.3683 0.3091 20.4271 0.191887 20.5443C0.0640177 20.6509 0 20.8213 0 20.9918C0 21.1623 0.0640177 21.3327 0.191887 21.4393C0.319755 21.5671 0.468852 21.6311 0.639344 21.6311C0.809836 21.6311 0.980245 21.5671 1.0868 21.4393C1.21467 21.3114 1.27869 21.1623 1.27869 20.9918C1.27869 20.8213 1.21467 20.6509 1.0868 20.5443C0.969589 20.4271 0.804508 20.3683 0.639344 20.3683Z"
                            fill="white"
                          />
                        </svg>
                        <div className="am_circ_bx_txt">Parken</div>
                      </div>
                    </div>
                  </div>
                  {/**   <div style={{ display: "flex", paddingTop: "14px" }}>
                    <div className="am_circ_bx" onClick={this.changetoAirports}>
                      <div
                        className="circle_type_dot"
                        style={{ background: "#0B4E8C" }}
                      >
                        <img src={airport_icon} width="40px" />{" "}
                      </div>

                      <div className="am_circ_bx_txt">Flughafen</div>
                    </div>
                  </div>*/}
                </div>
                <div className="scooterScreen">
                  {this.state.show == "metro" && (
                    <div>
                      {" "}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          lineHeight: "50px"
                        }}
                      >
                        <div
                          className="am_goback"
                          style={{ marginLeft: "12px", marginTop: "12px" }}
                        >
                          <svg
                            width={22}
                            height={24}
                            viewBox="0 0 34 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ width: "18px", height: "38px" }}
                          >
                            <path
                              d="M0.939593 10.9158C0.353377 11.5012 0.352681 12.451 0.938038 13.0372L10.477 22.5901C11.0623 23.1763 12.0121 23.177 12.5983 22.5917C13.1845 22.0063 13.1852 21.0566 12.5999 20.4703L4.1208 11.9788L12.6123 3.49978C13.1985 2.91442 13.1992 1.96467 12.6138 1.37846C12.0285 0.792242 11.0787 0.791546 10.4925 1.3769L0.939593 10.9158ZM33.0011 10.5L2.00057 10.4773L1.99838 13.4773L32.9989 13.5L33.0011 10.5Z"
                              fill="#032342"
                            />
                          </svg>
                        </div>

                        <div
                          style={{
                            marginRight: "auto" /* marginLeft: 'auto', */,
                            marginLeft: "calc(50% - 110px)",
                            fontWeight: 500,
                            fontSize: "22px",
                            color: "#343956"
                          }}
                        >
                          {" "}
                          U-Bahn{" "}
                        </div>
                      </div>
                      {this.state.undergroundList.map((sc, i) => (
                        <li
                          className={`${i == 0 ? "am_first_highlighted" : ""}`}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              padding: "12px",
                              width: "100%"
                            }}
                          >
                            <div
                              style={{
                                textAlign: "left",
                                paddingBottom: "12px",
                                fontWeight: 600,
                                color: "#3b3b58"
                              }}
                            >
                              {sc.Name}
                            </div>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
                                width: "100%",
                                gridGap: "12px"
                              }}
                            >
                              {sc.ProductAtStop.map((prod, i) => (
                                <div
                                  style={{
                                    background: "#a0d0d0",
                                    padding: "4px 6px",
                                    borderRadius: "4px"
                                  }}
                                >
                                  {prod.Name}{" "}
                                </div>
                              ))}{" "}
                            </div>
                          </div>
                        </li>
                      ))}
                    </div>
                  )}

                  {this.state.show == "parking" && (
                    <div>
                      {" "}
                      <div style={{ display: "flex", height: "80px" }}>
                        <div
                          className="am_goback"
                          onClick={this.changetomainScreen}
                          style={{ marginLeft: "12px", marginTop: "12px" }}
                        >
                          <svg
                            width={34}
                            height={24}
                            viewBox="0 0 34 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ width: "20px", height: "60px" }}
                          >
                            <path
                              d="M0.939593 10.9158C0.353377 11.5012 0.352681 12.451 0.938038 13.0372L10.477 22.5901C11.0623 23.1763 12.0121 23.177 12.5983 22.5917C13.1845 22.0063 13.1852 21.0566 12.5999 20.4703L4.1208 11.9788L12.6123 3.49978C13.1985 2.91442 13.1992 1.96467 12.6138 1.37846C12.0285 0.792242 11.0787 0.791546 10.4925 1.3769L0.939593 10.9158ZM33.0011 10.5L2.00057 10.4773L1.99838 13.4773L32.9989 13.5L33.0011 10.5Z"
                              fill="#032342"
                            />
                          </svg>
                        </div>

                        <div
                          style={{
                            marginRight: "auto" /* marginLeft: 'auto', */,
                            marginLeft: "calc(50% - 110px)",
                            fontWeight: 500,
                            fontSize: "22px",
                            color: "#343956"
                          }}
                        >
                          {" "}
                          Parken{" "}
                        </div>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "50px",
                          borderBottom: "1px solid #eff4f5",
                          display: "flex"
                        }}
                      >
                        <div
                          style={{
                            width: "50%",
                            height: "50px",
                            borderBottom: "2px solid #ff377f",
                            lineHeight: "50px",
                            textAlign: "center",
                            color: "#5e5e79"
                          }}
                        >
                          ParkhÃÂ¤user
                        </div>
                        <div
                          style={{
                            width: "50%",
                            height:
                              "50px" /* borderBottom: '2px solid #ff377f', */,
                            lineHeight: "50px",
                            textAlign: "center",
                            color: "#5e5e79"
                          }}
                        >
                          Park &amp; Ride
                        </div>
                      </div>
                      <ul className="am_parkinglist">
                        {this.state.carparkcity.map(sc => (
                          <ol
                            className={`${
                              sc.attributes.PARKHAUS == null ? "am_hidden" : ""
                            }`}
                          >
                            {sc.attributes.PARKHAUS != null && (
                              <li>
                                <div style={{ fontWeight: 600 }}>
                                  {sc.attributes.PARKHAUS}
                                </div>
                                <div
                                  style={{
                                    padding: "8px",
                                    background: "#7ece81",
                                    width: "120px",
                                    color: "white",
                                    marginBottom: "6px",
                                    borderRadius: "4px",
                                    marginTop: "6px"
                                  }}
                                >
                                  {sc.attributes.KAPAZITAET} freie PlÃÂ¤tze
                                </div>
                              </li>
                            )}
                          </ol>
                        ))}
                      </ul>
                      {empty_state}
                    </div>
                  )}

                  {this.state.show == "roller" && (
                    <div>
                      {" "}
                      <div
                        style={{
                          display: "flex",
                          height: "80px",
                          lineHeight: "80px"
                        }}
                      >
                        <div
                          className="am_goback"
                          onClick={this.changetomainScreen}
                          style={{ marginLeft: "12px", marginTop: "12px" }}
                        >
                          <svg
                            width={34}
                            height={24}
                            viewBox="0 0 34 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ width: "20px", height: "60px" }}
                          >
                            <path
                              d="M0.939593 10.9158C0.353377 11.5012 0.352681 12.451 0.938038 13.0372L10.477 22.5901C11.0623 23.1763 12.0121 23.177 12.5983 22.5917C13.1845 22.0063 13.1852 21.0566 12.5999 20.4703L4.1208 11.9788L12.6123 3.49978C13.1985 2.91442 13.1992 1.96467 12.6138 1.37846C12.0285 0.792242 11.0787 0.791546 10.4925 1.3769L0.939593 10.9158ZM33.0011 10.5L2.00057 10.4773L1.99838 13.4773L32.9989 13.5L33.0011 10.5Z"
                              fill="#032342"
                            />
                          </svg>
                        </div>

                        <div
                          style={{
                            marginRight: "auto" /* marginLeft: 'auto', */,
                            marginLeft: "calc(50% - 110px)",
                            fontWeight: 500,
                            fontSize: "22px",
                            color: "#343956"
                          }}
                        >
                          {" "}
                          Roller{" "}
                        </div>
                      </div>
                      <ul className="am_parkinglist">
                        {this.state.emmyList.map((sc, i) => (
                          <li
                            className={`${
                              i == 0 ? "am_first_highlighted" : ""
                            }`}
                          >
                            <div style={{ display: "flex" }}>
                              <div>
                                <img
                                  width="140px"
                                  style={{ marginTop: "8px" }}
                                  src={emmy_scooter}
                                />
                              </div>

                              <div
                                style={{
                                  paddingTop: "16px",
                                  paddingLeft: "20px"
                                }}
                              >
                                <div style={{ fontWeight: 600 }}>
                                  {sc.licencePlate}
                                </div>
                                <div
                                  style={{
                                    textAlign: "left",
                                    paddingTop: "12px",
                                    paddingBottom: "6px",
                                    color: "#3b3f5a"
                                  }}
                                >
                                  {sc.pricingTime}
                                </div>

                                <div
                                  style={{
                                    textAlign: "left",
                                    paddingTop: "12px",
                                    paddingBottom: "6px"
                                  }}
                                >
                                  {sc.fuelLevel}% TankfÃÂ¼llung
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {this.state.show == "bahn" && (
                    <div>
                      {" "}
                      <div
                        style={{
                          display: "flex",
                          height: "80px",
                          lineHeight: "80px"
                        }}
                      >
                        <div
                          className="am_goback"
                          onClick={this.changetomainScreen}
                          style={{ marginLeft: "12px", marginTop: "12px" }}
                        >
                          <svg
                            width={34}
                            height={24}
                            viewBox="0 0 34 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ width: "20px", height: "60px" }}
                          >
                            <path
                              d="M0.939593 10.9158C0.353377 11.5012 0.352681 12.451 0.938038 13.0372L10.477 22.5901C11.0623 23.1763 12.0121 23.177 12.5983 22.5917C13.1845 22.0063 13.1852 21.0566 12.5999 20.4703L4.1208 11.9788L12.6123 3.49978C13.1985 2.91442 13.1992 1.96467 12.6138 1.37846C12.0285 0.792242 11.0787 0.791546 10.4925 1.3769L0.939593 10.9158ZM33.0011 10.5L2.00057 10.4773L1.99838 13.4773L32.9989 13.5L33.0011 10.5Z"
                              fill="#032342"
                            />
                          </svg>
                        </div>

                        <div
                          style={{
                            marginRight: "auto" /* marginLeft: 'auto', */,
                            marginLeft: "calc(50% - 110px)",
                            fontWeight: 500,
                            fontSize: "22px",
                            color: "#343956"
                          }}
                        >
                          {" "}
                          Bus{" "}
                        </div>
                      </div>
                      <div>
                        {this.state.BusList.map((sc, i) => (
                          <li
                            className={`${
                              i == 0 ? "am_first_highlighted" : ""
                            }`}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                padding: "12px",
                                width: "100%"
                              }}
                            >
                              <div
                                style={{
                                  textAlign: "left",
                                  paddingBottom: "12px",
                                  fontWeight: 600,
                                  color: "#3b3b58"
                                }}
                              >
                                {sc.Name}
                              </div>
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns:
                                    "1fr 1fr 1fr 1fr 1fr 1fr",
                                  width: "100%",
                                  gridGap: "12px"
                                }}
                              >
                                {sc.ProductAtStop.map((prod, i) => (
                                  <div
                                    style={{
                                      background: "#a0d0d0",
                                      padding: "4px 6px",
                                      borderRadius: "4px"
                                    }}
                                  >
                                    {prod.Name}{" "}
                                  </div>
                                ))}{" "}
                              </div>
                            </div>
                          </li>
                        ))}
                      </div>
                    </div>
                  )}

                  {this.state.show == "airport" && (
                    <div>
                      {" "}
                      <div
                        style={{
                          display: "flex",
                          height: "80px",
                          lineHeight: "80px"
                        }}
                      >
                        <div
                          className="am_goback"
                          onClick={this.changetomainScreen}
                          style={{ marginLeft: "12px", marginTop: "12px" }}
                        >
                          <svg
                            width={34}
                            height={24}
                            viewBox="0 0 34 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ width: "20px", height: "60px" }}
                          >
                            <path
                              d="M0.939593 10.9158C0.353377 11.5012 0.352681 12.451 0.938038 13.0372L10.477 22.5901C11.0623 23.1763 12.0121 23.177 12.5983 22.5917C13.1845 22.0063 13.1852 21.0566 12.5999 20.4703L4.1208 11.9788L12.6123 3.49978C13.1985 2.91442 13.1992 1.96467 12.6138 1.37846C12.0285 0.792242 11.0787 0.791546 10.4925 1.3769L0.939593 10.9158ZM33.0011 10.5L2.00057 10.4773L1.99838 13.4773L32.9989 13.5L33.0011 10.5Z"
                              fill="#032342"
                            />
                          </svg>
                        </div>

                        <div
                          style={{
                            marginRight: "auto" /* marginLeft: 'auto', */,
                            marginLeft: "calc(50% - 110px)",
                            fontWeight: 500,
                            fontSize: "22px",
                            color: "#343956"
                          }}
                        >
                          {" "}
                          FlughÃÂ¤fen{" "}
                        </div>
                      </div>
                      {empty_state}
                    </div>
                  )}

                  {this.state.show == "carsharing" && (
                    <div>
                      {" "}
                      <div
                        style={{
                          display: "flex",
                          height: "80px",
                          lineHeight: "80px"
                        }}
                      >
                        <div
                          className="am_goback"
                          onClick={this.changetomainScreen}
                          style={{ marginLeft: "12px", marginTop: "12px" }}
                        >
                          <svg
                            width={34}
                            height={24}
                            viewBox="0 0 34 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ width: "20px", height: "60px" }}
                          >
                            <path
                              d="M0.939593 10.9158C0.353377 11.5012 0.352681 12.451 0.938038 13.0372L10.477 22.5901C11.0623 23.1763 12.0121 23.177 12.5983 22.5917C13.1845 22.0063 13.1852 21.0566 12.5999 20.4703L4.1208 11.9788L12.6123 3.49978C13.1985 2.91442 13.1992 1.96467 12.6138 1.37846C12.0285 0.792242 11.0787 0.791546 10.4925 1.3769L0.939593 10.9158ZM33.0011 10.5L2.00057 10.4773L1.99838 13.4773L32.9989 13.5L33.0011 10.5Z"
                              fill="#032342"
                            />
                          </svg>
                        </div>

                        <div
                          style={{
                            marginRight: "auto" /* marginLeft: 'auto', */,
                            marginLeft: "calc(50% - 110px)",
                            fontWeight: 500,
                            fontSize: "22px",
                            color: "#343956"
                          }}
                        >
                          {" "}
                          carsharing{" "}
                        </div>
                      </div>
                      <ul className="am_parkinglist">
                        {this.state.milesList.map((sc, i) => (
                          <li
                            className={`${
                              i == 0 ? "am_first_highlighted" : ""
                            }`}
                          >
                            <div style={{ display: "flex" }}>
                              <div>
                                <img
                                  width="80px"
                                  style={{
                                    marginTop: "8px",
                                    marginLeft: "12px"
                                  }}
                                  src={mileslogo}
                                />
                              </div>

                              <div
                                style={{
                                  paddingTop: "16px",
                                  paddingLeft: "20px"
                                }}
                              >
                                <div
                                  style={{ fontWeight: 600, textAlign: "left" }}
                                >
                                  VW Polo
                                </div>
                                <div
                                  style={{
                                    textAlign: "left",
                                    paddingTop: "12px",
                                    paddingBottom: "6px",
                                    color: "#3b3f5a"
                                  }}
                                >
                                  {sc.pricingTime}
                                </div>

                                <div
                                  style={{
                                    textAlign: "left",
                                    paddingTop: "12px",
                                    paddingBottom: "6px"
                                  }}
                                >
                                  {sc.fuelLevel}% TankfÃÂ¼llung
                                </div>
                              </div>
                            </div>

                            {sc.distance * 1000}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {this.state.show == "SBahn" && (
                    <div>
                      {" "}
                      <div
                        style={{
                          display: "flex",
                          height: "80px",
                          lineHeight: "80px"
                        }}
                      >
                        <div
                          className="am_goback"
                          onClick={this.changetomainScreen}
                          style={{ marginLeft: "12px", marginTop: "12px" }}
                        >
                          <svg
                            width={34}
                            height={24}
                            viewBox="0 0 34 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ width: "20px", height: "60px" }}
                          >
                            <path
                              d="M0.939593 10.9158C0.353377 11.5012 0.352681 12.451 0.938038 13.0372L10.477 22.5901C11.0623 23.1763 12.0121 23.177 12.5983 22.5917C13.1845 22.0063 13.1852 21.0566 12.5999 20.4703L4.1208 11.9788L12.6123 3.49978C13.1985 2.91442 13.1992 1.96467 12.6138 1.37846C12.0285 0.792242 11.0787 0.791546 10.4925 1.3769L0.939593 10.9158ZM33.0011 10.5L2.00057 10.4773L1.99838 13.4773L32.9989 13.5L33.0011 10.5Z"
                              fill="#032342"
                            />
                          </svg>
                        </div>

                        <div
                          style={{
                            marginRight: "auto" /* marginLeft: 'auto', */,
                            marginLeft: "calc(50% - 110px)",
                            fontWeight: 500,
                            fontSize: "22px",
                            color: "#343956"
                          }}
                        >
                          {" "}
                          S-Bahn{" "}
                        </div>
                      </div>
                      {empty_state}
                    </div>
                  )}

                  {this.state.show == "escooter" && (
                    <div>
                      {" "}
                      <div
                        style={{
                          height: "80px",
                          display: "flex",
                          lineHeight: "80px"
                        }}
                      >
                        <div
                          className="am_goback"
                          onClick={this.changetomainScreen}
                          style={{ marginLeft: "12px", marginTop: "12px" }}
                        >
                          <svg
                            width={34}
                            height={24}
                            viewBox="0 0 34 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ width: "20px", height: "60px" }}
                          >
                            <path
                              d="M0.939593 10.9158C0.353377 11.5012 0.352681 12.451 0.938038 13.0372L10.477 22.5901C11.0623 23.1763 12.0121 23.177 12.5983 22.5917C13.1845 22.0063 13.1852 21.0566 12.5999 20.4703L4.1208 11.9788L12.6123 3.49978C13.1985 2.91442 13.1992 1.96467 12.6138 1.37846C12.0285 0.792242 11.0787 0.791546 10.4925 1.3769L0.939593 10.9158ZM33.0011 10.5L2.00057 10.4773L1.99838 13.4773L32.9989 13.5L33.0011 10.5Z"
                              fill="#032342"
                            />
                          </svg>
                        </div>

                        <div
                          style={{
                            marginRight: "auto" /* marginLeft: 'auto', */,
                            marginLeft: "calc(50% - 110px)",
                            fontWeight: 500,
                            fontSize: "22px",
                            color: "#343956"
                          }}
                        >
                          {" "}
                          Scooter{" "}
                        </div>
                      </div>
                      <ul className="scooterlist">
                        <li>
                          <img src={tierscooterpng} />
                          87
                        </li>

                        {this.state.scooterdata.length == 0 && (
                          <div>{empty_state}</div>
                        )}

                        {this.state.scooterdata.map(sc => (
                          <li>
                            <img src={tierscooterpng} />
                            {sc.batteryLevel}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {this.state.show == "bikes" && (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          height: "80px",
                          lineHeight: "80px"
                        }}
                      >
                        <div
                          className="am_goback"
                          onClick={this.changetomainScreen}
                          style={{ marginLeft: "12px", marginTop: "12px" }}
                        >
                          <svg
                            width={34}
                            height={24}
                            viewBox="0 0 34 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ width: "20px", height: "60px" }}
                          >
                            <path
                              d="M0.939593 10.9158C0.353377 11.5012 0.352681 12.451 0.938038 13.0372L10.477 22.5901C11.0623 23.1763 12.0121 23.177 12.5983 22.5917C13.1845 22.0063 13.1852 21.0566 12.5999 20.4703L4.1208 11.9788L12.6123 3.49978C13.1985 2.91442 13.1992 1.96467 12.6138 1.37846C12.0285 0.792242 11.0787 0.791546 10.4925 1.3769L0.939593 10.9158ZM33.0011 10.5L2.00057 10.4773L1.99838 13.4773L32.9989 13.5L33.0011 10.5Z"
                              fill="#032342"
                            />
                          </svg>
                        </div>

                        <div
                          style={{
                            marginRight: "auto" /* marginLeft: 'auto', */,
                            marginLeft: "calc(50% - 110px)",
                            fontWeight: 500,
                            fontSize: "22px",
                            color: "#343956"
                          }}
                        >
                          {" "}
                          Bikesharing{" "}
                        </div>
                      </div>{" "}
                      <ul className="am_bikeslist">
                        {this.state.bikes.map((bike, i) => (
                          <li
                            className={`${
                              i == 0 ? "am_first_highlighted" : ""
                            }`}
                          >
                            {" "}
                            {bike.Provider == "Mobike" && (
                              <img
                                style={{ flexShrink: 0 }}
                                width="70px"
                                height="14px"
                                src={Mobike_logo}
                              />
                            )}
                            {bike.Provider == "Nextbike" && (
                              <img
                                style={{ flexShrink: 0 }}
                                width="70px"
                                src={Nextbike_logo}
                              />
                            )}
                            <div
                              style={{
                                paddingLeft: "24px",
                                display: "flex",
                                flexDirection: "column"
                              }}
                            >
                              <div>
                                {bike.Provider} ({Math.round(bike.Distance)}m)
                              </div>

                              {bike.Provider == "Mobike" && (
                                <div
                                  style={{
                                    textAlign: "left",
                                    paddingTop: "12px",
                                    paddingBottom: "6px",
                                    color: "#3b3f5a"
                                  }}
                                >
                                  1Ã¢ÂÂ¬ pro 20 Minuten
                                </div>
                              )}
                              {bike.Provider == "Nextbike" && (
                                <div
                                  style={{
                                    textAlign: "left",
                                    paddingTop: "12px",
                                    paddingBottom: "6px",
                                    color: "#3b3f5a"
                                  }}
                                >
                                  1Ã¢ÂÂ¬ pro 30 Minuten
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="scooterScreen">
                  <div
                    className="am_goback"
                    onClick={this.changetomainScreen}
                    style={{ marginLeft: "12px", marginTop: "12px" }}
                  >
                    <svg
                      width={34}
                      height={24}
                      viewBox="0 0 34 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ width: "20px", height: "60px" }}
                    >
                      <path
                        d="M0.939593 10.9158C0.353377 11.5012 0.352681 12.451 0.938038 13.0372L10.477 22.5901C11.0623 23.1763 12.0121 23.177 12.5983 22.5917C13.1845 22.0063 13.1852 21.0566 12.5999 20.4703L4.1208 11.9788L12.6123 3.49978C13.1985 2.91442 13.1992 1.96467 12.6138 1.37846C12.0285 0.792242 11.0787 0.791546 10.4925 1.3769L0.939593 10.9158ZM33.0011 10.5L2.00057 10.4773L1.99838 13.4773L32.9989 13.5L33.0011 10.5Z"
                        fill="#032342"
                      />
                    </svg>
                  </div>
                  {this.state.bikes != undefined && (
                    <div>
                      {" "}
                      <ul className="scooterlist">
                        {this.state.bikes.map(person => (
                          <li>Scooter</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="scooterScreen">
                  <div
                    className="am_goback"
                    style={{ marginLeft: "12px", marginTop: "12px" }}
                  >
                    <svg
                      width={34}
                      height={24}
                      viewBox="0 0 34 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ width: "20px", height: "60px" }}
                    >
                      <path
                        d="M0.939593 10.9158C0.353377 11.5012 0.352681 12.451 0.938038 13.0372L10.477 22.5901C11.0623 23.1763 12.0121 23.177 12.5983 22.5917C13.1845 22.0063 13.1852 21.0566 12.5999 20.4703L4.1208 11.9788L12.6123 3.49978C13.1985 2.91442 13.1992 1.96467 12.6138 1.37846C12.0285 0.792242 11.0787 0.791546 10.4925 1.3769L0.939593 10.9158ZM33.0011 10.5L2.00057 10.4773L1.99838 13.4773L32.9989 13.5L33.0011 10.5Z"
                        fill="#032342"
                      />
                    </svg>
                  </div>
                  ()
                  <ul>
                    {this.state.scooterdata.map(sc => (
                      <li>{sc.batteryLevel}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
