export interface Rental {
  run: string;
  rtype: string;
  htype: string;
  desc: string;
  habd?: any;
  rent: number;
  area: string;
  lnk: string;
  img: string;
  addr: Addr;
}

export interface Addr {
  l1: string;
  l2: string;
}

export interface MapMarker {
  lat: number;
  lon: number;
  gh: string;
  rental?: Rental;
  rentals?: Rental[];
  type: string;
}

export interface MapSearchResponse {
  mapMarkers: MapMarker[];
}

