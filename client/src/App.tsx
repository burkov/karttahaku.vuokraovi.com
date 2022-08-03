import React, {useEffect, useState} from 'react';
import {MapSearchResponse} from "./model";

function App() {
  const [state, setState] = useState<MapSearchResponse>()
  useEffect(() => {
    fetch("/map/map-search", {
      "method": "POST",
      "credentials": "include",
      "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9,ru;q=0.8,la;q=0.7",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
      },
      "body": JSON.stringify({
        zoom: 12,
        latNE: 61.120128337728254, latSW: 61.01183107946681, lonSW: 27.97756806237249, lonNE: 28.538214119501397,
        sc: {
          rtype: "apartment rental"
        }
      }),
    }).then(e => e.json()).then(setState);
  }, [])
  return (
    <>
      loaded: <code>{state?.mapMarkers.length}</code>
    </>
  );
}

export default App;
