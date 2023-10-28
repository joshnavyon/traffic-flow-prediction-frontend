import React, { useEffect, useState } from "react";
import axios from "axios";
import Map from "./components/MapGL";
import Dropdown from "./components/Dropdown";
import "./App.css";

//Material UI Components
import { TextField, Tooltip, Button, Grid, Container, AppBar, Toolbar, Typography, AlertTitle} from "@mui/material";
import Alert from '@mui/material/Alert';

function App() {
  const [origin, setOrigin] = useState(""); //Origin Node

  const [routeIndex, setRouteIndex] = useState();
  const [nodes, setNodes] = useState();
  const [routes, setRoutes] = useState();

  const [destination, setDestination] = useState("");
  const [time, setTime] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleTimeSelect = (event) => {
    const newTimeValue = event.target.value;
    setTime(newTimeValue); 
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
      setError("All Options are Required!");
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

        setError("");  // Reset error message as it was successful
        setSuccess("Routes were Fetched Successfully!"); 
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
        setError("Failed to Fetch Routes! Please Ensure the Time was Entered Correctly");  

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
    <Container className="App"> {/*Container centers elements smoothly*/}
      <Grid container spacing={2}> {/*Grid Parent for Grid Elements */}
        <Grid item xs={12} md={12}>
          <h1>Traffic Flow Prediction System GUI</h1>  {/*Page Header*/}
          <p>The following system has been constructed on React JS utlising the Material UI library to utilise visual components. The map is React Map GL providing a visualisation of all SCAT Node Locations.</p>
        </Grid>

         {/*Aligned Map*/}
        <Grid item xs={12} md={12}>
          <Map nodes={nodes} index={routeIndex} routes={routes} />
        </Grid>

         {/*Dropdown for User to select Scat Origin*/}
        <Grid item xs={6} lg={4}>
          <Dropdown options={nodes ? Object.keys(nodes) : []} onChange={handleOriginSelect} title="Origin Node (O)" /> 
        </Grid>

        {/*Dropdown for User to select Scat Destination*/}
        <Grid item xs={6} lg={4}>
          <Dropdown options={nodes ? Object.keys(nodes) : []} onChange={handleDestinationSelect} title="Destination Node (D)"/>
        </Grid>

        {/*Text box for User to select time*/}
        {/*Material UI element using the backdrop of the correct format the application can utilise*/}
        <Grid item xs={6} lg={12}>
          <label for="outlined-basic"><strong>Time:</strong></label>
          <br/> {/*Spacing Breakpoint*/}
          <br/> {/*Spacing Breakpoint*/}

          <TextField id="outlined-basic" label="00:00:00" onChange={handleTimeSelect} variant="outlined" /> 
        </Grid>

        {/*Material UI Button*/}
        <Grid item xs={12} lg={12}>
          <Tooltip title="Generate a Total of 5 Available Routes">
            <Button variant="outlined" color="primary" onClick={handleGetRoute}>
              Get Routes
            </Button>
          </Tooltip>
        </Grid>

        {/*Logging and User Warnings, (One Success Variant) - (Two Error Variants)*/}
        <Grid item xs={12} lg={12}>

          {error && <Alert variant="filled" severity="error">
          <AlertTitle>Error</AlertTitle> {error}
          </Alert>}  {/*Red Warning*/}

          {success && <Alert variant="filled" severity="success">
          <AlertTitle>Success</AlertTitle> {success}
          </Alert>}  {/*Green Success*/}

          {/*If routes exists then display route drop down*/}
          {routes ? (
            <Dropdown options={num} onChange={handleRouteSelect} title="Choose Possible Routes" /> 
          ) : (
            <></>
          )}
        </Grid>

        {/*If routes exists and the user has selected a specific route then display all the details of that route*/}
        {routes && routeIndex !== undefined && (<>

            {/*Route, origin and destination and cost details*/}
            <Grid mt={5} item xs={12} lg={12}>
              <Typography variant="h6"><strong>Travel Details:</strong></Typography>
            </Grid>
            <Grid item xs={12} lg={12}>
              <Typography>
                <strong>Travelling From: </strong>
                {`${(routes.routes[routeIndex].path[0].description)}`}
              </Typography>
            </Grid>
            <Grid item xs={12} lg={12}>
              <Typography>
                <strong>Destination: </strong>
                {`${(routes.routes[routeIndex].path[routes.routes[routeIndex].path.length - 1].description)}`}
              </Typography>
            </Grid>
            <Grid item xs={12} lg={12}>
              <Typography>
                <strong>Time to Travel (Cost): </strong>
                {`${((routes.routes[routeIndex].cost) / 60).toFixed(2)} Minutes`}
                
              </Typography>
            </Grid>

            {/*Path of the routes*/}
            <Grid mt={5} item xs={12} lg={12}>
              <Typography variant="h6"><strong>Routes Taken:</strong></Typography>
            </Grid>
            <Grid item xs={12} lg={12}>
              <Typography>
                <ol> {/*Ordered List */}
                  {/*Breakdwon route into single routes*/}
                  {routes.routes[routeIndex].path.map((specificPath, index) => (
                    <div key={index}>
                      <li>{specificPath.description}</li>
                    </div>
                  ))}
                </ol>
              </Typography>
            </Grid>
          </>
        )}

        <Grid item xs={12}>
                <div style={{ height: '200px' }}></div>  {/* Adds space between footer and content */}
            </Grid>
        </Grid>

        {/*Footer from MUI attached to bottom of page*/}
        <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
            <Toolbar>
                <Typography variant="body1" color="inherit">
                    Traffic Flow Prediction System GUI, 2023
                </Typography>
            </Toolbar>
        </AppBar>
    </Container>

  );
}

export default App;
