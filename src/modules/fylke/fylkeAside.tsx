import React, { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "../map/mapContext";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Feature } from "ol";

type FylkeVectorLayer = VectorLayer<VectorSource<FylkeFeature>>;

interface FylkeProperties {
  fylkenummer: string;
  navn: Stedsnavn[];
}

interface Stedsnavn {
  sprak: string;
  navn: string;
}

type FylkeFeature = {
  getProperties(): FylkeProperties;
} & Feature;

function getStedsnavn(navn: Stedsnavn[]) {
  return navn.find((n) => n.sprak === "nor")?.navn;
}

function useFylkeFeatures() {
  const { map, layers } = useContext(MapContext);

  const layer = layers.find(
    (l) => l.getClassName() === "fylke",
  ) as FylkeVectorLayer;

  const [features, setFeatures] = useState<FylkeFeature[]>();
  const [viewExtent, setViewExtent] = useState(
    map.getView().getViewStateAndExtent().extent,
  );

  const visibleFeatures = useMemo(
    () =>
      features?.filter((f) => f.getGeometry()?.intersectsExtent(viewExtent)),
    [features, viewExtent],
  );

  function handleSourceChange() {
    setFeatures(layer?.getSource()?.getFeatures());
  }

  function handleViewChange() {
    setViewExtent(map.getView().getViewStateAndExtent().extent);
  }

  useEffect(() => {
    layer?.getSource()?.on("change", handleSourceChange);

    return () => layer?.getSource()?.un("change", handleSourceChange);
  }, [layer]);

  useEffect(() => {
    map.getView().on("change", handleViewChange);
    return () => map.getView().un("change", handleViewChange);
  }, [map]);

  return { features, visibleFeatures };
}

export function FylkeAside() {
  const { visibleFeatures } = useFylkeFeatures();

  return (
    <aside className={visibleFeatures?.length ? "visible" : "hidden"}>
      <div>
        <h2>Fylker</h2>

        <ul>
          {visibleFeatures?.map((k) => (
            <li>{getStedsnavn(k.getProperties().navn)}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}