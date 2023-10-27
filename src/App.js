import React, { useEffect, useState } from "react";
import axios from "axios";
import Map from "./components/MapGL";
import Dropdown from "./components/Dropdown";
import Button from "./components/Button";
import "./App.css";

function App() {
  const options = ["0970", "3127", "11:00:00"];

  const [origin, setOrigin] = useState("");

  const [routeIndex, setRouteIndex] = useState();
  const [nodes, setNodes] = useState();
  const [routes, setRoutes] = useState();

  const [destination, setDestination] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  const [num, setNum] = useState([]);

  const handleRouteSelect = (option) => {
    setRouteIndex(option - 1);
    console.log(option - 1);
  };

  const handleOriginSelect = (option) => {
    setOrigin(option);
  };

  const handleDestinationSelect = (option) => {
    setDestination(option);
  };

  const handleTimeSelect = (option) => {
    setTime(option);
  };

  const fetchRoutes = (time, origin, destination) => {
    // Define the Axios request here
    return axios.get(
      `http://127.0.0.1:8000/routes/?time=${time}&origin=${origin}&destination=${destination}`
    );
  };
  const fetchNodes = () => {
    // Define the Axios request here
    return axios.get(`http://127.0.0.1:8000/nodes`);
  };

  useEffect(() => {}, []);

  const handleGetRoute = () => {
    if (!time || !origin || !destination) {
      // Check if any of the fields is empty
      setError("All options are required!");
      return;
    }

    // Call the utility function to make the GET request
    fetchRoutes(time, origin, destination)
      .then((response) => {
        setRoutes(response.data);

        const arrayNum = Array.from({ length: response.data.routes.length }, (_, index) =>
          (index + 1).toString()
        );

        setNum(arrayNum);
        console.log("NUM: ", arrayNum);
        console.log(response.data);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchNodes()
      .then((response) => {
        setNodes(response.data);

        console.log(response.data["0970"]);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  return (
    <div className="App">
      <h1>Finding Shortest Path</h1>
      {/* <p>Time: {data.time}</p>
      <p>Origin: {data.origin}</p>
      <p>destination: {data.destination}</p> */}

      <div className="center">
        <Map nodes={nodes} index={routeIndex} routes={routes} />
        <div className="flex-main">
          <div className="flex">
            <Dropdown options={options} onChange={handleOriginSelect} title="Origin Node" />
            <Dropdown
              options={options}
              onChange={handleDestinationSelect}
              title="Destination Node"
            />
          </div>
          <div className="flex-2">
            <Dropdown options={options} onChange={handleTimeSelect} title="Departure Time" />
          </div>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {routes ? (
          <Dropdown options={num} onChange={handleRouteSelect} title="Choose Route" />
        ) : (
          <></>
        )}
        <Button onClick={handleGetRoute} className="button">
          Get Routes
        </Button>
      </div>
    </div>
  );
}

export default App;
