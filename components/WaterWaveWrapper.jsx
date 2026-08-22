"use client";

import React, { useEffect, useState } from "react";

export default function WaterWaveWrapper(props) {
  const [WaterWave, setWaterWave] = useState(null);

  useEffect(() => {
    import("react-water-wave").then((mod) => {
      setWaterWave(() => mod.default || mod);
    });
  }, []);

  if (!WaterWave) {
    return <div className={props.className} style={props.style} />;
  }

  return <WaterWave {...props} />;
}
