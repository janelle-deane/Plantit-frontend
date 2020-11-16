import React, { useState, useEffect } from 'react'
import Polygon from '../Polygon/Polygon'
import PlanImage from '../PlanImage/PlanImage'
import Konva from "konva";
import { Stage, Layer, Line, Circle, Transformer } from "react-konva";
import _ from "lodash";
import DrawPanel from '../DrawPanel/DrawPanel';
import PlanGrid from '../PlanGrid/PlanGrid';
import sceneStyle from './sceneStyle';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import pics from './util'
import ForeGroundPanel from '../ForegroundPanel/ForegroundPanel';

export default function Scene() {
  const classes = sceneStyle;

  const [polygons, setPolygons] = useState([])
  
  const [images, setImages] = useState([])
  const [selectedId, selectShape] = React.useState(null);
  
  const [selected, setSelected] = useState(null)
  const [drawing, _setDrawing] = useState("")
  const drawRef = React.useRef(drawing);
  const setDrawing = data => {
    drawRef.current = data;
    _setDrawing(data);
  };
  const stageRef = React.useRef();
  const [temp, setTemp] = useState({
    points: [],
    fill: 'brown'
  })

  const RADIUS = 8;
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    
    
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    }
  }, [])


  useEffect(() => {
    //test drawing for effect
    if (drawing) {
      console.log(drawing)
    }
    else {
      if (temp.points && temp.points.length > 4) {
        console.log("added")
        console.log(temp.points)
        const polys = getPolygons()
        polys.push(temp);
        setPolygons(polys);
        setTemp({})
      }
    }
    //test temp for completeness
    //if complete then add
    //if not complete then discard
    //
  }, [drawing])

  const getPolygons = () => {
    let res = [];
    for (let i = 0; i < polygons.length; i++) {
      res.push({ ...polygons[i] });
    }
    return res;
  }

  const handleClick = (e, i) => {
    if (drawing) return;
    setSelected(i)
  }

  const handleStageClick = (e) => {
    console.log(e.target)
    if (!drawing) {
      // console.log(e)
      if (e.target instanceof Konva.Line || e.target instanceof Konva.Image) return
      setSelected(null)
      selectShape(null)
    }
    else {

      const x = e.evt.layerX
      const y = e.evt.layerY
      const coords = [...temp.points]
      let distToFirst = 200
      if (temp.points && temp.points.length >= 3) {
        console.log(x + " " + y + " " + coords[0] + " " + coords[1])
        distToFirst = (x - coords[0]) ** 2 + (y - coords[1]) ** 2
      }
      if (distToFirst <= 150) {
        coords.pop()
        coords.pop()
        console.log("drawing off")
        setTemp({ ...temp, points: coords });
        setDrawing("")
      }
      else {
        coords.push(x)
        coords.push(y)
        setTemp({ ...temp, points: coords });
      }
    }
  }

  const handleKeyPress = (e) => {
    if (drawRef.current) {
      console.log(e)
      e.preventDefault();

      if (e.keyCode === 27) {
        setTemp({})
      }
      if (e.keyCode === 27 || e.keyCode === 13) {
        console.log("drawing off")
        setDrawing("")
      }
    }
  }

  const handleDrawBtnClick = (image) => {
    setSelected(null);
    if (drawing) {
      console.log("drawing off")
      setDrawing("")
      // const polys = getPolygons()
      // polys.push(temp);
      // setPolygons(polys);
      setTemp({});
    }
    else {
      console.log("drawing on")
      setDrawing(image);
      setTemp({ points: [], fillPatternImage: image })
    }

  }

  // const handleBeginCircleDrag = (circleX, circleY) => {
  //   //reorder points to put circleX and circleY at end
  //   const polys = getPolygons()
  //   const poly = {...polys[selected]};
  //   console.log(poly.points)
  //   const vertex = poly.points.filter(p => p===circleX || p===circleY);
  //   poly.points = poly.points.filter(p=>p!==circleX && p!==circleY);
  //   poly.points.push(vertex[0])
  //   poly.points.push(vertex[1])
  //   polys[selected] = poly;
  //   console.log(poly.points)
  //   setPolygons(polys);
  // }

  const handleCircleDrag = (e, circle) => {
    // console.log(e)
    const newPoints = [...polygons[selected].points];
    // const xidx = newPoints.indexOf(circleX);
    // const yidx = newPoints.indexOf(circleY);
    // console.log(circle)
    // console.log(newPoints)
    // console.log(circleX + " " + circleY)
    // Changing the points state with new points while dragging the circle
    const stageX = stageRef.current.content.offsetLeft
    const stageY = stageRef.current.content.offsetTop
    const stageW = 800
    const stageH = 800
    //TODO: make this more efficient
    let newX, newY
    // if (e.evt.clientX < stageX) newX = 0
    // else if (e.evt.clientX > stageX + stageW) newX = stageW
    // else 
    newX = e.evt.layerX;
    // if (e.evt.clientY < stageY) newY = 0
    // else if (e.evt.clientY > stageY + stageH) newY = stageH
    // else 
    newY = e.evt.layerY;
    newPoints[2 * circle] = newX;
    newPoints[2 * circle + 1] = newY;
    console.log(e.evt.clientX + " " + e.evt.clientY)
    console.log(stageRef.current.content.offsetLeft + " " + stageRef.current.content.offsetTop)
    // console.log(e.currentTarget.content.offsetX + " " + e.currentTarget.content.offsetY)

    // for (let i = 0; i < polygons[selected].points.length; i++) {
    //   if (polygons[selected].points[i] >= circleX-RADIUS && polygons[selected].points[i] <= circleX+RADIUS && polygons[selected].points[i + 1] >= circleY-RADIUS && polygons[selected].points[i + 1] <= circleY+RADIUS) {

    //     newPoints[i] = e.target.x();
    //     newPoints[i + 1] = e.target.y();
    //     break;
    //   }
    // }
    // console.log(newPoints)
    const temp = getPolygons()
    temp[selected].points = newPoints;
    setPolygons(temp);
  }

  const handleMouseMove = (e) => {
    if (!drawing || temp.points.length === 0) return;
    // console.log("hi")
    const tempCopy = [...temp.points]
    // console.log(temp.points)
    if (tempCopy.length > 2) {
      tempCopy.pop();
      tempCopy.pop();
    }
    // console.log(tempCopy.points)
    const coords = [e.evt.layerX, e.evt.layerY]
    tempCopy.push(coords[0])
    tempCopy.push(coords[1])
    setTemp({ ...temp, points: tempCopy });

    // const first = [temp.points[0],temp.points[1]]
    // const dist = (coords[0]-first[0])**2 + (coords[1]-first[1])**2
    // if(dist < 100) console.log("true")
    // for(let i = 0; i < polygons.length; i++) {
    //   for(let j = 0; j < polygons[i].points.length; j+=2) {
    //     const x = polygons[i].points[j];
    //     const y = polygons[i].points[j+1];
    //     const dist = (coords[0]-x)**2 + (coords[1]-y)**2
    //     if(dist < 100) console.log('true');
    //   }
    // }
  }

  const handleObjectBtnClick = type => {
    const src = pics[type][Math.floor(Math.random()*pics[type].length)]
    const newObj = {
      x: 100,
      y: 100,
      width: 50,
      height: 50,
      src: src,
      id: Date.now()+Math.random(),
    }
    const imgs = images.slice();
    imgs.push(newObj)
    setImages(imgs)
  }

  const testFunc = (e) => {
    
    // e.stopPropagation();
    // e.preventDefault();
    console.log(e)
  }

  // console.log(temp.points)
  return (
    <Grid container spacing={3}>
      <Grid item xs>
        <Paper className={classes.paper}>

          <DrawPanel active={drawing} onClick={handleDrawBtnClick} />
          <ForeGroundPanel onClick={handleObjectBtnClick}/>
          {/* <img src="/images/imageonline-co-split-image (26).png" alt="" onDragStart={testFunc} onDragMove={testFunc} onDragEnd={testFunc} onDrop={testFunc} onDropCapture={testFunc}/> */}
        </Paper>
      </Grid>
      <Grid item xs>
        <Stage className='garden-planner' ref={stageRef} height={800} width={800} onDragOver={testFunc} onClick={handleStageClick} onMouseMove={handleMouseMove} style={{ display: 'inline-block', background: '#DDDDDD' }}>
          <PlanGrid height={800} width={800} />
          <Layer>
            {polygons.map((item, i) => <Polygon {...item}
              selected={i === selected}
              onDragMove={handleCircleDrag}
              onClick={e => handleClick(e, i)}
              num={i}
              radius={RADIUS} />)}
            {temp.points && <Line closed fillPatternImage={temp.fillPatternImage} points={temp.points} stroke='black' strokeWidth={2} />}
          </Layer>
          <Layer>
            {images.map((img, i) => {
              return (
                <PlanImage
                  key={i}
                  shapeProps={img}
                  isSelected={img.id === selectedId}
                  onSelect={() => {
                    selectShape(img.id);
                  }}
                  onChange={(newAttrs) => {
                    const imgs = images.slice();
                    imgs[i] = newAttrs;
                    setImages(imgs);
                  }}
                />
              );
            })}
          </Layer>
        </Stage>
      </Grid>
    </Grid>
  )
  // onMouseDown={handleMouseDown}onMouseMove={handleMouseMove}   style={{ background: '#BBBBBB' }}
}
