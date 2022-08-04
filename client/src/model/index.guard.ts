/*
 * Generated type guards for "index.ts".
 * WARNING: Do not manually change this file.
 */
import { Rental, Addr, MapMarker, MapMarkerType, RentalMapMarker, RentalGroupMapMarker, MapSearchResponse } from "./index";

export function isRental(obj: any, _argumentName?: string): obj is Rental {
    return (
        (obj !== null &&
            typeof obj === "object" ||
            typeof obj === "function") &&
        typeof obj.run === "string" &&
        typeof obj.rtype === "string" &&
        typeof obj.htype === "string" &&
        (obj.desc === null ||
            typeof obj.desc === "string") &&
        typeof obj.rent === "number" &&
        typeof obj.area === "string" &&
        typeof obj.lnk === "string" &&
        (obj.img === null ||
            typeof obj.img === "string") &&
        isAddr(obj.addr) as boolean
    )
}

export function isAddr(obj: any, _argumentName?: string): obj is Addr {
    return (
        (obj !== null &&
            typeof obj === "object" ||
            typeof obj === "function") &&
        typeof obj.l1 === "string" &&
        typeof obj.l2 === "string"
    )
}

export function isMapMarker(obj: any, _argumentName?: string): obj is MapMarker {
    return (
        (obj !== null &&
            typeof obj === "object" ||
            typeof obj === "function") &&
        typeof obj.lat === "number" &&
        typeof obj.lon === "number"
    )
}

export function isMapMarkerType(obj: any, _argumentName?: string): obj is MapMarkerType {
    return (
        (obj === MapMarkerType.RENTAL ||
            obj === MapMarkerType.RENTAL_GROUP)
    )
}

export function isRentalMapMarker(obj: any, _argumentName?: string): obj is RentalMapMarker {
    return (
        isMapMarker(obj) as boolean &&
        isRental(obj.rental) as boolean &&
        obj.type === MapMarkerType.RENTAL
    )
}

export function isRentalGroupMapMarker(obj: any, _argumentName?: string): obj is RentalGroupMapMarker {
    return (
        isMapMarker(obj) as boolean &&
        Array.isArray(obj.rentals) &&
        obj.rentals.every((e: any) =>
            isRental(e) as boolean
        ) &&
        obj.type === MapMarkerType.RENTAL_GROUP &&
        typeof obj.gh === "string"
    )
}

export function isMapSearchResponse(obj: any, _argumentName?: string): obj is MapSearchResponse {
    return (
        (obj !== null &&
            typeof obj === "object" ||
            typeof obj === "function") &&
        Array.isArray(obj.mapMarkers) &&
        obj.mapMarkers.every((e: any) =>
        (isRentalMapMarker(e) as boolean ||
            isRentalGroupMapMarker(e) as boolean)
        )
    )
}
