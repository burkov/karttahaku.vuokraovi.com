export interface Rental {
  run: string;
  rtype: string;
  htype: string;
  desc: string | null;
  habd: any | null;
  rent: number;
  area: string;
  lnk: string;
  img: string | null;
  addr: Addr;
}

export interface Addr {
  l1: string;
  l2: string;
}

export interface MapMarker {
  lat: number;
  lon: number;
}

export enum MapMarkerType {
  RENTAL = 'RENTAL',
  RENTAL_GROUP = 'RENTAL_GROUP',
}

export interface RentalMapMarker extends MapMarker {
  rental: Rental;
  type: MapMarkerType.RENTAL;
}

export interface RentalGroupMapMarker extends MapMarker {
  rentals: Rental[];
  type: MapMarkerType.RENTAL_GROUP;
  gh: string;
}

export interface MapSearchResponse {
  mapMarkers: (RentalMapMarker | RentalGroupMapMarker)[];
}
