import "./styles.css";
import data from "./data.js";
import proj4 from "proj4";

const wkt = require("wkt");

proj4.defs(
  "EPSG:5973",
  "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +vunits=m +no_defs"
);

function myFunction() {
  let output = "";
  let data_obj = JSON.parse(data);

  /*
  //Uten transformering
  data_obj.objekter.forEach((element) =>
    console.log(wkt.parse(element.geometri.wkt))
  );
  */

  //Transformering
  var source = new proj4.Proj("EPSG:5973");
  var dest = new proj4.Proj("EPSG:4326");
  data_obj.objekter.forEach((element) => {
    var geojson = wkt.parse(element.geometri.wkt);
    geojson.coordinates.forEach((coordinate, index) => {
      var sourcep = new proj4.toPoint(coordinate);

      var destp = proj4.transform(source, dest, sourcep);

      //Oppdater koordinater direkte i geojson
      geojson.coordinates[index] = destp;
    });
    console.log("Transformert geojson : ", geojson);
    output = output + JSON.stringify(geojson) + "<br>";
  });
  document.getElementById("dataContainer").innerHTML = output;
}

document.getElementById("button").addEventListener("click", myFunction);
