dojo.require("esri.map");
dojo.require("esri.tasks.locator");
dojo.require("dojo.number");
dojo.require("dijit.dijit");
dojo.require("esri.dijit.Scalebar");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.Select");
dojo.require("esri.tasks.gp");
dojo.require("esri.tasks.query");
dojo.require("esri.tasks.geometry");
dojo.require("esri.toolbars.draw");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.symbol");

var map, queryTask, query, gp, toolbar, geometryService;

//
//
// Define the locations / ids of all services --
//
//

// Geometry server
var geometryserverUrl =
  "https://mapservices.gov.yk.ca/arcgis/rest/services/Utilities/Geometry/GeometryServer";

// Geoprocessing service for tool + resulting map service for jobs -- "YukonModel.tbx"
// var geoprocessingJobsUrl = "https://deptweb.gov.yk.ca/arcgis/rest/services/CS_LandSupply/LS_YukonModel/MapServer/jobs";
var geoprocessingUrl =
  "https://deptweb.gov.yk.ca/arcgis/rest/services/CS_LandSupply/LS_YukonModel/GPServer/LS_YukonModel";
var geoprocessingJobsUrl =
  "https://deptweb.gov.yk.ca/arcgis/rest/services/CS_LandSupply/LS_YukonModel/MapServer/jobs";
//   "https://deptweb.gov.yk.ca/arcgis/rest/services/CS_LandSupply/LS_YukonModel/MapServer/jobs";
// var geoprocessingUrl = "https://deptweb.go.yk.ca/arcgis/rest/services/yukon/YukonModelXXX/GPServer/YukonModel";
// var geoprocessingJobsUrl = "https://gis.o2design.com/arcgis/rest/services/yukon/YukonModelXXX/MapServer/jobs";

// Base map
var basemapUrl =
  "https://mapservices.gov.yk.ca/arcgis/rest/services/ShadedRelief_Cache/MapServer";

// Land Base:
//   Transportation [41]
//   Watercourse [51]
//   Waterbody [57]
var landBaseUrl =
  "https://mapservices.gov.yk.ca/arcgis/rest/services/SimpleOverviewMap/MapServer/";
var landBaseids = [41, 51, 57];

// Labels:
//   Places [0]
//   Annotation [8]
var labelsUrl = landBaseUrl;
var labelids = [0, 8];

// Parcels for querying:
//   Vacant Parcels [0] -- must be added to YK map services ("vacant parcels - query.mxd")
//   var parcelURL =      "https://gis.o2design.com/arcgis/rest/services/yukon/vacant_parcels_wmx/MapServer";
//   var parcelqueryURL = "https://gis.o2design.com/arcgis/rest/services/yukon/vacant_parcels_wmx/MapServer/0";
var parcelURL =
  "https://deptweb.gov.yk.ca/arcgis/rest/services/CS_LandSupply/VacantParcels_Query/MapServer";
var parcelqueryURL = parcelURL + "/0";
var parcelqueryids = [0];

// Boundary - Feature Layer:
//   Yukon Border (Surveyed) [0]
var boundaryURL =
  "https://mapservices.gov.yk.ca/arcgis/rest/services/GeoYukon/GY_AdministrativeBoundaries/MapServer/2";

// Parks and Protected Areas:
//   Surveyed Parks and Campgrounds [0]
//   Surveyed Protected Areas [1]
//   Parks and Protected Areas (250K) [2]
var parksids = [0, 1, 3];
var parkUrl =
  "https://mapservices.gov.yk.ca/arcgis/rest/services/GeoYukon/GY_ParksProtectedAreas/MapServer";

// Mining Tenure:
//   Quartz Activity / Quartz Claims [21]
var quartzids = [36];
var quartzUrl =
  "https://mapservices.gov.yk.ca/arcgis/rest/services/GeoYukon/GY_Mining/MapServer";

// Placer Claims:
//   Placer Activity / Placer Claims [4]
var placerUrl =
  "https://mapservices.gov.yk.ca/arcgis/rest/services/GeoYukon/GY_Mining/MapServer";
var placerids = [11];

// Wetlands:
//   Wetlands [0] -- must be added to YK map services ("tool layers - constraints - wetlands.mxd")
//   var wetlandsUrl = "https://gis.o2design.com/arcgis/rest/services/yukon/yukon_new_constraints_WTL/MapServer";
var wetlandsUrl =
  "https://deptweb.gov.yk.ca/arcgis/rest/services/CS_LandSupply/ToolLayers_Constraints_Wetlands/MapServer";
var wetlandids = [0];

// Slope
//   Slope [0] -- must be added to YK map services ("tool layers - constraints - slope.mxd")
// var slopeUrl = "https://gis.o2design.com/arcgis/rest/services/yukon/yukon_new_constraints_SLP/MapServer";
var slopeUrl =
  "https://deptweb.gov.yk.ca/arcgis/rest/services/CS_LandSupply/ToolLayers_Constraints_Slope/MapServer";
var slopeids = [0];

// Cadastre
//   Cadastre [0]
var cadastreUrl =
  "https://mapservices.gov.yk.ca/arcgis/rest/services/GeoYukon/GY_LandTenure/MapServer";
var cadastreids = [27];

// Administrative
//   Municipal Boundary [1]
//   Local Advisory Area [2]
var adminUrl =
  "https://mapservices.gov.yk.ca/arcgis/rest/services/GeoYukon/GY_LandPlanning/MapServer";
var adminids = [6, 5];

// Zoning
//   Zoning [0] -- must be added to YK map services ("tool layers - zoning.mxd")
//   var zoningUrl = "https://gis.o2design.com/arcgis/rest/services/yukon/yukon_new_zoning/MapServer";
var zoningUrl =
  "https://deptweb.gov.yk.ca/arcgis/rest/services/CS_LandSupply/ToolLayers_Zoning/MapServer";
var zoningids = [1];

// First Nations Settlement Lands
//   Settlement Lands (Surveyed) [0]
//   Settlement Lands (Unsurveyed) [1]
var FN_landsUrl =
  "https://mapservices.gov.yk.ca/arcgis/rest/services/GeoYukon/GY_FirstNations/MapServer";
var FN_landsids = [0, 1];

// First Nations Interim Land Claims
//   Interim Protected Lands (Unsurveyed) [2]
// var FNinterimUrl = "https://mapservices.gov.yk.ca/arcgis/rest/services/FirstNation/MapServer";
// var FNinterimids = [2]

// Land Use Permits
//   Land Use Permit (50K) / Active [8]
var LUPUrl =
  "https://mapservices.gov.yk.ca/arcgis/rest/services/GeoYukon/GY_LandTenure/MapServer";
var LUPids = [13];

// Land Licenses
//   Land / Land Licenses [4]
var LicensesUrl =
  "https://mapservices.gov.yk.ca/arcgis/rest/services/GeoYukon/GY_LandTenure/MapServer";
var Licensesids = [3];

// Development Hold Areas
//   Land / Development Hold Areas [6]
var DHAUrl =
  "https://mapservices.gov.yk.ca/arcgis/rest/services/GeoYukon/GY_LandTenure/MapServer";
var DHAids = [5];

// Vacant - YK
//   Vacant government residential parcels [0] -- must be added to YK map services ("vacant parcels - public.mxd")
//   var vacantykUrl = "https://gis.o2design.com/arcgis/rest/services/yukon/vacant_parcels_map_yk/MapServer";
var vacantykUrl =
  "https://deptweb.gov.yk.ca/arcgis/rest/services/CS_LandSupply/VacantParcels_Public/MapServer";
var vacantykids = [0];

// Vacant - Private
//   Vacant private residential parcels [0] -- must be added to YK map services ("vacant parcels - private.mxd")
//   var vacantprivateUrl = "https://gis.o2design.com/arcgis/rest/services/yukon/vacant_parcels_map_private/MapServer";
var vacantprivateUrl =
  "https://deptweb.gov.yk.ca/arcgis/rest/services/CS_LandSupply/VacantParcels_Private/MapServer";
var vacantprivateids = [0];

//
//
//
function init() {
  esri.config.defaults.io.proxyUrl = "proxy.jsp";
  esri.config.defaults.io.alwaysUseProxy = false;
  esri.config;

  // Set initial Extent of the Map when load first time.
  var initialExtent = new esri.geometry.Extent({
    xmin: 60000.0,
    xmax: 810000.0,
    ymin: 580000.0,
    ymax: 1150000.0,
    spatialReference: {
      wkid: 3578
    }
  });
  map = new esri.Map("map", {
    extent: initialExtent,
    logo: false
  });

  dojo.connect(
    map,
    "onLoad",
    function (map) {
      //resize the map when the browser resizes
      dojo.connect(
        dijit.byId("map"),
        "resize",
        map,
        map.resize
      );
      var scalebar = new esri.dijit.Scalebar({
        map: map,
        scalebarUnit: "metric",
        attachTo: "bottom-left"
      });

      // Add ToolBar
      toolbar = new esri.toolbars.Draw(map);
      dojo.connect(
        toolbar,
        "onDrawEnd",
        getAreasFromGP
      );
    }
  );

  esriConfig.defaults.map.slider = {
    left: "20px",
    top: "60px",
    width: null,
    height: "200px"
  };

  // BaseMap
  var basemap = new esri.layers.ArcGISTiledMapServiceLayer(basemapUrl, {
    opacity: 0.25
  });
  map.addLayer(basemap);

  // LandBase Layer
  var landBaseLayer = new esri.layers.ArcGISDynamicMapServiceLayer(
    landBaseUrl, {
      opacity: 1.0
    }
  );
  landBaseLayer.setVisibleLayers(landBaseids);
  map.addLayer(landBaseLayer);

  // Add Dynamic Layers
  AddDynamicLayer(map);

  // Label Layer
  var labelsLayer = new esri.layers.ArcGISDynamicMapServiceLayer(labelsUrl, {
    opacity: 0.9
  });
  labelsLayer.setVisibleLayers(labelids);
  map.addLayer(labelsLayer);

  // Parcel Layer for query purpose
  var parcelLayer = new esri.layers.ArcGISDynamicMapServiceLayer(parcelURL, {
    opacity: 0.9
  });
  labelsLayer.setVisibleLayers(parcelqueryids);
  map.addLayer(parcelLayer);

  // Boundary
  var infoTemplate = new esri.InfoTemplate("Attributes", "${*}");
  var boundaryLayer = new esri.layers.FeatureLayer(boundaryURL, {
    mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
    outfields: ["*"],
    infoTemplate: infoTemplate
  });
  var sfs = new esri.symbol.SimpleFillSymbol(
    esri.symbol.SimpleFillSymbol.STYLE_NULL,
    new esri.symbol.SimpleLineSymbol(
      esri.symbol.SimpleLineSymbol.STYLE_SOLID,
      new dojo.Color([255, 0, 0, 0.5]),
      1.5
    )
  );
  var renderer = new esri.renderer.SimpleRenderer(sfs);
  boundaryLayer.setRenderer(renderer);
  map.addLayer(boundaryLayer);

  // Geometry Server
  geometryService = new esri.tasks.GeometryService(geometryserverUrl);

  // In order to display popup when user click on the Map.
  dojo.connect(
    map,
    "onClick",
    executeQueryTask
  );

  // Clear the graphics while popup closed.
  dojo.connect(
    map.infoWindow,
    "onHide",
    function () {
      map.graphics.clear();
    }
  );

  // Create Query
  queryTask = new esri.tasks.QueryTask(parcelqueryURL); // Vacant parcels layer -- "vacant parcels - query.mxd"
  query = new esri.tasks.Query();
  query.outSpatialReference = {
    wkid: 3578
  };
  query.returnGeometry = true;
  query.outFields = ["*"];

  // GeoProcessing task
  dojo.connect(
    document.getElementById("RUNMODEL"),
    "onclick",
    function () {
      // Get the Selected value from Dropdown
      var selectedValueIndex = document.getElementById("select_new")
        .selectedIndex;
      var selectedIndexValue = document.getElementById("select_new")[
        selectedValueIndex
      ].value;

      if (selectedIndexValue != null && selectedIndexValue != "") {
        // Add Raster layer.
        AddRasterLayer(selectedIndexValue);
      } else {
        alert("Please select Input Area field"); // Change the message as per you need.
      }
    }
  );
}

function AddRasterLayer(inputarea) {
  var gp = new esri.tasks.Geoprocessor(geoprocessingUrl);
  var params = {
    input_area: inputarea,
    DIST_RDS_val: document.getElementById("DIST_RDS_val").value, //3
    DIST_SWT_val: document.getElementById("DIST_SWT_val").value, //-4
    DIST_PRK_val: document.getElementById("DIST_PRK_val").value, //-4
    DIST_WTL_val: document.getElementById("DIST_WTL_val").value, //-10
    DIST_OSP_val: document.getElementById("DIST_OSP_val").value, //-2
    DIST_RES_val: document.getElementById("DIST_RES_val").value, //8
    DIST_COM_val: document.getElementById("DIST_COM_val").value, //-2
    DIST_IND_val: document.getElementById("DIST_IND_val").value, //-8
    DIST_AGR_val: document.getElementById("DIST_AGR_val").value, //-5
    DIST_INS_val: document.getElementById("DIST_INS_val").value, //-1
    DIST_TRA_val: document.getElementById("DIST_TRA_val").value, //-8
    AREA_RDS_val: document.getElementById("AREA_RDS_val").value, //0
    AREA_OSP_val: document.getElementById("AREA_OSP_val").value, //-10
    AREA_RES_val: document.getElementById("AREA_RES_val").value, //8
    AREA_COM_val: document.getElementById("AREA_COM_val").value, //-5
    AREA_IND_val: document.getElementById("AREA_IND_val").value, //-8
    AREA_AGR_val: document.getElementById("AREA_AGR_val").value, //-5
    AREA_INS_val: document.getElementById("AREA_INS_val").value, //-2
    AREA_FUT_val: document.getElementById("AREA_FUT_val").value, //4
    AREA_HNT_val: document.getElementById("AREA_HNT_val").value, //2
    MINRT_QZ_val: document.getElementById("MINRT_QZ_val").value, //-10
    MINRT_PL_val: document.getElementById("MINRT_PL_val").value, //-10
    LANDS_VC_val: document.getElementById("LANDS_VC_val").value, //4
    LANDS_NG_val: document.getElementById("LANDS_NG_val").value, //-10
    LANDS_FN_val: document.getElementById("LANDS_FN_val").value, //0
    SLOPE_10_val: document.getElementById("SLOPE_10_val").value, //-3
    SLOPE_25_val: document.getElementById("SLOPE_25_val").value //-6
  };

  //Remove the previous layer added to Map
  var rasterOutputLayer = map.getLayer("RasterOutputLayer");
  if (rasterOutputLayer) {
    map.removeLayer(rasterOutputLayer);
  }

  document.getElementById("RasterOutputLayer").checked = false;

  // Execute the Job
  gp.submitJob(params, gpJobComplete, gpJobStatus, gpJobFailed);
}

function gpJobComplete(jobinfo) {
  // Hide the progress bar
  document.getElementById("ProgressImage").style.display = "none";

  //Add the Result URL to Map once Job is successfully completes.
  var mapurl = geoprocessingJobsUrl + "/" + jobinfo.jobId;
  var rasterOutPutLayer = new esri.layers.ArcGISDynamicMapServiceLayer(mapurl, {
    id: "RasterOutputLayer",
    opacity: 0.8
  });

  //add the raster layer to the map
  map.addLayers([rasterOutPutLayer]);

  // Zoom to this layer
  document.getElementById("RasterOutputLayer").checked = true;
}

function gpJobStatus(jobinfo) {
  // show progressbar
  document.getElementById("ProgressImage").style.display = "inline";
}

function gpJobFailed(error) {
  // Add code to show error message if any error found.
  document.getElementById("ProgressImage").style.display = "none";
}

// Add Layer to Map
function AddDynamicLayer(map) {
  // Note: Layer ID has been given matched to CheckBox Id (Layers Tab) in order to avoid index number like 0, 1, 2 etc.

  // Parks Layer
  var parkLayer = new esri.layers.ArcGISDynamicMapServiceLayer(parkUrl, {
    opacity: 1.0
  });
  parkLayer.id = "Parks";
  parkLayer.setVisibleLayers(parksids);
  parkLayer.visible = false;
  map.addLayer(parkLayer);

  // Mining Claims
  var quartzLayer = new esri.layers.ArcGISDynamicMapServiceLayer(quartzUrl, {
    opacity: 0.8
  });
  quartzLayer.setVisibleLayers(quartzids);
  quartzLayer.id = "Miningclaims";
  quartzLayer.visible = false;
  map.addLayer(quartzLayer);

  // Placer Claims
  var placerLayer = new esri.layers.ArcGISDynamicMapServiceLayer(placerUrl, {
    opacity: 0.8
  });
  placerLayer.setVisibleLayers(placerids);
  placerLayer.id = "Placerclaims";
  placerLayer.visible = false;
  map.addLayer(placerLayer);

  // Wetlands
  var wetlandsLayer = new esri.layers.ArcGISDynamicMapServiceLayer(
    wetlandsUrl, {
      opacity: 0.5
    }
  );
  wetlandsLayer.setVisibleLayers(wetlandids);
  wetlandsLayer.id = "Wetlands";
  wetlandsLayer.visible = false;
  map.addLayer(wetlandsLayer);

  // Slope
  var slopeLayer = new esri.layers.ArcGISDynamicMapServiceLayer(slopeUrl, {
    opacity: 0.75
  });
  slopeLayer.setVisibleLayers(slopeids);
  slopeLayer.id = "Slope";
  slopeLayer.visible = false;
  map.addLayer(slopeLayer);

  // Cadastre Layer
  var cadastreLayer = new esri.layers.ArcGISDynamicMapServiceLayer(
    cadastreUrl, {
      opacity: 0.5
    }
  );
  cadastreLayer.setVisibleLayers(cadastreids);
  cadastreLayer.id = "Cadastre";
  cadastreLayer.visible = false;
  map.addLayer(cadastreLayer);

  // Admin Layer
  var adminLayer = new esri.layers.ArcGISDynamicMapServiceLayer(adminUrl, {
    opacity: 0.65
  });
  adminLayer.id = "Jurisdiction";
  adminLayer.visible = false;

  var layerDefinitions = [];
  layerDefinitions[1] = "ADMIN_AREA_TYPE <> 'SUBDIVISION'";
  adminLayer.setLayerDefinitions(layerDefinitions);

  adminLayer.setVisibleLayers(adminids);
  map.addLayer(adminLayer);

  // Zoning Layer
  var zoningLayer = new esri.layers.ArcGISDynamicMapServiceLayer(zoningUrl, {
    opacity: 0.5
  });
  zoningLayer.setVisibleLayers(zoningids);
  zoningLayer.id = "Zoning";
  zoningLayer.visible = false;
  map.addLayer(zoningLayer);

  // First Nations Settlement Lands
  var landlayer = new esri.layers.ArcGISDynamicMapServiceLayer(FN_landsUrl, {
    opacity: 0.65
  });
  landlayer.id = "Firstnationslands";
  landlayer.setVisibleLayers(FN_landsids);
  landlayer.visible = false;
  map.addLayer(landlayer);

  // First Nations Interim Land Claims
  // Note: Rolled into FirstNations Settlement Land Layer - alukach
  // var FNinterimLayer = new esri.layers.ArcGISDynamicMapServiceLayer(FNinterimUrl, {
  //     opacity: 0.65
  // });
  // FNinterimLayer.id = "Firstnationsclaims";
  // FNinterimLayer.setVisibleLayers(FNinterimids);
  // FNinterimLayer.visible = false;
  // map.addLayer(FNinterimLayer);

  // Land Use Permits
  var LUPLayer = new esri.layers.ArcGISDynamicMapServiceLayer(LUPUrl, {
    opacity: 0.8
  });
  LUPLayer.id = "LandUsePermits";
  LUPLayer.setVisibleLayers(LUPids);
  LUPLayer.visible = false;
  map.addLayer(LUPLayer);

  // Land Licenses
  var LicensesPLayer = new esri.layers.ArcGISDynamicMapServiceLayer(
    LicensesUrl, {
      opacity: 0.8
    }
  );
  LicensesPLayer.id = "LandUseLicenses";
  LicensesPLayer.setVisibleLayers(Licensesids);
  LicensesPLayer.visible = false;
  map.addLayer(LicensesPLayer);

  // Development Hold Areas
  var DHALayer = new esri.layers.ArcGISDynamicMapServiceLayer(DHAUrl, {
    opacity: 0.8
  });
  DHALayer.id = "DevelopmentHoldAreas";
  DHALayer.setVisibleLayers(DHAids);
  DHALayer.visible = false;
  map.addLayer(DHALayer);

  // Vacant - YK
  var vacantykLayer = new esri.layers.ArcGISDynamicMapServiceLayer(
    vacantykUrl, {
      opacity: 0.5
    }
  );
  vacantykLayer.setVisibleLayers(vacantykids);
  vacantykLayer.id = "Vacantyukon";
  vacantykLayer.visible = false;
  map.addLayer(vacantykLayer);

  // Vacant - Private
  var vacantprivateLayer = new esri.layers.ArcGISDynamicMapServiceLayer(
    vacantprivateUrl, {
      opacity: 0.5
    }
  );
  vacantprivateLayer.setVisibleLayers(vacantprivateids);
  vacantprivateLayer.id = "Vacantprivate";
  vacantprivateLayer.visible = false;
  map.addLayer(vacantprivateLayer);
}

// Update the layer visibility when user clicked in "Layer" tab checkbox.
function updateLayerVisibility(obj) {
  var isVisible = false;
  if ($(obj).attr("checked")) {
    isVisible = true;
  }

  // Loop through Map layers and set visibility based on checked and unchecked.
  for (var j = 0, jl = map.layerIds.length; j < jl; j++) {
    var currentLayer = map.getLayer(map.layerIds[j]);
    if (currentLayer.id == obj.id) {
      currentLayer.setVisibility(isVisible);
      break;
    }
  }
}

function executeQueryTask(evt) {
  map.infoWindow.hide();
  map.graphics.clear();

  // Get the Geometry where user clicks on Map
  query.geometry = evt.mapPoint;
  query.spatialRelationship = esri.tasks.Query.SPATIAL_REL_INTERSECTS;

  //Execute task and call showResults on completion
  queryTask.execute(query, function (fset) {
    if (fset.features.length === 1) {
      showFeature(fset.features[0], evt);
    }
  });
}

function showFeature(feature, evt) {
  map.graphics.clear();

  //set symbol
  var symbol = new esri.symbol.SimpleFillSymbol(
    esri.symbol.SimpleFillSymbol.STYLE_SOLID,
    new esri.symbol.SimpleLineSymbol(
      esri.symbol.SimpleLineSymbol.STYLE_SOLID,
      new dojo.Color([255, 0, 0]),
      2
    ),
    new dojo.Color([255, 255, 0, 0.5])
  );
  feature.setSymbol(symbol);

  //construct infowindow title and content
  var attr = feature.attributes;
  var title = "Vacant Parcel - " + attr.pin;
  var content =
    attr.designator +
    "<br />" +
    attr.planno +
    "<br /><br /><b>Use:</b> " +
    attr.usedesc +
    "<br /><b>Zoning:</b> " +
    attr.zone_desc +
    "<br /><b>Ownership:</b> " +
    attr.class_desc;
  map.graphics.add(feature);

  map.infoWindow.setTitle(title);
  map.infoWindow.setContent(content);

  evt
    ?
    map.infoWindow.show(
      evt.screenPoint,
      map.getInfoWindowAnchor(evt.screenPoint)
    ) :
    null;
}

// Zoom To pre-defined extent from Overview Tab
function ZoomToMapExtent(newMapExtent) {
  var extent;
  switch (newMapExtent) {
    case "CSA2":
      extent = new esri.geometry.Extent({
        xmin: 7279.425805,
        xmax: 317353.553865,
        ymin: 600984.298318,
        ymax: 958557.678813,
        spatialReference: {
          wkid: 3578
        }
      });
      break;
    case "CSA3":
      extent = new esri.geometry.Extent({
        xmin: 361201.123187,
        xmax: 526531.818954,
        ymin: 603012.558039,
        ymax: 722485.535573,
        spatialReference: {
          wkid: 3578
        }
      });
      break;
    case "CSA4":
      extent = new esri.geometry.Extent({
        xmin: 227765.766566,
        xmax: 381139.15395,
        ymin: 972851.071826,
        ymax: 1073768.38006,
        spatialReference: {
          wkid: 3578
        }
      });
      break;
    case "CSA5":
      extent = new esri.geometry.Extent({
        xmin: 186840.121455,
        xmax: 386853.066956,
        ymin: 828936.755025,
        ymax: 959562.994293,
        spatialReference: {
          wkid: 3578
        }
      });
      break;
    case "CSA6":
      extent = new esri.geometry.Extent({
        xmin: 74322.997012,
        xmax: 264160.670014,
        ymin: 1012039.599178,
        ymax: 1125269.486627,
        spatialReference: {
          wkid: 3578
        }
      });
      break;
    case "CSA7":
      extent = new esri.geometry.Extent({
        xmin: 315003.997711,
        xmax: 702549.591136,
        ymin: 672560.529007,
        ymax: 1006596.809081,
        spatialReference: {
          wkid: 3578
        }
      });
      break;
    case "CSA8":
      extent = new esri.geometry.Extent({
        xmin: 563188.575976,
        xmax: 721676.76939,
        ymin: 596213.960595,
        ymax: 725038.198671,
        spatialReference: {
          wkid: 3578
        }
      });
      break;
    case "CSA9":
      extent = new esri.geometry.Extent({
        xmin: 283767.795224,
        xmax: 417764.318999,
        ymin: 640502.81794,
        ymax: 731966.966762,
        spatialReference: {
          wkid: 3578
        }
      });
      break;
    case "Carmacks":
      extent = new esri.geometry.Extent({
        xmin: 298843.395877,
        xmax: 310951.575987,
        ymin: 846549.875708,
        ymax: 854554.948012,
        spatialReference: {
          wkid: 3578
        }
      });
      break;
    case "Dawson":
      extent = new esri.geometry.Extent({
        xmin: 157805.574774,
        xmax: 171807.200116,
        ymin: 1077395.212635,
        ymax: 1085704.472442,
        spatialReference: {
          wkid: 3578
        }
      });
      break;
    case "Mayo":
      extent = new esri.geometry.Extent({
        xmin: 325974.65303,
        xmax: 337423.109028,
        ymin: 1014889.148003,
        ymax: 1022561.912497,
        spatialReference: {
          wkid: 3578
        }
      });
      break;
    case "Faro":
      extent = new esri.geometry.Extent({
        xmin: 445928.932908,
        xmax: 465407.747144,
        ymin: 850415.792616,
        ymax: 864611.441151,
        spatialReference: {
          wkid: 3578
        }
      });
      break;
    case "HainesJunction":
      extent = new esri.geometry.Extent({
        xmin: 217798.462325,
        xmax: 234884.786848,
        ymin: 702146.209994,
        ymax: 712922.730749,
        spatialReference: {
          wkid: 3578
        }
      });
      break;
    case "Teslin":
      extent = new esri.geometry.Extent({
        xmin: 482757.905437,
        xmax: 492678.260483,
        ymin: 626538.399463,
        ymax: 633889.978886,
        spatialReference: {
          wkid: 3578
        }
      });
      break;
    case "WatsonLake":
      extent = new esri.geometry.Extent({
        xmin: 698210.391715,
        xmax: 721877.832224,
        ymin: 615813.810578,
        ymax: 635771.934367,
        spatialReference: {
          wkid: 3578
        }
      });
      break;
    case "Whitehorse":
      extent = new esri.geometry.Extent({
        xmin: 698210.391715,
        xmax: 721877.832224,
        ymin: 615813.810578,
        ymax: 635771.934367,
        spatialReference: {
          wkid: 3578
        }
      });
      break;
    case "BeaverCreek":
      extent = new esri.geometry.Extent({
        xmin: 60554.524929,
        xmax: 77264.642575,
        ymin: 901915.187263,
        ymax: 911293.358065,
        spatialReference: {
          wkid: 3578
        }
      });
      break;
    case "BurwashLanding":
      extent = new esri.geometry.Extent({
        xmin: 145610.241367,
        xmax: 159217.307026,
        ymin: 775600.791051,
        ymax: 783754.966152,
        spatialReference: {
          wkid: 3578
        }
      });
      break;
    case "Carcross":
      extent = new esri.geometry.Extent({
        xmin: 347751.889086,
        xmax: 415245.975798,
        ymin: 613395.523758,
        ymax: 660333.605798,
        spatialReference: {
          wkid: 3578
        }
      });
      break;
    case "DestructionBay":
      extent = new esri.geometry.Extent({
        xmin: 154842.285055,
        xmax: 168468.096368,
        ymin: 763593.263773,
        ymax: 771813.717937,
        spatialReference: {
          wkid: 3578
        }
      });
      break;
    case "OldCrow":
      extent = new esri.geometry.Extent({
        xmin: 347751.889086,
        xmax: 415245.975798,
        ymin: 613395.523758,
        ymax: 660333.605798,
        spatialReference: {
          wkid: 3578
        }
      });
      break;
    case "PellyCrossing":
      extent = new esri.geometry.Extent({
        xmin: 286826.271576,
        xmax: 299467.362749,
        ymin: 928674.39326,
        ymax: 936948.062002,
        spatialReference: {
          wkid: 3578
        }
      });
      break;
  }

  // Zoom to map
  map.setExtent(extent);
}

function addToMap(geometry) {
  switch (geometry.type) {
    case "polyline":
      var symbol = new esri.symbol.SimpleLineSymbol(
        esri.symbol.SimpleLineSymbol.STYLE_DASH,
        new dojo.Color([255, 0, 0]),
        1
      );
      break;
    case "polygon":
      var symbol = new esri.symbol.SimpleFillSymbol(
        esri.symbol.SimpleFillSymbol.STYLE_SOLID,
        new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,
          new dojo.Color([255, 0, 0]),
          2
        ),
        new dojo.Color([255, 255, 0, 0.25])
      );
      break;
  }
  var graphic = new esri.Graphic(geometry, symbol);
  map.graphics.add(graphic);
}

function getAreasFromGP(geometry) {
  var statistics = "";
  toolbar.deactivate();
  map.graphics.clear();
  document.getElementById("statistics").innerHTML = "";
  geometryService = new esri.tasks.GeometryService(geometryserverUrl);

  var areasAndLengthParams;
  switch (geometry.type) {
    case "polyline":
      var lengthParams = new esri.tasks.LengthsParameters();
      lengthParams.spatialReference = map.spatialReference;
      lengthParams.polylines = [geometry];
      lengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
      lengthParams.calculationType = "preserveShape";
      geometryService.lengths(lengthParams, outputLength, errorLog);
      break;
    case "polygon":
      var areasAndLengthParams = new esri.tasks.AreasAndLengthsParameters();
      areasAndLengthParams.spatialReference = map.spatialReference;
      areasAndLengthParams.polygons = [geometry];
      areasAndLengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
      areasAndLengthParams.areaUnit = esri.tasks.GeometryService.UNIT_HECTARES;
      areasAndLengthParams.calculationType = "preserveShape";
      geometryService.areasAndLengths(
        areasAndLengthParams,
        outputAreaAndLength,
        errorLog
      );
      break;
  }

  addToMap(geometry);
}

function errorLog(error) {
  alert(error.Error);
}

function outputAreaAndLength(result) {
  end_result = result.areas[0];
  if (end_result > 1000) {
    end_result = end_result.toFixed(0) + " hectares";
  } else if (end_result > 100) {
    end_result = end_result.toFixed(1) + " hectares";
  } else {
    end_result = end_result.toFixed(2) + " hectares";
  }
  document.getElementById("statistics").innerHTML =
    "<b>Area:  </b>" + end_result;
}

function outputLength(result) {
  end_result = result.lengths[0];
  if (end_result > 100000) {
    end_result = end_result / 1000.0;
    end_result = end_result.toFixed(0) + " kilometers";
  } else if (end_result > 10000) {
    end_result = end_result / 1000.0;
    end_result = end_result.toFixed(1) + " kilometers";
  } else if (end_result > 1000) {
    end_result = end_result / 1000.0;
    end_result = end_result.toFixed(2) + " kilometers";
  } else {
    end_result = end_result.toFixed(0) + " meters";
  }
  document.getElementById("statistics").innerHTML =
    "<b>Length:  </b>" + end_result;
}

//show map on load
dojo.addOnLoad(init);

ismenu = false;
$(document).ready(function () {
  $(".MenuItems").click(function () {
    if (
      $(this)
      .next()
      .is(":visible")
    ) {
      $(this)
        .next()
        .slideToggle("slow");
    } else {
      $(".MenuItemsDetails:visible").slideToggle("slow");
      $(this)
        .next()
        .slideToggle("slow");
    }
  });
  $(".SlideRight").click(function () {
    if (ismenu) {
      $(".slide")
        .parent()
        .animate({
            width: "toggle"
          },
          "slow"
        );
      $(this).html("<b>+</b>");
      ismenu = false;
    } else {
      $(".slide")
        .parent()
        .animate({
            width: "toggle"
          },
          "slow"
        );
      $(this).html("<b>-</b>");
      ismenu = true;
    }
  });
  $("#select").val("");
  $("#select").change(function () {
    // Zoom to specific pre-defined MapExtent
    ZoomToMapExtent(this.value);
  });
  $("#resizable")
    .draggable()
    .resizable();

  //The following functions are used for the calculator tab
  $("div#calculator")
    .find("input")
    .keyup(function (event) {
      update_calculator();
    });
  $("a#calculator_reset").click(function (event) {
    event.preventDefault();
    default_calculator();
    update_calculator();
  });

  //The following code is borrowed from https://stackoverflow.com/questions/995183/how-to-allow-only-numeric-0-9-in-html-inputbox-using-jquery
  //It is intended to limit the fields to only accept numeric values
  $("div#calculator")
    .find("input")
    .keydown(function (event) {
      // Allow: backspace, delete, tab, escape, and enter
      if (
        event.keyCode == 46 ||
        event.keyCode == 8 ||
        event.keyCode == 9 ||
        event.keyCode == 27 ||
        event.keyCode == 13 ||
        // Allow: Ctrl+A
        (event.keyCode == 65 && event.ctrlKey === true) ||
        // Allow: home, end, left, right
        (event.keyCode >= 35 && event.keyCode <= 39)
      ) {
        if (event.keyCode == 13 || event.keyCode == 9) {
          update_calculator();
        }
        // let it happen, don't do anything
        return;
      } else {
        // Ensure that it is a number and stop the keypress
        if (
          event.shiftKey ||
          ((event.keyCode < 48 || event.keyCode > 57) &&
            (event.keyCode < 96 || event.keyCode > 105))
        ) {
          event.preventDefault();
        }
      }
    });
  default_calculator();
  update_calculator();
  //End Calculator Functions
});

function update_calculator() {
  rows = $("div#calculator").find("tr");
  total_units = 0;
  total_ha = 0;
  for (i = 0; i < rows.length; i++) {
    row = $(rows[i]);
    units = parseInt($(row.find("input.units")).attr("value"));
    haperunit = parseFloat($(row.find("input.ha-per-unit")).attr("value"));
    if (isNaN(units)) {
      units = 0.0;
    }
    if (isNaN(haperunit)) {
      haperunit = 0.0;
    }
    hectares = units * haperunit;
    total_ha = total_ha + hectares;
    total_units = total_units + units;
    hectares = hectares.toFixed(2);
    $(row.find("span.hectares")).html(hectares);
  }
  grossup = parseInt(document.getElementById("grossup-factor").value);
  if (isNaN(grossup)) {
    grossup = 0;
  }
  total_ha = (total_ha * grossup) / 100.0;
  total_ha = total_ha.toFixed(2) + " ha";
  $("td#total_units").html(total_units);
  $("td#total_hectares").html(total_ha);
}

function default_calculator() {
  rows = $("div#calculator").find("tr");
  for (i = 0; i < rows.length; i++) {
    row = $(rows[i]);
    input_box = $(row.find("input.ha-per-unit"));
    input_box.attr("value", input_box.attr("default_value"));
    $(row.find("input.units")).attr("value", "");
  }
  grossupvalue = document.getElementById("grossup-factor");
  grossupvalue.value = grossupvalue.defaultValue;
}
