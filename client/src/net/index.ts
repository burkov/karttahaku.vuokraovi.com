import useSWR from 'swr';
import { Addr, MapSearchResponse, Rental, RentalGroupMapMarker, RentalMapMarker } from '../model';
import { isRentalGroupMapMarker, isRentalMapMarker } from '../model/index.guard';

export const toggleHidden = (id: string, newState: boolean) => {
  localStorage.setItem(`${id}-hidden`, `${newState}`);
};

export const toggleStarred = (id: string, newState: boolean) => {
  localStorage.setItem(`${id}-starred`, `${newState}`);
};

export const isHidden = (id: string) => localStorage.getItem(`${id}-hidden`) === 'true';

export const isStarred = (id: string) => localStorage.getItem(`${id}-starred`) === 'true';

const fetcher = ({ payload }: FetcherKey): Promise<any> =>
  fetch('/map/map-search', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((e) => e.json())
    .then((e: MapSearchResponse) => toViewModels(e.mapMarkers));

interface MapSearchParams {
  zoom: number;
  latNE: string;
  lonNE: string;
  latSW: string;
  lonSW: string;
}

enum FetcherKeyType {
  MAP_SEARCH,
}

interface FetcherKey {
  type: FetcherKeyType;
  payload: any;
}

export const useRentalMapMarkerViewModels = (params: MapSearchParams) =>
  useSWR<RentalMapMarkerViewModel[]>(
    {
      type: FetcherKeyType.MAP_SEARCH,
      payload: {
        ...params,
        sc: {
          rtype: 'apartment rental',
        },
      },
    },
    fetcher,
  );

export type RentalMapMarkerViewModel = Omit<RentalMapMarker, 'type'> & {
  gh: string | null;
  hidden: boolean;
  starred: boolean;
  rooms?: number;
  rental: Rental & {
    addr: Addr & {
      zip?: string;
    };
  };
};

const enrichDescription = (marker: PartialRentalMapMarkerViewModel): PartialRentalMapMarkerViewModel => {
  const {
    rental: { desc },
  } = marker;
  if (!desc) return marker;
  marker.rental.desc = desc.toLowerCase().replaceAll(' ', '').replaceAll('+', ' / ').replaceAll(',', ' / ');
  const [first] = marker.rental.desc?.split(' / ');
  const r = /(\d)h/.exec(first);
  if (r) {
    const rooms = parseInt(r[1]);
    if (Number.isFinite(rooms)) marker.rooms = rooms;
  }
  return marker;
};

const enrichAddress = (marker: PartialRentalMapMarkerViewModel): PartialRentalMapMarkerViewModel => {
  const { l1, l2 } = marker.rental.addr;
  if (!l1 || !l2) return marker;
  const l1Parts = l1.split(',');
  const [l21, l22] = l2.split(',').map((e) => e.trim());
  if (!l21 || !l22) return marker;
  const [zip, city] = l22.split(' ');
  if (l1Parts.some((e) => e.toLowerCase() === city.toLowerCase())) {
    marker.rental.addr.zip = zip;
    marker.rental.addr.l2 = l21;
  }
  return marker;
};

type PartialRentalMapMarkerViewModel = Omit<RentalMapMarkerViewModel, 'id' | 'hidden' | 'starred'>;

const toViewModels = (markers?: (RentalMapMarker | RentalGroupMapMarker)[]): undefined | RentalMapMarkerViewModel[] => {
  if (markers === undefined) return undefined;
  const result: RentalMapMarkerViewModel[] = [];
  const pushRental = (partial: PartialRentalMapMarkerViewModel) => {
    enrichAddress(partial);
    enrichDescription(partial);
    result.push({ ...partial, hidden: isHidden(partial.rental.run), starred: isStarred(partial.rental.run) }); 
  };
  for (const marker of markers) {
    if (isRentalMapMarker(marker)) {
      const { type, ...rest } = marker;
      pushRental({ ...rest, gh: null });
      continue;
    }
    if (isRentalGroupMapMarker(marker)) {
      const { type, gh, rentals, ...rest } = marker;
      for (const rental of rentals) {
        pushRental({ ...rest, gh, rental });
      }
      continue;
    }
    console.error(`Unknown marker type: ${JSON.stringify(marker)}`);
  }
  return result;
};
