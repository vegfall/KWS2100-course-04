import React, { Dispatch, SetStateAction } from "react";
import { Layer } from "ol/layer";
import { Map, View } from "ol";
import { useGeographic } from "ol/proj";

useGeographic();

export const map = new Map({
  view: new View({ center: [11, 60], zoom: 10 }),
});

export const MapContext = React.createContext<{
  map: Map;
  setLayers: Dispatch<SetStateAction<Layer[]>>;
  layers: Layer[];
}>({
  map,
  setLayers: () => {},
  layers: [],
});
