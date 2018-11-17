# Yukon Land Supply Options Tool

## Overview

This application is composed of a static HTML front-end GUI that makes requests to the Yukon Government's ArcGIS Server. These requests load relevant data layers and utilize a custom GeoProcessing Service to generate raster outputs based on weighted input layers for a given region. This generated raster layer can then be used to make better selection of lands based on user's specified criteria.

From the Yukon Government's "Overview of the Land Supply Tool" documentation:

> The online Land Supply Options Tool for the Yukon is envisioned as web mapping platform that allows available undeveloped lands to be evaluated for their suitability for new development. This includes:
>
> - Unsurveyed Crown lands under control of the Yukon government
> - Surveyed vacant lands
> - Surveyed and unsurveyed First Nations Settlement Lands

...

> The online Options Tool is envisioned to have the following functions:
>
> - View base mapping features for communities and regions
> - View relevant mapping layers for land development
> - Identify and review the characteristics of vacant parcels in the area
> - View potential constraints to development
> - Evaluate land suitability for by assessing positive and negative factors with custom weights
> - Delineate potential areas for land development and determine limitations to development found in each of those areas Although there are other Yukon government departments that have similar web-based mapping platforms to provide base mapping functions and display of relevant land layers, this Tool is focused on land suitability analysis, and incorporates a suitability model into the web mapping interface.

## Development

While the frontend can be run from any machine, the ArcGIS Scripts are intended to be run the Yukon Government's ArcGIS Server with access to the many datasets specified within the `arcgisServerTools/map_model_gamma.py` script.

## Credits

Originally created by [O2 Planning + Design](https://www.o2design.com/); resurrected by [@JoshTW](https://github.com/JoshTW) and [@alukach](https://github.com/alukach) during [HackYG2018](https://yukonstruct.com/hackyg/), with help of [Nicole Parry](mailto:nicole.parry@gov.yk.ca) and [Kaori Torigai](mailto:kaori.torigai@gov.yk.ca).
