import React, { useEffect, useState } from "react";
import API from "../../../utils/API";
import { makeStyles } from "@material-ui/core/styles";
import Comment from "../../Comment/Comment";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { useParams } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import PostAddIcon from '@material-ui/icons/PostAdd';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import { Box, Checkbox, Container, FormControlLabel, FormGroup, FormLabel, Hidden, Slider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from '@material-ui/core/CssBaseline';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import BackButton from "../../BackButton/BackButton";

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#005254',
    }
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",

  },
  root2: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: 'center',
    justifyContent: 'center',
  },

  root3: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '30ch',
    },
  },
  paper: {
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    margin: theme.spacing(1),
    background: '#cac5b9'
  },
  input: {
    background: 'white'
  },
  button: {
    margin: theme.spacing(1),
    backgroundColor: "#b1bb78",
  },
  Card: {
    width: 300,
    margin: 'auto'
  },
  img: {
    height: '100%',
    width: '100%'
  }
}));

export default function PlantDet() {
  const [plantDetails, setPlantDetails] = useState([])
  const [comments, setComments] = useState([])
  const [reset, setReset] = useState(true)
  const { slug } = useParams();
  const classes = useStyles();
  const [value, setValue] = useState();
  const [update, setUpdate] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [months, setMonths] = useState({
    Jan: false,
    Feb: false,
    Mar: false,
    Apr: false,
    May: false,
    Jun: false,
    Jul: false,
    Aug: false,
    Sep: false,
    Oct: false,
    Nov: false,
    Dec: false

  })

  useEffect(() => {
    API.getPlantID(slug)
      .then(result => {
        console.log('result from ' + slug + ': ' + result.data)
        console.log(result.data)
        setPlantDetails(result.data.dbPlant)
        setComments(result.data.dbComment)

        if (result.data.dbComment.length === 0) {
          setUpdate({ ...update, ...result.data.dbPlant })
          if (result.data.dbPlant.growth_months && result.data.dbPlant.growth_months.length > 0) {
            console.log(result.data.dbPlant.growth_months)
            const monthList = {
              Jan: false,
              Feb: false,
              Mar: false,
              Apr: false,
              May: false,
              Jun: false,
              Jul: false,
              Aug: false,
              Sep: false,
              Oct: false,
              Nov: false,
              Dec: false
            }
            result.data.dbPlant.growth_months.forEach(element => {
              monthList[element] = true
            });
            setMonths(monthList)
          }
        }

        if(localStorage.getItem("id")) {
      API.getMyPlants(localStorage.getItem("id"))
      .then(myplants =>{
        const mySlugs = myplants.data.map(element => element.slug)
        if(mySlugs.includes(result.data.dbPlant.slug)){
          console.log('is favorite')
          setIsFavorite(true)
        }
      })
    }
      }).catch(err => console.log(err))
    
  }, [reset])

  function makeFavorite() {

    API.favoritePlant(plantDetails._id, localStorage.getItem("id"))
      .then(result => {
        console.log(result)
        setIsFavorite(true)
      },
        err => console.log(err))
  }

  const handleCommentChange = (event) => {
    setValue(event.target.value);
  };

  const handleUpdateChange = (event) => {
    let { name, value } = event.target
    console.log(`${name}`)
    console.log(`${value}`)

    setUpdate({ ...update, [name]: value });
  }

  const handleSliderChange = (name, value) => {
    console.log(name);
    console.log(value)
    setUpdate({ ...update, [name]: value });
    console.log(update)
  }

  const handleMonthChange = (event) => {
    setMonths({ ...months, [event.target.name]: event.target.checked })
  }

  const handleUpdateSubmit = () => {
    const growth_months = [];
    for (const month in months) {
      if (months[month] === true) {
        growth_months.push(month);
      }
    }
    console.log(growth_months)
    API.updatePlant(plantDetails._id, update, growth_months)
      .then(result => {
        console.log(result)
      })
  }

  //This resets the page when a new comment is added
  const newComment = function () {
    API.makeComment(plantDetails._id, localStorage.getItem("id"), value)
      .then(result => {
        console.log(result)
        setValue("")
        setReset(!reset)
      })
  }

  if (plantDetails.length === 0) {
    return <h1>loading</h1>
  }

  return (
    <Grid container style={{ background: '#005254' }}>
      <Typography
        className={"MuiTypography--heading"}
        variant={"h4"}
        fontWeight="bold"
        component="h4"
        align="center"
        style={{ color: "#a9a9a9", margin: "2%" }}
      >
        Plant Details
        </Typography>
      <Grid item xs={12} mx="auto" style={{ margin: '2%' }} >
        <BackButton />
      </Grid>
      <Container className={classes.root} style={{ background: '#005254' }}>
        {console.log(comments)}
        {/* <Grid style ={{background:'#cac5b9'}}> */}
        {/* <Paper className={classes.paper} style={{background: '#cac5b9'}}> */}
        <Grid item sm={12} md={6} style={{ background: '#cac5b9' }}>
          <Card className={classes.root} style={{ margin: "5vh" }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={9}>
                  <Typography
                    fontWeight="bold"
                    gutterBottom
                    variant="h3"
                    component="h1"
                  >
                    {plantDetails.common_name}
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Button
                    className={classes.button1}
                    variant="contained"
                    size="small" color="primary"

                    endIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  onClick={makeFavorite}
                  ><Hidden only="xs">
                      Save
            </Hidden>
                  </Button>
                </Grid>
              </Grid>

              <Typography
                fontWeight="bold"
                gutterBottom
                variant="h4"
                component="h2">
                Scientific Name: {plantDetails.scientific_name}
              </Typography>
              <Typography gutterBottom variant="h5" component="h2">
                <p>Native Areas: </p>
                <span>{plantDetails.native ? plantDetails.native.join(', ') : ""}</span>
              </Typography>

              <Typography gutterBottom variant="h5" component="h2">
                Form: {update.growth_habit} {update ? <TextField
                  style={{ margin: 8 }}
                  name="growth_habit"
                  defaultValue={update.growth_habit}
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleUpdateChange}
                /> : plantDetails.growth_habit}
              </Typography>

              {update ?

                <FormControl component="fieldset" className={classes.formControl}>
                  <FormGroup>
                    <FormLabel component="legend">Growth Months</FormLabel>
                    <FormControlLabel control={<Checkbox checked={months.Jan} onChange={handleMonthChange} name="Jan" />}
                      label="Jan" />
                    <FormControlLabel control={<Checkbox checked={months.Feb} onChange={handleMonthChange} name="Feb" />} label="Feb" />
                    <FormControlLabel control={<Checkbox checked={months.Mar} onChange={handleMonthChange} name="Mar" />} label="Mar" />
                    <FormControlLabel control={<Checkbox checked={months.Apr} onChange={handleMonthChange} name="Apr" />} label="Apr" />
                    <FormControlLabel control={<Checkbox checked={months.May} onChange={handleMonthChange} name="May" />} label="May" />
                    <FormControlLabel control={<Checkbox checked={months.Jun} onChange={handleMonthChange} name="Jun" />} label="Jun" />
                    <FormControlLabel control={<Checkbox checked={months.Jul} onChange={handleMonthChange} name="Jul" />} label="Jul" />
                    <FormControlLabel control={<Checkbox checked={months.Aug} onChange={handleMonthChange} name="Aug" />} label="Aug" />
                    <FormControlLabel control={<Checkbox checked={months.Sep} onChange={handleMonthChange} name="Sep" />} label="Sep" />
                    <FormControlLabel control={<Checkbox checked={months.Oct} onChange={handleMonthChange} name="Oct" />} label="Oct" />
                    <FormControlLabel control={<Checkbox checked={months.Nov} onChange={handleMonthChange} name="Nov" />} label="Nov" />
                    <FormControlLabel control={<Checkbox checked={months.Dec} onChange={handleMonthChange} name="Dec" />} label="Dec" />
                  </FormGroup>
                </FormControl>
                :
                <Typography gutterBottom variant="h5" component="h2">
                  <p>Growing months:{plantDetails.growth_months} </p>
                </Typography>}

              <Typography gutterBottom variant="h5" component="h2">
                Light Requirement: {update.light} {update ? <Slider
                  key={`slider-${update.light}`}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  defaultValue={update.light ? update.light : plantDetails.light}
                  step={1}
                  marks
                  min={1}
                  max={10}
                  name="light"
                  onChangeCommitted={(event, value) => handleSliderChange("light", value)}
                /> : <Slider
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    defaultValue={plantDetails.light ? plantDetails.light : 1}
                    step={1}
                    marks
                    min={1}
                    max={10}
                    aria-label="light"
                    disabled
                  />}
              </Typography>

              <Typography gutterBottom variant="h5" component="h2">
                Watering: {update ? <React.Fragment>
                  <TextField
                    label="Min"
                    style={{ margin: 8 }}
                    name="watering_min"
                    defaultValue={update.watering_min}
                    variant="outlined"
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleUpdateChange}
                  />

                  <TextField
                    label="Max"
                    style={{ margin: 8 }}
                    name="watering_max"
                    defaultValue={update.watering_max}
                    variant="outlined"
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleUpdateChange}
                  />
                </React.Fragment> : (plantDetails.watering_min + "-" + plantDetails.watering_max + "mm")}
              </Typography>
              <Typography gutterBottom variant="h5" component="h2">
                Temperature: {update ? <React.Fragment>
                  <TextField
                    label="Min"
                    style={{ margin: 8 }}
                    name="temperature_min"
                    defaultValue={update.temperature_min}
                    variant="outlined"
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleUpdateChange}
                  />

                  <TextField
                    label="Max"
                    style={{ margin: 8 }}
                    name="temperature_max"
                    defaultValue={update.temperature_max}
                    variant="outlined"
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleUpdateChange}
                  />
                </React.Fragment> : (plantDetails.temperature_min + "-" + plantDetails.temperature_max + " °F")}
              </Typography>

              <Typography gutterBottom variant="h5" component="h2">
                <p>Soil preferences:</p>
                <ul>
                  <li>  PH Restrictions: {update ? <React.Fragment>
                    <TextField
                      label="Min"
                      style={{ margin: 8 }}
                      name="ph_min"
                      defaultValue={update.ph_min}
                      variant="outlined"
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={handleUpdateChange}
                    />

                    <TextField
                      label="Max"
                      style={{ margin: 8 }}
                      name="ph_max"
                      defaultValue={update.ph_max}
                      variant="outlined"
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={handleUpdateChange}
                    />
                  </React.Fragment> : (plantDetails.ph_min + "-" + plantDetails.ph_max)}</li>

                  <li> Soil Nutriments: {update ?
                    <Slider
                      aria-labelledby="discrete-slider"
                      key={`slider-${update.soil_nutriments}`}
                      valueLabelDisplay="auto"
                      defaultValue={update.soil_nutriments ? update.soil_nutriments : plantDetails.soil_nutriments}
                      step={1}
                      marks
                      min={1}
                      max={10}
                      aria-label="soil_nutriments"
                      onChangeCommitted={(event, value) => handleSliderChange("soil_nutriments", value)}
                    />
                    : <Slider
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      value={plantDetails.soil_nutriments}
                      step={1}
                      marks
                      min={1}
                      max={10}
                      aria-label="soil_nutriments"
                      disabled
                    />} </li>

                  <li> Soil texture: {update ?
                    <Slider
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      key={`slider-${update.soil_texture}`}
                      defaultValue={update.soil_texture ? update.soil_texture : plantDetails.soil_texture}
                      step={1}
                      marks
                      min={1}
                      max={10}
                      aria-label="soil_texture"
                      onChangeCommitted={(event, value) => handleSliderChange("soil_texture", value)}
                    />
                    : <Slider
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      defaultValue={plantDetails.soil_texture}
                      step={1}
                      marks
                      min={1}
                      max={10}
                      aria-label="soil_texture"
                      disabled
                    />} </li>
                  <li> Sowing Description: {update ? <TextField
                    style={{ margin: 8 }}
                    name="sowing"
                    defaultValue={update.sowing}
                    variant="outlined"
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleUpdateChange}
                  /> : plantDetails.sowing} </li>
                </ul>
              </Typography>
              <Typography gutterBottom variant="h5" component="h2">
                Poisonous: {update ? <TextField
                  style={{ margin: 8 }}
                  name="toxicity"
                  variant="outlined"
                  defaultValue={update.toxicity}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleUpdateChange}
                /> : plantDetails.toxicity}
              </Typography>
              <Typography gutterBottom variant="h5" component="h2">
                Cultivation details: {update ? <TextField
                  style={{ margin: 8 }}
                  name="growth"
                  variant="outlined"
                  fullWidth
                  defaultValue={update.growth}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleUpdateChange}
                /> : plantDetails.growth}
              </Typography>
              <Button variant="contained" size="large" color="primary" className={classes.margin} onClick={handleUpdateSubmit}>
                Submit
      </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item sm={12} md={6} style={{ background: '#cac5b9' }}>
          <Card mx="auto" className={classes.root} style={{ width: 500, margin: "5vh", maxWidth: 450 }}>
            <img src={plantDetails.image_url} style={{ height: 500, width: '100%', objectfit: 'cover' }} />
          </Card>
        </Grid>
        <div>
          <div className={classes.root} style={{ margin: "5vh" }}>
            <Typography gutterBottom variant="h5" component="h2" style={{ background: '#cac5b9' }}>
              <div className={classes.root2}>
                {!(JSON.parse(localStorage.getItem("isLoggedIn"))) ? <form
                  className={classes.root3}
                  onSubmit={newComment}
                  noValidate autoComplete="off">
                  <FormControl className={classes.formControl}>
                    <TextField
                      disabled
                      id="outlined-multiline-static"
                      label="Comment"
                      multiline
                      rows={4}
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                        className: classes.input
                      }}
                      defaultValue={"Please log in to add a comment."}
                    />
                    <Button
                      className={classes.button}
                      disabled
                      variant="contained"
                      size="small" color="primary"
                      endIcon={<PostAddIcon />}
                    >
                      <Hidden only="xs">
                        Add Comment
                      </Hidden>
                    </Button>
                  </FormControl>
                </form>
                  :
                  <form
                    className={classes.root3}
                    onSubmit={newComment}
                    noValidate autoComplete="off">
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="outlined-multiline-static"
                        label="Comment"
                        multiline
                        rows={4}
                        variant="outlined"
                        InputProps={{
                          className: classes.input
                        }}
                        value={value}
                        onChange={handleCommentChange}
                      />
                      <Button
                        className={classes.button}
                        variant="contained"
                        size="small" color="primary"
                        endIcon={<PostAddIcon />}
                        onClick={newComment}
                      >
                        <Hidden only="xs">
                          Add Comment
                      </Hidden>
                      </Button>
                    </FormControl>
                  </form>}

              </div >

              <Typography variant="h4" gutterBottom component="span">
                <strong>Comments: </strong>
              </Typography>


              {comments.map((comment) => {
                return (

                  <Comment
                    variant="p"
                    comment={comment.commentText}
                    user={comment.userId.username}
                    commentId={comment._id}
                    key={comment._id}
                    userId={comment.userId._id}
                    viewerId={localStorage.getItem("id")}
                  />
                );
              })}
            </Typography>
          </div>
        </div>


        {/* </Grid> */}
        {/* </Paper> */}

      </Container>
    </Grid>
  );
}
