// --------------VIEW INITIALIZATION----------------//
var mapView = new ol.View({
  center: ol.proj.fromLonLat([7.489064, 9.058505]),
  zoom: 12,
});
// --------------VIEW INITIALIZATION----------------//

// --------------MAP INITIALIZATION----------------//
var map = new ol.Map({
  target: "map",
  view: mapView,
  controls: [
    new ol.control.Attribution(),
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
      steps: 2,
      text: true,
      minWidth: 50,
    }),

    new ol.control.LayerSwitcher(),
    new ol.control.ZoomSlider(),
  ],
});
// --------------MAP INITIALIZATION----------------//

//----------------------LAYERS-----------------------//
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

// Google Maps layer ----- AIzaSyBBe7xyfVIq6EmKffOupLL50mniuvRyT1A----
var googleMapsApiKey = "YOUR_GOOGLE_MAPS_API_KEY";

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

// // Create a noTile layer with an empty source
// var noTileLayer = new ol.layer.Tile({
//   title: "NoLayer",
//   type: "base",
//   visible: false, // Set to true if you want it to be initially visible
//   source: new ol.source.TileWMS({
//     url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
//     // This is a transparent 1x1 pixel GIF, acting as an empty source
//   }),
// });

var baseGroup = new ol.layer.Group({
  title: "Base Maps",
  fold: true,
  layers: [
    // noTileLayer,
    osmTile,
    mapboxTile,
    bingStreetsWithLabels,
    bingSatellite,
    googleMapsLayer,
    googleHybridLayer,
  ],
});
map.addLayer(baseGroup);
//----------------------LAYERS-----------------------//

// -------------------OVERLAY------------------------//
var statesGeoJSONUrl = "/resources/overlays/ngastates.geojson";
var lgasGeoJSONUrl = "/resources/overlays/ngalgas.geojson";
var wardsGeoJSONUrl = "/resources/overlays/ngawards.geojson";

// Function to create a GeoJSON layer
function createGeoJSONLayer(geoJSONUrl, title, adminLevel) {
  return new ol.layer.Vector({
    title: title,
    source: new ol.source.Vector({
      url: geoJSONUrl,
      format: new ol.format.GeoJSON(),
    }),
    style: function (feature) {
      var featureAdminLevel = feature.get("admin_level");
      var fillColor, strokeColor;

      // Define styles based on the admin level
      switch (featureAdminLevel) {
        case "state":
          fillColor = "rgba(255, 0, 0, 0.6)";
          strokeColor = "#FF0000";
          break;
        case "lga":
          fillColor = "rgba(0, 255, 0, 0.6)";
          strokeColor = "#00FF00";
          break;
        case "ward":
          fillColor = "rgba(0, 0, 255, 0.6)";
          strokeColor = "#0000FF";
          break;
        default:
          fillColor = "transparent";
          strokeColor = "#319FD3";
      }

      return new ol.style.Style({
        fill: new ol.style.Fill({
          color: fillColor,
        }),
        stroke: new ol.style.Stroke({
          color: strokeColor,
          width: 2,
        }),
      });
    },
  });
}

// Create GeoJSON layers for states, LGAs, and wards
var statesLayer = createGeoJSONLayer(
  statesGeoJSONUrl,
  "Nigeria States",
  "state"
);
var lgasLayer = createGeoJSONLayer(lgasGeoJSONUrl, "Nigeria LGAs", "lga");
var wardsLayer = createGeoJSONLayer(wardsGeoJSONUrl, "Nigeria Wards", "ward");

// Create GeoJSON layers for states, LGAs, and wards
var statesLayer = createGeoJSONLayer(
  statesGeoJSONUrl,
  "Nigeria States",
  "state"
);
statesLayer.setVisible(false); // Set to false to hide by default

var lgasLayer = createGeoJSONLayer(lgasGeoJSONUrl, "Nigeria LGAs", "lga");
lgasLayer.setVisible(false); // Set to false to hide by default

var wardsLayer = createGeoJSONLayer(wardsGeoJSONUrl, "Nigeria Wards", "ward");
wardsLayer.setVisible(false); // Set to false to hide by default

// Add GeoJSON layers to the map
map.addLayer(statesLayer);
map.addLayer(lgasLayer);
map.addLayer(wardsLayer);
// -------------------OVERLAY------------------------//

//------------------LIVE LOCATION-------------------//
var geolocation = new ol.Geolocation({
  trackingOptions: {
    enableHighAccuracy: true,
  },
  projection: map.getView().getProjection(),
});

var positionFeature = new ol.Feature();
positionFeature.setStyle(
  new ol.style.Style({
    image: new ol.style.Icon({
      src: "/resources/images/marker.svg",
      anchor: [0.5, 1],
      scale: 0.03,
    }),
  })
);

var currentPositionLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [positionFeature],
  }),
});

map.addLayer(currentPositionLayer);

function updateLiveLocation() {
  var coordinates = geolocation.getPosition();
  positionFeature.setGeometry(
    coordinates ? new ol.geom.Point(coordinates) : null
  );
  map.getView().setCenter(coordinates);
  map.getView().setZoom(18);
}

var isTracking = false;
var intervalAutolocate;

$("#livelocation").on("click", function (event) {
  $("#livelocation").toggleClass("clicked");

  if ($("#livelocation").hasClass("clicked")) {
    isTracking = true;

    geolocation.setTracking(true);
    geolocation.once("change:position", function () {
      updateLiveLocation();
      intervalAutolocate = setInterval(updateLiveLocation, 10000);
    });

    // Disable map drag interaction
    map.getInteractions().forEach(function (interaction) {
      if (interaction instanceof ol.interaction.DragPan) {
        interaction.setActive(false);
      }
    });
  } else {
    isTracking = false;
    clearInterval(intervalAutolocate);
    geolocation.setTracking(false);
    positionFeature.setGeometry(null);

    // Enable map drag interaction
    map.getInteractions().forEach(function (interaction) {
      if (interaction instanceof ol.interaction.DragPan) {
        interaction.setActive(true);
      }
    });
  }
});

map.on("moveend", function (event) {
  if (isTracking && $("#livelocation").hasClass("clicked")) {
    // If tracking is active and the map is manually moved, stop tracking
    isTracking = false;
    clearInterval(intervalAutolocate);
    geolocation.setTracking(false);
    positionFeature.setGeometry(null);

    // Enable map drag interaction
    map.getInteractions().forEach(function (interaction) {
      if (interaction instanceof ol.interaction.DragPan) {
        interaction.setActive(true);
      }
    });

    // Update button state
    $("#livelocation").removeClass("clicked");
  }
});
//------------------LIVE LOCATION-------------------//

//-------------------------POPUP-------------------//
// Elements that make up the popup.
const container = document.getElementById("popup");
const content = document.getElementById("popup-content");
const closer = document.getElementById("popup-closer");
const toggleBtn = document.getElementById("popup-toggle-btn");

// Create an overlay to anchor the popup to the map.
const overlay = new ol.Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

// Add a click handler to hide the popup.
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

// Add the overlay to the map
map.addOverlay(overlay);

// Variable to track if the popup interaction is active
let popupInteractionActive = false;

// Function to format coordinates as a string (Latitude, Longitude)
function formatLatLon(coordinate) {
  const lonLat = ol.proj.toLonLat(coordinate);
  return lonLat
    .map((coord) => coord.toFixed(6))
    .reverse()
    .join(", ");
}

// Function to show popup at a specific coordinate
function showPopup(coordinate) {
  const latLonString = formatLatLon(coordinate);
  const contentHTML =
    "<p>You clicked here:</p><code id='coordCode'>" +
    latLonString +
    "</code><button onclick='copyToClipboard()'>Copy</button>";
  content.innerHTML = contentHTML;
  overlay.setPosition(coordinate);
}

// Function to copy the coordinate to the clipboard
function copyToClipboard() {
  const coordCode = document.getElementById("coordCode");
  const textArea = document.createElement("textarea");
  textArea.value = coordCode.textContent;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}

// Function to handle map click events
function handleMapClick(event) {
  if (popupInteractionActive) {
    const coordinate = event.coordinate;
    showPopup(coordinate);
  }
}

// Add a click event to the map
map.on("click", handleMapClick);

// Function to toggle the entire process
function togglePopupInteraction() {
  popupInteractionActive = !popupInteractionActive;
  if (!popupInteractionActive) {
    // Deactivate the popup interaction
    map.un("click", handleMapClick);
    overlay.setPosition(undefined);
  }
}

// Toggle Button Click Event
toggleBtn.onclick = function () {
  togglePopupInteraction();
};
//-------------------------POPUP-------------------//

//-----------------LOCATION SEARCH-----------------//
var bingApiKey =
  "AstqSWN2XWpS7yTd1GQ6mSp6ADE-IFOaLveo30y7PhE2iz7CDA8nvsvO-3YsEeXF";
var mapboxApiKey =
  "pk.eyJ1IjoiYWJ1YmFrYXJ0YW5rbzk5IiwiYSI6ImNra3dyNXc5aTBuYTUybm80bHpxNXM5NDMifQ.CTLplUINQxXlKFLh_ow2sg";
var locationInput = document.getElementById("inpt_search");
var suggestionsContainer = document.getElementById("suggestions-container");

document.addEventListener("DOMContentLoaded", function () {
  // Hide suggestions container on page load
  suggestionsContainer.style.display = "none";

  locationInput.addEventListener("input", function () {
    // Clear previous suggestions
    suggestionsContainer.innerHTML = "";

    var locationInputValue = locationInput.value;

    if (locationInputValue.trim() !== "") {
      // Display suggestions container if there's input
      suggestionsContainer.style.display = "block";

      Promise.all([
        getBingLocationsSuggestions(locationInputValue),
        getMapboxLocationsSuggestions(locationInputValue),
      ])
        .then(([bingSuggestions, mapboxSuggestions]) => {
          var allSuggestions = bingSuggestions.concat(mapboxSuggestions);

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
    } else {
      // Hide suggestions container if input is empty
      suggestionsContainer.style.display = "none";
    }
  });
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
//-----------------LOCATION SEARCH-----------------//

//----------------------COMPASS --------------------//
// Define an initial rotation value
let initialRotation = 0;

// Add a pointer interaction to handle rotation
const rotateInteraction = new ol.interaction.Pointer({
  handleDownEvent: function (event) {
    // Start tracking the rotation on pointer down
    this.rotationStart = map.getView().getRotation();
    this.anchor = event.coordinate;
    return true;
  },
  handleDragEvent: function (event) {
    // Calculate the new rotation during drag
    const dx = event.coordinate[0] - this.anchor[0];
    const dy = event.coordinate[1] - this.anchor[1];
    const deltaRotation = Math.atan2(dy, dx) - Math.atan2(0, 0);
    const newRotation = this.rotationStart - deltaRotation;

    // Set the new rotation to the view
    map.getView().setRotation(newRotation);

    return true;
  },
});

// Update the rotation icon based on the map rotation
map.on("postrender", function () {
  const rotateIcon = document.getElementById("rotateIcon");
  const rotation = map.getView().getRotation();
  rotateIcon.style.transform = `rotate(${rotation}rad)`;
});

// Add click event listener to the rotate control
const rotateControl = document.getElementById("rotateBtn");
rotateControl.addEventListener("click", toggleRotation);

// Toggle the rotation interaction
function toggleRotation() {
  if (map.getInteractions().getArray().includes(rotateInteraction)) {
    // If rotation interaction is active, set the rotation back to its initial state
    map.removeInteraction(rotateInteraction);
    map.getView().setRotation(0); // Reset the rotation
  } else {
    // If rotation interaction is not active, store the current rotation as initial
    initialRotation = map.getView().getRotation();
    map.addInteraction(rotateInteraction);
  }
}
//----------------------COMPASS -------------------//

//----------------FULL SCREEN CONTOL--------------------//
document.addEventListener("keydown", function (event) {
  if (event.key === "f" && (event.ctrlKey || event.metaKey)) {
    // Toggle fullscreen when Ctrl (or Cmd) + F is pressed
    toggleFullscreen();
  }
});

function toggleFullscreen() {
  var mapElement = document.getElementById("map");

  if (!document.fullscreenElement) {
    if (mapElement.requestFullscreen) {
      mapElement.requestFullscreen();
    } else if (mapElement.mozRequestFullScreen) {
      mapElement.mozRequestFullScreen();
    } else if (mapElement.webkitRequestFullscreen) {
      mapElement.webkitRequestFullscreen();
    } else if (mapElement.msRequestFullscreen) {
      mapElement.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}
//----------------FULL SCREEN CONTOL--------------------//

// ----------------ZOOM-IN & OUT------------------------//
// Define zoom interactions
var zoomInInteraction = new ol.interaction.DragBox();
var zoomOutInteraction = new ol.interaction.DragBox();

// Track whether interactions are active
var zoomInActive = false;
var zoomOutActive = false;

// Toggle Zoom In Interaction
function toggleZoomInInteraction() {
  if (!zoomInActive) {
    map.addInteraction(zoomInInteraction);
    zoomInInteraction.on("boxend", function () {
      var zoomInExtent = zoomInInteraction.getGeometry().getExtent();
      map.getView().fit(zoomInExtent);
    });
  } else {
    map.removeInteraction(zoomInInteraction);
  }
  zoomInActive = !zoomInActive;
}

// Toggle Zoom Out Interaction
function toggleZoomOutInteraction() {
  if (!zoomOutActive) {
    map.addInteraction(zoomOutInteraction);
    zoomOutInteraction.on("boxend", function () {
      var zoomOutExtent = zoomOutInteraction.getGeometry().getExtent();
      map.getView().setCenter(ol.extent.getCenter(zoomOutExtent));
      var mapView = map.getView();
      mapView.setZoom(mapView.getZoom() - 1);
    });
  } else {
    map.removeInteraction(zoomOutInteraction);
  }
  zoomOutActive = !zoomOutActive;
}
// ----------------ZOOM-IN & OUT------------------------//

//---POINT MARKER, DISTANCE AND AREA MEASUREMENTS---//
document.getElementById("lengthBtn").addEventListener("click", function () {
  changeMeasurementType("LineString");
});

document.getElementById("areaBtn").addEventListener("click", function () {
  changeMeasurementType("Polygon");
});

document.getElementById("pointBtn").addEventListener("click", function () {
  changeMeasurementType("Point");
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
    color: "blue",
    lineDash: [10, 10],
    width: 4,
  }),
  image: new ol.style.Circle({
    radius: 4,
    stroke: new ol.style.Stroke({
      color: "#0e97fa",
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

// Replace the existing pointStyle definition with the new customPointStyle
const pointStyle = new ol.style.Style({
  image: new ol.style.Icon({
    src: "/resources/images/marker.svg",
    anchor: [0.5, 1],
    scale: 0.03,
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
  const styles = [];
  const geometry = feature.getGeometry();
  const type = geometry.getType();
  let point, label, line;

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
    }
  }

  if (segments && line) {
    let count = 0;

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
  const activeTip = drawType === "Polygon" ? "polygon" : "line";
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

let activeDrawType = null;

function changeMeasurementType(type) {
  if (activeDrawType === type) {
    map.removeInteraction(draw);
    activeDrawType = null;
  } else {
    map.removeInteraction(draw);
    addInteraction(type);
    activeDrawType = type;
  }
}

function modifySelectedFeature() {
  modify.setActive(true);
}

function clearSelectedFeature() {
  modify.setActive(false);
  source.clear();
}
//---POINT MARKER, DISTANCE AND AREA MEASUREMENTS---//

//------------AUTO CONVERTER----------------------//
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
//------------AUTO CONVERTER----------------------//

//-------------COORDINATE CALCULATOR-------------------//
document
  .getElementById("coordinateInput")
  .addEventListener("input", function () {
    // Delay the execution to allow the user to finish typing
    clearTimeout(this.timer);
    this.timer = setTimeout(calculateArea, 500); // Adjust the delay as needed
  });

function calculateArea() {
  const coordinatesInput = document
    .getElementById("coordinateInput")
    .value.trim();

  // Check if input is not empty
  if (coordinatesInput === "") {
    // Clear the result if no coordinates are provided
    clearResults();
    return;
  }

  const coordinatePairs = coordinatesInput.split(/\n|\r\n/);

  if (coordinatePairs.length >= 2) {
    // Trigger the calculation functions
    const latitudes = [];
    const longitudes = [];

    coordinatePairs.forEach((pair) => {
      const [latInput, lonInput] = pair.split(",");
      const lat = parseFloat(latInput);
      const lon = parseFloat(lonInput);

      if (!isNaN(lat) && !isNaN(lon)) {
        latitudes.push(lat);
        longitudes.push(lon);
      }
    });

    // Calculate the total distance between consecutive coordinates
    const totalDistance = calculateTotalDistance(latitudes, longitudes);

    // Convert distance to kilometers, meters, and feet
    const conversionFactorKm = 1; // 1 kilometer is 1 kilometer
    const conversionFactorM = 1000; // 1 kilometer is 1000 meters
    const conversionFactorFt = 3280.84; // 1 kilometer is approximately 3280.84 feet

    const totalDistanceKm = totalDistance / conversionFactorKm;
    const totalDistanceM = totalDistance * conversionFactorM;
    const totalDistanceFt = totalDistance * conversionFactorFt;

    // Calculate the area using the provided code
    const areaOutput = calculatePolygonArea(latitudes, longitudes);
    const areaSquareKm = areaOutput / 1e6; // Convert square meters to square kilometers

    // Convert area to square meters and square feet
    const areaSquareM = areaOutput;
    const areaSquareFt = areaOutput * 10.7639; // Convert square meters to square feet

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
  } else {
    // Clear the result if less than two coordinates are provided
    clearResults();
  }
}

function clearResults() {
  // Clear the results when there are less than two coordinates
  const resultElement = document.getElementById("result1");
  resultElement.innerHTML = "";
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

function calculatePolygonArea(latitudes, longitudes) {
  const coordinates = latitudes.map((lat, index) => [longitudes[index], lat]);

  const polygon = new ol.geom.Polygon([coordinates]);
  const areaOutput = calculateAreaValue(polygon);
  return areaOutput;
}

function calculateAreaValue(polygon) {
  const area = ol.sphere.getArea(polygon, {
    projection: mapView.getProjection(),
  });
  return area;
}
//-------------COORDINATE CALCULATOR-------------------//
