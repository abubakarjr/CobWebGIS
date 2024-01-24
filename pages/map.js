// Define the initial view for the map
var mapView = new ol.View({
  center: ol.proj.fromLonLat([7.442544, 10.542135]),
  zoom: 14,
});

var map = new ol.Map({
  target: "map",
  view: mapView,
  controls: [
    new ol.control.ZoomToExtent({
      className: "zoom-to-extent",
    }),

    new ol.control.Rotate({
      className: "ol-print-to-scale",
      label: "N",
      tipLabel: "North",
    }),

    new ol.control.Attribution(),

    new ol.control.FullScreen({
      className: "custom-fullscreen-control",
    }),

    new ol.control.MousePosition({
      className: "mousePosition",
      projection: "EPSG:4326",
      coordinateFormat: function (coordinate) {
        return ol.coordinate.format(coordinate, "{y} , {x}", 6);
      },
    }),

    new ol.control.ScaleLine({
      units: "metric",
      bar: true,
      steps: 4,
      text: true,
      minWidth: 100,
    }),

    new ol.control.OverviewMap(),
    new ol.control.LayerSwitcher(),
  ],

  rotation: Math.PI / 6,
});

// Bing Maps Satellite
var bingSatellite = new ol.layer.Tile({
  title: "Bing Satellite",
  type: "base",
  visible: false,
  source: new ol.source.BingMaps({
    key: "AstqSWN2XWpS7yTd1GQ6mSp6ADE-IFOaLveo30y7PhE2iz7CDA8nvsvO-3YsEeXF",
    imagerySet: "AerialWithLabels",
  }),
});

// Bing Maps
var bingStreetsWithLabels = new ol.layer.Tile({
  title: "Bing Streets",
  type: "base",
  visible: false,
  source: new ol.source.BingMaps({
    key: "AstqSWN2XWpS7yTd1GQ6mSp6ADE-IFOaLveo30y7PhE2iz7CDA8nvsvO-3YsEeXF",
    imagerySet: "RoadOnDemand",
  }),
});

// Open Street Map
var osmTile = new ol.layer.Tile({
  title: "OSM",
  type: "base",
  visible: false,
  attributions: "",
  source: new ol.source.OSM(),
});

// Mapbox tile layer
var mapboxAccessToken =
  "pk.eyJ1IjoiYWJ1YmFrYXJ0YW5rbzk5IiwiYSI6ImNra3dyNXc5aTBuYTUybm80bHpxNXM5NDMifQ.CTLplUINQxXlKFLh_ow2sg";
var mapboxTile = new ol.layer.Tile({
  title: "Mapbox Streets",
  type: "base",
  visible: false,
  attributions: "© Mapbox",
  source: new ol.source.XYZ({
    url:
      "https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=" +
      mapboxAccessToken,
  }),
});

// Google Maps layer
var googleMapsApiKey = "AIzaSyBBe7xyfVIq6EmKffOupLL50mniuvRyT1A";

var googleMapsLayer = new ol.layer.Tile({
  title: "Google Maps",
  type: "base",
  visible: true,
  source: new ol.source.XYZ({
    url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    crossOrigin: "anonymous",
  }),
});

// Google Hybrid layer
var googleMapsApiKey = "YOUR_GOOGLE_MAPS_API_KEY";
var googleHybridLayer = new ol.layer.Tile({
  title: "Google Hybrid",
  type: "base",
  visible: false, // Set to true if you want it to be initially visible
  source: new ol.source.XYZ({
    url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    crossOrigin: "anonymous",
  }),
});

var baseGroup = new ol.layer.Group({
  title: "Base Maps",
  fold: true,
  layers: [
    osmTile,
    mapboxTile,
    bingStreetsWithLabels,
    bingSatellite,
    googleMapsLayer,
    googleHybridLayer,
  ],
});
map.addLayer(baseGroup);

// LOCATION SEARCH
var bingApiKey =
  "AstqSWN2XWpS7yTd1GQ6mSp6ADE-IFOaLveo30y7PhE2iz7CDA8nvsvO-3YsEeXF";
var mapboxApiKey =
  "pk.eyJ1IjoiYWJ1YmFrYXJ0YW5rbzk5IiwiYSI6ImNra3dyNXc5aTBuYTUybm80bHpxNXM5NDMifQ.CTLplUINQxXlKFLh_ow2sg";
var googleApiKey = "YOUR_GOOGLE_API_KEY"; // Replace with your Google API key
var locationInput = document.getElementById("inpt_search");
var suggestionsContainer = document.getElementById("suggestions-container");

locationInput.addEventListener("input", function () {
  // Clear previous suggestions
  suggestionsContainer.innerHTML = "";

  var locationInputValue = locationInput.value;

  if (locationInputValue.trim() !== "") {
    Promise.all([
      getBingLocationsSuggestions(locationInputValue),
      getMapboxLocationsSuggestions(locationInputValue),
      getGoogleLocationsSuggestions(locationInputValue),
    ])
      .then(([bingSuggestions, mapboxSuggestions, googleSuggestions]) => {
        var allSuggestions = bingSuggestions.concat(
          mapboxSuggestions,
          googleSuggestions
        );

        if (allSuggestions.length > 0) {
          // Display up to 3 suggestions
          allSuggestions.slice(0, 3).forEach((suggestion) => {
            var suggestionElement = document.createElement("div");
            suggestionElement.className = "suggestion";
            suggestionElement.textContent = suggestion.name;

            suggestionElement.addEventListener("click", function () {
              // Handle suggestion click
              handleSuggestionClick(suggestion);
            });

            suggestionsContainer.appendChild(suggestionElement);
          });

          // Show scroll styling if there are more than 3 suggestions
          if (allSuggestions.length > 3) {
            suggestionsContainer.style.overflowY = "scroll";
            suggestionsContainer.style.maxHeight = "100px"; // Set a max height as per your design
          } else {
            suggestionsContainer.style.overflowY = "hidden";
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching location suggestions:", error);
      });
  }
});

function getBingLocationsSuggestions(query) {
  var apiUrl = `https://dev.virtualearth.net/REST/v1/Locations?query=${encodeURIComponent(
    query
  )}&key=${bingApiKey}`;

  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.resourceSets && data.resourceSets.length > 0) {
        return data.resourceSets[0].resources;
      } else {
        return [];
      }
    })
    .catch((error) => {
      console.error("Error fetching Bing location suggestions:", error);
      return [];
    });
}

function getMapboxLocationsSuggestions(query) {
  var apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query
  )}.json?access_token=${mapboxApiKey}`;

  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.features && data.features.length > 0) {
        return data.features.map((feature) => ({
          name: feature.place_name,
          point: {
            coordinates: feature.center,
          },
        }));
      } else {
        return [];
      }
    })
    .catch((error) => {
      console.error("Error fetching Mapbox location suggestions:", error);
      return [];
    });
}

function getGoogleLocationsSuggestions(query) {
  var apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    query
  )}&key=${googleApiKey}`;

  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.predictions && data.predictions.length > 0) {
        return data.predictions.map((prediction) => ({
          name: prediction.description,
          placeId: prediction.place_id,
        }));
      } else {
        return [];
      }
    })
    .catch((error) => {
      console.error("Error fetching Google location suggestions:", error);
      return [];
    });
}

function handleSuggestionClick(suggestion) {
  var coordinates;
  if (suggestion.point) {
    coordinates = [
      suggestion.point.coordinates[1],
      suggestion.point.coordinates[0],
    ];
  }

  // Assuming `map` is a global variable and it has a method to set the view
  if (map && coordinates) {
    map.getView().animate({
      center: ol.proj.fromLonLat(coordinates),
      zoom: 12,
      duration: 1000,
    });
  }

  console.log(
    "Clicked suggestion:",
    suggestion.name,
    "Coordinates:",
    coordinates
  );
}
//LIVE LOCATION
var intervalAutolocate;
var posCurrent;

var geolocation = new ol.Geolocation({
  trackingOptions: {
    enableHighAccuracy: true,
  },
  tracking: true,
  projection: mapView.getProjection(),
});

var positionFeature = new ol.Feature();
positionFeature.setStyle(
  new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({
        color: "#3399CC",
      }),
      stroke: new ol.style.Stroke({
        color: "#fff",
        width: 2,
      }),
    }),
  })
);
var accuracyFeature = new ol.Feature();

var currentPositionLayer = new ol.layer.Vector({
  map: map,
  source: new ol.source.Vector({
    features: [accuracyFeature, positionFeature],
  }),
});

function startAutolocate() {
  var coordinates = geolocation.getPosition();
  positionFeature.setGeometry(
    coordinates ? new ol.geom.Point(coordinates) : null
  );
  mapView.setCenter(coordinates);
  mapView.setZoom(20);
  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
  intervalAutolocate = setInterval(function () {
    var coordinates = geolocation.getPosition();
    var accuracy = geolocation.getAccuracyGeometry();
    positionFeature.setGeometry(
      coordinates ? new ol.geom.Point(coordinates) : null
    );
    map.getView().setCenter(coordinates);
    mapView.setZoom(16);
    accuracyFeature.setGeometry(accuracy);
  }, 10000);
}

function stopAutolocate() {
  clearInterval(intervalAutolocate);
  positionFeature.setGeometry(null);
  accuracyFeature.setGeometry(null);
}
//LIVE LOCATION

// ONLOAD FUNCTIONS
$(function () {
  var toc = document.getElementById("layerSwitcherContent");
  layerSwitcherControl = new ol.control.LayerSwitcher.renderPanel(map, toc, {
    reverse: false,
  });

  $("#btnCrosshair").on("click", function (event) {
    $("#btnCrosshair").toggleClass("clicked");
    if ($("#btnCrosshair").hasClass("clicked")) {
      startAutolocate();
    } else {
      stopAutolocate();
    }
  });
});
// ONLOAD FUNCTIONS

// *****************************************************
document.getElementById("lengthBtn").addEventListener("click", function () {
  changeMeasurementType("LineString");
});

document.getElementById("areaBtn").addEventListener("click", function () {
  changeMeasurementType("Polygon");
});

document.getElementById("pointBtn").addEventListener("click", function () {
  changeMeasurementType("Point");
});

document.getElementById("circleBtn").addEventListener("click", function () {
  changeMeasurementType("Circle");
});

document.getElementById("modifyBtn").addEventListener("click", function () {
  modifySelectedFeature();
});

document.getElementById("clearBtn").addEventListener("click", function () {
  clearSelectedFeature();
});

// Measurement-related JavaScript code (Add this part)
const style = new ol.style.Style({
  fill: new ol.style.Fill({
    color: "rgba(255, 255, 255, 0.2)",
  }),
  stroke: new ol.style.Stroke({
    color: "rgba(0, 0, 0, 0.5)",
    lineDash: [10, 10],
    width: 2,
  }),
  image: new ol.style.Circle({
    radius: 5,
    stroke: new ol.style.Stroke({
      color: "rgba(0, 0, 0, 0.7)",
    }),
    fill: new ol.style.Fill({
      color: "rgba(255, 255, 255, 0.2)",
    }),
  }),
});

const labelStyle = new ol.style.Style({
  text: new ol.style.Text({
    font: "14px Calibri,sans-serif",
    fill: new ol.style.Fill({
      color: "rgba(255, 255, 255, 1)",
    }),
    backgroundFill: new ol.style.Fill({
      color: "rgba(0, 0, 0, 0.7)",
    }),
    padding: [3, 3, 3, 3],
    textBaseline: "bottom",
    offsetY: -15,
  }),
  image: new ol.style.RegularShape({
    radius: 8,
    points: 3,
    angle: Math.PI,
    displacement: [0, 10],
    fill: new ol.style.Fill({
      color: "rgba(0, 0, 0, 0.7)",
    }),
  }),
});

const tipStyle = new ol.style.Style({
  text: new ol.style.Text({
    font: "12px Calibri,sans-serif",
    fill: new ol.style.Fill({
      color: "rgba(255, 255, 255, 1)",
    }),
    backgroundFill: new ol.style.Fill({
      color: "rgba(0, 0, 0, 0.4)",
    }),
    padding: [2, 2, 2, 2],
    textAlign: "left",
    offsetX: 15,
  }),
});

const modifyStyle = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 5,
    stroke: new ol.style.Stroke({
      color: "rgba(0, 0, 0, 0.7)",
    }),
    fill: new ol.style.Fill({
      color: "rgba(0, 0, 0, 0.4)",
    }),
  }),
  text: new ol.style.Text({
    text: "Drag to modify",
    font: "12px Calibri,sans-serif",
    fill: new ol.style.Fill({
      color: "rgba(255, 255, 255, 1)",
    }),
    backgroundFill: new ol.style.Fill({
      color: "rgba(0, 0, 0, 0.7)",
    }),
    padding: [2, 2, 2, 2],
    textAlign: "left",
    offsetX: 15,
  }),
});

const segmentStyle = new ol.style.Style({
  text: new ol.style.Text({
    font: "12px Calibri,sans-serif",
    fill: new ol.style.Fill({
      color: "rgba(255, 255, 255, 1)",
    }),
    backgroundFill: new ol.style.Fill({
      color: "rgba(0, 0, 0, 0.4)",
    }),
    padding: [2, 2, 2, 2],
    textBaseline: "bottom",
    offsetY: -12,
  }),
  image: new ol.style.RegularShape({
    radius: 6,
    points: 3,
    angle: Math.PI,
    displacement: [0, 8],
    fill: new ol.style.Fill({
      color: "rgba(0, 0, 0, 0.4)",
    }),
  }),
});

// Define additional styles for Point and Circle
const pointStyle = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 6,
    fill: new ol.style.Fill({
      color: "rgba(255, 0, 0, 0.8)", // Red color for points
    }),
    stroke: new ol.style.Stroke({
      color: "rgba(255, 255, 255, 1)",
      width: 2,
    }),
  }),
});

const circleStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: "rgba(0, 128, 255, 0.2)", // Blue color for circle fill
  }),
  stroke: new ol.style.Stroke({
    color: "rgba(0, 0, 255, 0.7)", // Dark blue color for circle border
    width: 2,
  }),
});

const showSegments = true;
const segmentStyles = [segmentStyle];

const formatLength = function (line) {
  const length = ol.sphere.getLength(line, {
    projection: mapView.getProjection(),
  });
  let output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + " km";
  } else {
    output = Math.round(length * 100) / 100 + " m";
  }
  return output;
};

const formatArea = function (polygon) {
  const area = ol.sphere.getArea(polygon, {
    projection: mapView.getProjection(),
  });
  let output;
  if (area > 100000000) {
    output =
      Math.round((area / 1000000) * 100) / 100 +
      " " +
      "km²" +
      " Or " +
      (Math.round(area * 100) / 100 + " " + "m²");
  } else {
    output = Math.round(area * 100) / 100 + " m\xB2";
  }
  areaInput.value = output.split(" ")[0];
  return output;
};

const raster = new ol.layer.Tile({
  source: new ol.source.OSM(),
  visible: false,
});

const source = new ol.source.Vector();

const modify = new ol.interaction.Modify({
  source: source,
  style: modifyStyle,
});

let tipPoint;

function styleFunction(feature, segments, drawType, tip) {
  const radiusTextStyle = new ol.style.Style({
    text: new ol.style.Text({
      font: "12px Calibri,sans-serif",
      fill: new ol.style.Fill({
        color: "rgba(255, 255, 255, 1)",
      }),
      backgroundFill: new ol.style.Fill({
        color: "rgba(0, 0, 0, 0.7)",
      }),
      padding: [2, 2, 2, 2],
      textAlign: "left",
      offsetX: 15,
    }),
  });

  const styles = [];
  const geometry = feature.getGeometry();
  const type = geometry.getType();
  let point, label, line, radius;

  if (!drawType || drawType === type || type === "Point") {
    styles.push(style);

    if (type === "Polygon") {
      point = geometry.getInteriorPoint();
      label = formatArea(geometry);
      line = new ol.geom.LineString(geometry.getCoordinates()[0]);
    } else if (type === "LineString") {
      point = new ol.geom.Point(geometry.getLastCoordinate());
      label = formatLength(geometry);
      line = geometry;
    } else if (type === "Point") {
      styles.push(pointStyle);
      label = "";
    } else if (type === "Circle") {
      styles.push(circleStyle);
      radius = formatRadius(geometry);

      // Create a new circle geometry for styling
      const circleGeometry = new ol.geom.Circle(
        geometry.getCenter(),
        geometry.getRadius()
      );
      circleStyle.setGeometry(circleGeometry);
    }
  }

  if (segments && (line || radius)) {
    let count = 0;

    if (line) {
      line.forEachSegment(function (a, b) {
        const segment = new ol.geom.LineString([a, b]);
        const label = formatLength(segment);

        if (segmentStyles.length - 1 < count) {
          segmentStyles.push(segmentStyle.clone());
        }

        const segmentPoint = new ol.geom.Point(segment.getCoordinateAt(0.5));
        segmentStyles[count].setGeometry(segmentPoint);
        segmentStyles[count].getText().setText(label);
        styles.push(segmentStyles[count]);
        count++;
      });
    } else if (radius) {
      const label = formatRadiusLine(radius);
      const radiusLine = new ol.geom.LineString([
        geometry.getCenter(),
        geometry.getLastCoordinate(),
      ]);

      segmentStyle.getText().setText(label);
      styles.push(segmentStyle);
    }
  }

  if (label) {
    labelStyle.setGeometry(point);
    labelStyle.getText().setText(label);
    styles.push(labelStyle);
  }

  if (
    tip &&
    type === "Point" &&
    !modify.getOverlay().getSource().getFeatures().length
  ) {
    tipPoint = geometry;
    tipStyle.getText().setText(tip);
    styles.push(tipStyle);
  }

  return styles;
}

function formatRadiusLine(radius) {
  return "Radius: " + formatLength(radius);
}

function formatRadius(circle) {
  const radius = circle.getRadius();
  let output;

  if (radius > 1000) {
    output = Math.round(radius / 1000) + " km";
  } else {
    output = Math.round(radius) + " m";
  }

  return output;
}

const vector = new ol.layer.Vector({
  source: source,
  style: function (feature) {
    return styleFunction(feature, true); // Always show segment lengths
  },
});

map.addLayer(raster);
map.addLayer(vector);

map.addInteraction(modify);

let draw; // global so we can remove it later

function addInteraction(type) {
  const drawType = type;
  const activeTip = "" + (drawType === "Polygon" ? "polygon" : "line");
  const idleTip = "";
  let tip = idleTip;
  draw = new ol.interaction.Draw({
    source: source,
    type: drawType,
    style: function (feature) {
      return styleFunction(feature, showSegments.checked, drawType, tip);
    },
  });

  draw.on("drawstart", function () {
    if (clearPrevious.checked) {
      source.clear();
    }
    modify.setActive(false);
    tip = activeTip;
  });

  draw.on("drawend", function (event) {
    modifyStyle.setGeometry(tipPoint);
    modify.setActive(true);
    map.once("pointermove", function () {
      modifyStyle.setGeometry();
    });
    tip = idleTip;

    var geometry = event.feature.getGeometry();

    if (geometry instanceof ol.geom.LineString) {
      var lengthOutput = formatLength(geometry);
      document.getElementById("lengthResult").textContent =
        "Total Distance Covered: " + lengthOutput;

      document.getElementById("areaResult").textContent = "";
    } else if (geometry instanceof ol.geom.Polygon) {
      var areaOutput = formatArea(geometry);
      document.getElementById("areaResult").textContent =
        "Total Area Covered: " + areaOutput;

      document.getElementById("lengthResult").textContent = "";
    }
  });

  modify.setActive(true);
  map.addInteraction(draw);
}

// Modify the type change event to use the selected type
function changeMeasurementType(type) {
  map.removeInteraction(draw);
  addInteraction(type);
}

// Function to modify the selected feature
function modifySelectedFeature() {
  modify.setActive(true);
}

// Function to clear the selected feature
function clearSelectedFeature() {
  modify.setActive(false);
  source.clear();
}

// Initialize undo/redo stacks
const undoStack = [];
const redoStack = [];

// Function to push the current state to the undo stack
function pushToUndoStack(geometry) {
  undoStack.push(geometry.clone());
  redoStack.length = 0; // Clear redo stack when a new modification is made
}

// Add modify end event listener to push changes to undo stack
modify.on("modifyend", function (event) {
  const features = event.features.getArray();
  const geometry = features[0].getGeometry();
  pushToUndoStack(geometry);
});

// Function to undo the last modification
function undo() {
  if (undoStack.length > 0) {
    const geometry = undoStack.pop();
    redoStack.push(geometry.clone());

    const feature = new ol.Feature(geometry);
    source.clear();
    source.addFeature(feature);
  }
}

// Function to redo the undone modification
function redo() {
  if (redoStack.length > 0) {
    const geometry = redoStack.pop();
    undoStack.push(geometry.clone());

    const feature = new ol.Feature(geometry);
    source.clear();
    source.addFeature(feature);
  }
}

// Add click event listeners to the Undo and Redo buttons
document.getElementById("undoBtn").addEventListener("click", function () {
  undo();
});

document.getElementById("redoBtn").addEventListener("click", function () {
  redo();
});

// *****************************************************

//TOOLBAR TOOLBAR CONTROLS
var toolbarDivElement = document.createElement("div");
toolbarDivElement.className = "toolbarDiv";

// HOME TOOLBAR
var homeButton = document.createElement("button");
homeButton.innerHTML =
  '<img src="/resources/images/home.svg" alt="" class="myImg" />';
homeButton.className = "myButton";
homeButton.title = "Home";

var homeElement = document.createElement("div");
homeElement.className = "homeButtonDiv";
homeElement.appendChild(homeButton);
toolbarDivElement.appendChild(homeElement);

homeButton.addEventListener("click", () => {
  location.href = "/pages/map.html";
});

//ZOOM-IN TOOLBAR
var zoomInInteraction = new ol.interaction.DragBox();

zoomInInteraction.on("boxend", function () {
  var zoomInExtent = zoomInInteraction.getGeometry().getExtent();
  map.getView().fit(zoomInExtent);
});

var ziButton = document.createElement("button");
ziButton.innerHTML =
  '<img src="/resources/images/zoom_in.svg" alt="" class="myImg" />';
ziButton.className = "myButton";
ziButton.id = "ziButton";
ziButton.title = "Zoom In";

var ziElement = document.createElement("div");
ziElement.className = "myButtonDiv";
ziElement.appendChild(ziButton);
toolbarDivElement.appendChild(ziElement);

var zoomInFlag = false;
ziButton.addEventListener("click", () => {
  ziButton.classList.toggle("clicked");
  zoomInFlag = !zoomInFlag;
  if (zoomInFlag) {
    document.getElementById("map").style.cursor = "zoom-in";
    map.addInteraction(zoomInInteraction);
  } else {
    map.removeInteraction(zoomInInteraction);
    document.getElementById("map").style.cursor = "default";
  }
});

// ZOOM-OUT TOOLBAR
var zoomOutInteraction = new ol.interaction.DragBox();

zoomOutInteraction.on("boxend", function () {
  var zoomOutExtent = zoomOutInteraction.getGeometry().getExtent();
  map.getView().setCenter(ol.extent.getCenter(zoomOutExtent));

  mapView.setZoom(mapView.getZoom() - 1);
});

var zoButton = document.createElement("button");
zoButton.innerHTML =
  '<img src="/resources/images/zoom_out.svg" alt="" class="myImg" />';
zoButton.className = "myButton";
zoButton.id = "zoButtonDiv";
zoButton.title = "Zoom Out";

var zoElement = document.createElement("div");
zoElement.className = "myButtonDiv";
zoElement.appendChild(zoButton);
toolbarDivElement.appendChild(zoElement);

var zoomOutFlag = false;
zoButton.addEventListener("click", () => {
  zoButton.classList.toggle("clicked");
  zoomOutFlag = !zoomOutFlag;
  if (zoomOutFlag) {
    document.getElementById("map").style.cursor = "zoom-out";
    map.addInteraction(zoomOutInteraction);
  } else {
    map.removeInteraction(zoomOutInteraction);
    document.getElementById("map").style.cursor = "default";
  }
});

//ADDING ALL TOOLBAR CONTROLS
var allControl = new ol.control.Control({
  element: toolbarDivElement,
});
map.addControl(allControl);

// // POINT MARKER TOOLBAR
// var pointMarkerFlag = false;
// var pointMarkerButton = document.createElement("button");
// pointMarkerButton.innerHTML =
//   '<img src="/resources/images/map.png" alt="" class="myImg" />';
// pointMarkerButton.className = "myButton";
// pointMarkerButton.id = "pointMarkerButton";
// pointMarkerButton.title = "Place Point Marker";

// var pointMarkerElement = document.createElement("div");
// pointMarkerElement.className = "myButtonDiv";
// pointMarkerElement.appendChild(pointMarkerButton);
// toolbarDivElement.appendChild(pointMarkerElement);

// var draw,
//   modify,
//   undoStack = [],
//   redoStack = [];

// function addPointMarker(coordinates) {
//   var point = new ol.Feature(new ol.geom.Point(coordinates));

//   var pointStyle = new ol.style.Style({
//     image: new ol.style.Circle({
//       radius: 9,
//       fill: new ol.style.Fill({
//         color: [0, 153, 255, 1],
//       }),
//       stroke: new ol.style.Stroke({
//         color: [255, 255, 255, 1],
//         width: 5,
//       }),
//     }),
//   });

//   point.setStyle(pointStyle);
//   source.addFeature(point);

//   // Push the point to the undo stack
//   undoStack.push(point);

//   return point;
// }

// function undo() {
//   if (undoStack.length > 0) {
//     var lastFeature = undoStack.pop();
//     redoStack.push(lastFeature);
//     source.removeFeature(lastFeature);
//   }
// }

// function redo() {
//   if (redoStack.length > 0) {
//     var lastFeature = redoStack.pop();
//     undoStack.push(lastFeature);
//     source.addFeature(lastFeature);
//   }
// }

// pointMarkerButton.addEventListener("click", () => {
//   pointMarkerFlag = !pointMarkerFlag;
//   pointMarkerButton.classList.toggle("clicked", pointMarkerFlag);
//   document.getElementById("map").style.cursor = pointMarkerFlag
//     ? "crosshair"
//     : "default";

//   if (pointMarkerFlag) {
//     map.removeInteraction(draw);
//     map.removeInteraction(modify);
//     undoStack = [];
//     redoStack = [];
//   } else {
//     map.removeInteraction(draw);
//     source.clear();
//     const elements = document.getElementsByClassName(
//       "ol-tooltip ol-tooltip-static"
//     );
//     while (elements.length > 0) elements[0].remove();
//   }
// });

// map.on("click", function (event) {
//   if (pointMarkerFlag) {
//     var coordinates = event.coordinate;
//     var point = addPointMarker(coordinates);

//     // Make the point modifiable after adding
//     modify = new ol.interaction.Modify({
//       features: new ol.Collection([point]),
//       deleteCondition: function (event) {
//         return (
//           ol.events.condition.shiftKeyOnly(event) &&
//           ol.events.condition.singleClick(event)
//         );
//       },
//     });
//     map.addInteraction(modify);
//   }
// });

// // UNDO BUTTON
// var undoButton = document.createElement("button");
// undoButton.innerHTML =
//   '<img src="/resources/images/undo.svg" alt="" class="myImg" />';
// undoButton.className = "myButton";
// undoButton.title = "Undo";

// var undoElement = document.createElement("div");
// undoElement.className = "undoButtonDiv";
// undoElement.appendChild(undoButton);
// toolbarDivElement.appendChild(undoElement);

// undoButton.addEventListener("click", undo);

// // REDO BUTTON
// var redoButton = document.createElement("button");
// redoButton.innerHTML =
//   '<img src="/resources/images/redo.svg" alt="" class="myImg" />';
// redoButton.className = "myButton";
// redoButton.title = "Redo";

// var redoElement = document.createElement("div");
// redoElement.className = "redoButtonDiv";
// redoElement.appendChild(redoButton);
// toolbarDivElement.appendChild(redoElement);

// redoButton.addEventListener("click", redo);

// // DISTANCE AND AREA MEASURE
// var lengthButton = document.createElement("button");
// lengthButton.innerHTML =
//   '<img src="/resources/images/measure-length.png" alt="" class="myImg" />';
// lengthButton.className = "myButton";
// lengthButton.id = "lengthButton";
// lengthButton.title = "Measure Length";

// var lengthElement = document.createElement("div");
// lengthElement.className = "myButtonDiv";
// lengthElement.appendChild(lengthButton);
// toolbarDivElement.appendChild(lengthElement);

// var lengthFlag = false;
// lengthButton.addEventListener("click", () => {
//   // disableOtherInteraction('lengthButton');
//   lengthButton.classList.toggle("clicked");
//   lengthFlag = !lengthFlag;
//   document.getElementById("map").style.cursor = "default";
//   if (lengthFlag) {
//     map.removeInteraction(draw);
//     addInteraction("LineString");
//   } else {
//     map.removeInteraction(draw);
//     source.clear();
//     const elements = document.getElementsByClassName(
//       "ol-tooltip ol-tooltip-static"
//     );
//     while (elements.length > 0) elements[0].remove();
//   }
// });

// var areaButton = document.createElement("button");
// areaButton.innerHTML =
//   '<img src="/resources/images/measure-area-svgrepo-com.svg" alt="" class="myImg" />';
// areaButton.className = "myButton";
// areaButton.id = "areaButton";
// areaButton.title = "Measure Area";

// var areaElement = document.createElement("div");
// areaElement.className = "myButtonDiv";
// areaElement.appendChild(areaButton);
// toolbarDivElement.appendChild(areaElement);

// var areaFlag = false;
// areaButton.addEventListener("click", () => {
//   // disableOtherInteraction('areaButton');
//   areaButton.classList.toggle("clicked");
//   areaFlag = !areaFlag;
//   document.getElementById("map").style.cursor = "default";
//   if (areaFlag) {
//     map.removeInteraction(draw);
//     addInteraction("Polygon");
//   } else {
//     map.removeInteraction(draw);
//     source.clear();
//     const elements = document.getElementsByClassName(
//       "ol-tooltip ol-tooltip-static"
//     );
//     while (elements.length > 0) elements[0].remove();
//   }
// });

// /**
//  * Message to show when the user is drawing a polygon.
//  * @type {string}
//  */
// var continuePolygonMsg = "Click to continue polygon, Double click to complete";

// /**
//  * Message to show when the user is drawing a line.
//  * @type {string}
//  */
// var continueLineMsg = "Click to continue line, Double click to complete";

// var draw; // global so we can remove it later

// var source = new ol.source.Vector();

// var vector = new ol.layer.Vector({
//   source: source,
//   style: new ol.style.Style({
//     fill: new ol.style.Fill({
//       color: "rgba(255, 255, 255, 0.2)",
//     }),
//     stroke: new ol.style.Stroke({
//       color: "#0e97fa",
//       width: 4,
//     }),
//     image: new ol.style.Circle({
//       radius: 4,
//       fill: new ol.style.Fill({
//         color: "#0e97fa",
//       }),
//     }),
//   }),
// });

// map.addLayer(vector);

// var interactionStyle = new ol.style.Style({
//   fill: new ol.style.Fill({
//     color: "rgba(200, 200, 200, 0.6)",
//   }),
//   stroke: new ol.style.Stroke({
//     color: "#0e97fa)",
//     lineDash: [10, 10],
//     width: 2,
//   }),
//   image: new ol.style.Circle({
//     radius: 4,
//     stroke: new ol.style.Stroke({
//       color: "rgba(0, 0, 0, 0.7)",
//     }),
//     fill: new ol.style.Fill({
//       color: "rgba(255, 255, 255, 0.2)",
//     }),
//   }),
// });

// function addInteraction(intType) {
//   draw = new ol.interaction.Draw({
//     source: source,
//     type: intType,
//     style: interactionStyle,
//   });
//   map.addInteraction(draw);

//   createMeasureTooltip();
//   createHelpTooltip();

//   /**
//    * Currently drawn feature.
//    * @type {import("../src/ol/Feature.js").default}
//    */
//   var sketch;

//   /**
//    * Handle pointer move.
//    * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
//    */
//   var pointerMoveHandler = function (evt) {
//     if (evt.dragging) {
//       return;
//     }
//     /** @type {string} */
//     var helpMsg = "Click to start drawing";

//     if (sketch) {
//       var geom = sketch.getGeometry();
//       if (geom instanceof ol.geom.Polygon) {
//         helpMsg = continuePolygonMsg;
//       } else if (geom instanceof ol.geom.LineString) {
//         helpMsg = continueLineMsg;
//       }
//     }

//     helpTooltipElement.innerHTML = helpMsg;
//     helpTooltip.setPosition(evt.coordinate);

//     helpTooltipElement.classList.remove("hidden");
//   };

//   map.on("pointermove", pointerMoveHandler);

//   // var listener;
//   draw.on("drawstart", function (evt) {
//     // set sketch
//     sketch = evt.feature;

//     /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
//     var tooltipCoord = evt.coordinate;

//     //listener = sketch.getGeometry().on('change', function (evt) {
//     sketch.getGeometry().on("change", function (evt) {
//       var geom = evt.target;
//       var output;
//       if (geom instanceof ol.geom.Polygon) {
//         output = formatArea(geom);
//         tooltipCoord = geom.getInteriorPoint().getCoordinates();
//       } else if (geom instanceof ol.geom.LineString) {
//         output = formatLength(geom);
//         tooltipCoord = geom.getLastCoordinate();
//       }
//       measureTooltipElement.innerHTML = output;
//       measureTooltip.setPosition(tooltipCoord);
//     });
//   });

//   draw.on("drawend", function (event) {
//     measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
//     measureTooltip.setOffset([0, -7]);
//     sketch = null;
//     measureTooltipElement = null;
//     createMeasureTooltip();

// var geometry = event.feature.getGeometry();

// if (geometry instanceof ol.geom.LineString) {
//   var lengthOutput = formatLength(geometry);
//   document.getElementById("lengthResult").textContent =
//     "Total Distance Covered: " + lengthOutput;

//   document.getElementById("areaResult").textContent = "";
// } else if (geometry instanceof ol.geom.Polygon) {
//   var areaOutput = formatArea(geometry);
//   document.getElementById("areaResult").textContent =
//     "Total Area Covered: " + areaOutput;

//   document.getElementById("lengthResult").textContent = "";
// }
//   });
// }

// /**
//  * The help tooltip element.
//  * @type {HTMLElement}
//  */
// var helpTooltipElement;

// /**
//  * Overlay to show the help messages.
//  * @type {Overlay}
//  */
// var helpTooltip;

// /**
//  * Creates a new help tooltip
//  */
// function createHelpTooltip() {
//   if (helpTooltipElement) {
//     helpTooltipElement.parentNode.removeChild(helpTooltipElement);
//   }
//   helpTooltipElement = document.createElement("div");
//   helpTooltipElement.className = "ol-tooltip hidden";
//   helpTooltip = new ol.Overlay({
//     element: helpTooltipElement,
//     offset: [15, 0],
//     positioning: "center-left",
//   });
//   map.addOverlay(helpTooltip);
// }

// //  map.getViewport().addEventListener('mouseout', function () {
// //    helpTooltipElement.classList.add('hidden');
// //  });

// /**
//  * The measure tooltip element.
//  * @type {HTMLElement}
//  */
// var measureTooltipElement;

// /**
//  * Overlay to show the measurement.
//  * @type {Overlay}
//  */
// var measureTooltip;

// /**
//  * Creates a new measure tooltip
//  */

// function createMeasureTooltip() {
//   if (measureTooltipElement) {
//     measureTooltipElement.parentNode.removeChild(measureTooltipElement);
//   }
//   measureTooltipElement = document.createElement("div");
//   measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
//   measureTooltip = new ol.Overlay({
//     element: measureTooltipElement,
//     offset: [0, -15],
//     positioning: "bottom-center",
//   });
//   map.addOverlay(measureTooltip);
// }

// /**
//  * Format length output.
//  * @param {LineString} line The line.
//  * @return {string} The formatted length.
//  */
// var formatLength = function (line) {
//   var length = ol.sphere.getLength(line);
//   var output;
//   if (length > 100) {
//     output = Math.round((length / 1000) * 100) / 100 + " " + "km";
//   } else {
//     output = Math.round(length * 100) / 100 + " " + "m";
//   }
//   return output;
// };

// /**
//  * Format area output.
//  * @param {Polygon} polygon The polygon.
//  * @return {string} Formatted area.
//  */

// var formatArea = function (polygon) {
//   var area = ol.sphere.getArea(polygon);
//   var output;
// if (area > 100000000) {
//   output =
//     Math.round((area / 1000000) * 100) / 100 +
//     " " +
//     "km²" +
//     " Or " +
//     (Math.round(area * 100) / 100 + " " + "m²");
//   } else {
//     output = Math.round(area * 100) / 100 + " " + "m²";
//   }
//   areaInput.value = output.split(" ")[0];
//   return output;
// };

//------------------------------------------
const areaInput = document.getElementById("area");
const denseSelect = document.getElementById("dense");

denseSelect.addEventListener("change", convertAndDisplay);
areaInput.addEventListener("input", convertAndDisplay);

function convertAndDisplay() {
  const area = parseFloat(areaInput.value) || 0;
  const state = denseSelect.value;

  let plotSize;

  switch (state) {
    default:
      //plotSize = 15 * 30; // High Density Area
      break;

    case "hidens":
      plotSize = 15 * 30; // High Density Area
      break;

    case "medens":
      plotSize = 20 * 30; // Medium Density Area
      break;

    case "lodens":
      plotSize = 30 * 40; // Low Density Area
      break;
  }

  const acres = area * 0.000247105;
  const hectares = area * 0.0001;
  const plotsInSquareFeet = area / plotSize;

  const areaInMeters = area.toFixed(2) + " m²";
  const areaInFeet = (area * 10.7639).toFixed(2) + " ft²";

  let output;

  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + " km²";
  } else {
    output = areaInMeters;
  }

  const resultHTML = `
    <table>
      <tr>
        <th>Property</th>
        <th>Value</th>
      </tr>
      <tr>
        <td>Area</td>
        <td>${output}</td>
      </tr>
      <tr>
        <td>Acres</td>
        <td>${acres.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Hectares</td>
        <td>${hectares.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Plots in Sq. ft</td>
        <td>${plotsInSquareFeet.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Dimensions</td>
        <td>${getPlotDimensions(state)}</td>
      </tr>
    </table>
  `;

  document.getElementById("result").innerHTML = resultHTML;
}

function getPlotDimensions(state) {
  switch (state) {
    default:
      return "Select Plot Density";
    case "hidens":
      return "15 X 30m"; // High Density Area
    case "medens":
      return "20 X 30m"; // Medium Density Area
    case "lodens":
      return "30 X 40m"; // Low Density Area
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const areaInput = document.getElementById("area");
  const denseSelect = document.getElementById("dense");

  // Removed the pasteFromClipboard function from the event listener
  denseSelect.addEventListener("change", convertAndDisplay);

  // Added event listener for input changes in the areaInput
  areaInput.addEventListener("input", convertAndDisplay);
});

//------------------------------------------
// end : Length and Area Measurement Control

//COORDINATE CALCULATOR------------------//
function calculateArea() {
  const coordinatesInput = document
    .getElementById("coordinateInput")
    .value.trim();

  // Check if input is not empty
  if (coordinatesInput === "") {
    // alert("Please enter coordinates.");
    return;
  }

  const coordinatePairs = coordinatesInput.split(/\n|\r\n/);

  const latitudes = [];
  const longitudes = [];

  coordinatePairs.forEach((pair) => {
    const [latInput, lonInput] = pair.split(",");

    const lat = parseFloat(latInput);
    const lon = parseFloat(lonInput);

    // Check if inputs are valid numbers
    if (isNaN(lat) || isNaN(lon)) {
      // alert("Please enter valid numbers for coordinates.");
      return;
    }

    latitudes.push(lat);
    longitudes.push(lon);
  });

  // Calculate the area (Assuming a convex polygon)
  const areaSquareDegrees = calculatePolygonArea(latitudes, longitudes);

  // Convert square degrees to square kilometers, square meters, and square feet
  const conversionFactorKm2 = 111; // Approximate conversion factor for square kilometers
  const conversionFactorM2 = 111000; // Approximate conversion factor for square meters
  const conversionFactorFt2 = 364000; // Approximate conversion factor for square feet

  const areaSquareKm = areaSquareDegrees / conversionFactorKm2;
  const areaSquareM = areaSquareDegrees * conversionFactorM2;
  const areaSquareFt = areaSquareDegrees * conversionFactorFt2;

  // Calculate the total distance between consecutive coordinates
  const totalDistance = calculateTotalDistance(latitudes, longitudes);

  // Convert distance to kilometers, meters, and feet
  const conversionFactorKm = 1; // 1 kilometer is 1 kilometer
  const conversionFactorM = 1000; // 1 kilometer is 1000 meters
  const conversionFactorFt = 3280.84; // 1 kilometer is approximately 3280.84 feet

  const totalDistanceKm = totalDistance / conversionFactorKm;
  const totalDistanceM = totalDistance * conversionFactorM;
  const totalDistanceFt = totalDistance * conversionFactorFt;

  // Create a table to display the results
  const resultElement = document.getElementById("result1");
  resultElement.innerHTML = `
    <table>
      <tr>
        <th>Measurement</th>
        <th>Result</th>
      </tr>
      <tr>
        <td>Area (Sq. Km)</td>
        <td>${areaSquareKm.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Area (Sq. M)</td>
        <td>${areaSquareM.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Area (Sq. Ft)</td>
        <td>${areaSquareFt.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Distance (Km)</td>
        <td>${totalDistanceKm.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Distance (M)</td>
        <td>${totalDistanceM.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Distance (Ft)</td>
        <td>${totalDistanceFt.toFixed(2)}</td>
      </tr>
    </table>`;
}

function calculatePolygonArea(latitudes, longitudes) {
  const numPoints = latitudes.length;

  let area = 0;
  for (let i = 0; i < numPoints; i++) {
    const j = (i + 1) % numPoints;
    area += latitudes[i] * longitudes[j];
    area -= latitudes[j] * longitudes[i];
  }

  area = Math.abs(area) / 2;
  return area;
}

function calculateTotalDistance(latitudes, longitudes) {
  let totalDistance = 0;
  for (let i = 0; i < latitudes.length - 1; i++) {
    totalDistance += calculateSphericalDistance(
      latitudes[i],
      longitudes[i],
      latitudes[i + 1],
      longitudes[i + 1]
    );
  }
  return totalDistance;
}

function calculateSphericalDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}
