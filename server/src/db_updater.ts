import axios from 'axios';
import { MapSearchResponse, Rental } from 'model';
import { isRentalGroupMapMarker } from 'model/index.guard';
import objectHash from 'object-hash';
import * as fs from 'fs';
import dayjs from 'dayjs';

interface RichRental extends Rental {
  foundAt: string;
}

interface RentalHistory {
  id: string;
  versionHash: string;
  versions: RichRental[];
}

export const loadDatabase = async () => {
  for (const id of fs.readdirSync(dataDir)) {
    const versionsFiles = fs.readdirSync(`${dataDir}/${id}`);
    const versions = versionsFiles.map((v) => JSON.parse(fs.readFileSync(`${dataDir}/${id}/${v}`).toString()));
    const cVersionHash = versionHash(versions[0]);
    histories.set(id, {
      id,
      versionHash: cVersionHash,
      versions,
    });
  }
};

const histories: Map<string, RentalHistory> = new Map();

const versionHash = ({ foundAt, ...rest }: RichRental): string => objectHash(rest);

const dataDir = './data';

const updateSingleRentalHistory = (originalRental: Rental, history?: RentalHistory): RentalHistory => {
  const { run: id } = originalRental;
  const rental: RichRental = {
    foundAt: dayjs().format(),
    ...originalRental,
  };

  const cVersionHash = versionHash(rental);
  const result = {
    id,
    versionHash: cVersionHash,
  };

  fs.mkdirSync(`${dataDir}/${rental.run}`, { recursive: true });
  fs.writeFileSync(`${dataDir}/${rental.run}/${cVersionHash}.json`, JSON.stringify(rental, null, '  '));

  if (!history) {
    console.log(`A new version of advertisement has been found, id ${id}`);
    return { ...result, versions: [rental] };
  }
  if (history.versionHash === cVersionHash) {
    return history;
  }
  console.log(`Change detected, id ${id}`);
  console.log(JSON.stringify(rental, null, '  '));
  return { ...result, versions: [rental, ...history.versions] };
};

export const updateDatabase = async () => {
  const rentals = await fetchVoukraoviRentals();
  for (const rental of rentals) {
    const newHistory = updateSingleRentalHistory(rental, histories.get(rental.run));
    histories.set(rental.run, newHistory);
  }

  const rentalIds = new Set(rentals.map(({ run }) => run));
  const idsToRemove: string[] = [];
  histories.forEach((a, key) => {
    if (!rentalIds.has(key)) {
      idsToRemove.push(key);
      console.log(`Advertisement removed: ${key}`);
    }
  });
  idsToRemove.forEach((id) => histories.delete(id));
};

const fetchVoukraoviRentals = async (): Promise<Rental[]> => {
  const {
    data: { mapMarkers },
  } = await axios.post<MapSearchResponse>('https://www.vuokraovi.com/map/map-search', {
    zoom: 12,
    latNE: '61.120128337728254',
    latSW: '61.01183107946681',
    lonSW: '27.97756806237249',
    lonNE: '28.538214119501397',
    sc: {
      rtype: 'apartment rental',
      rentMax: 1000,
      areaMin: 49,
    },
  });

  return mapMarkers.flatMap((e) => (isRentalGroupMapMarker(e) ? e.rentals : e.rental));
};
