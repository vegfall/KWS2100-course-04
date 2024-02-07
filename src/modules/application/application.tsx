import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import "ol/ol.css";
import "./application.css";
import { KommuneLayerCheckbox } from "../kommune/kommuneLayerCheckbox";
import { map, MapContext } from "../map/mapContext";
import { Layer } from "ol/layer";
import { KommuneAside } from "../kommune/kommuneAside";
import { FylkeLayerCheckbox } from "../fylke/fylkeLayerCheckbox";
import { FylkeAside } from "../fylke/fylkeAside";

export function Application() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [layers, setLayers] = useState<Layer[]>([
    new TileLayer({ source: new OSM() }),
  ]);

  useEffect(() => {
    map.setTarget(mapRef.current);
  }, []);

  useEffect(() => {
    map.setLayers(layers);
  }, [layers]);

  function handleFocusUser(e: React.MouseEvent) {
    e.preventDefault();

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      map.getView().animate({
        center: [longitude, latitude],
        zoom: 12,
      });
    });
  }

  return (
    <MapContext.Provider value={{ map, layers, setLayers }}>
      <header>
        <h1>My Awesome Map!</h1>
      </header>
      <nav>
        <a href="#" onClick={handleFocusUser}>
          My location
        </a>
        <KommuneLayerCheckbox />
        <FylkeLayerCheckbox />
      </nav>
      <main>
        <div ref={mapRef}></div>
        <KommuneAside />
        <FylkeAside />
      </main>
    </MapContext.Provider>
  );
}
