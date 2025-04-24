interface AddressType {
    locality: string | null;
    city: string | null;
    region: string | null;
    country: string | null;
    label: string | null;
    lat: number;
    long: number;
}

interface GeocodingAPIResponse {
    response?: {
        features?: Array<{
            properties?: {
                locality?: string;
                city?: string;
                region?: string;
                country?: string;
                label?: string;
            };
        }>;
    };
}

const GEOCODIFY_API_KEY = process.env.GEOCODIFY_API_KEY;

/**
 * Fetches an Address of AddressType
 * @param latitude - Latitude of location
 * @param longitude - Longitude of location
 * @returns - A promise that resolves into AddressType object
 * @throws - An error if the API fails
 */
async function reverseGeoLocation(
    latitude: number,
    longitude: number,
): Promise<AddressType> {
    const url = `https://api.geocodify.com/v2/reverse?api_key=${GEOCODIFY_API_KEY}&lat=${latitude}&lng=${longitude}`;

    try {
        const response = await fetch(url, { mode: 'cors' });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(
                'Geocoding API Error: ',
                response.status,
                response.statusText,
                errorText,
            );
            throw new Error(
                `Geocoding response API Error: , ${response.status} ${response.statusText} - ${errorText}`,
            );
        }

        const resJson: GeocodingAPIResponse = await response.json();
        const properties = resJson?.response?.features?.[0]?.properties;

        return {
            locality: properties?.locality ?? null,
            city: properties?.city ?? null,
            region: properties?.region ?? null,
            country: properties?.country ?? null,
            label: properties?.label ?? null,
            lat: latitude,
            long: longitude,
        } as AddressType;
    } catch (error: any) {
        throw new Error(`Geocoding fetch API Error: ${error.message || error}`);
    }
}

/**
 * Constructs a human-readable address string from an AddressType object.
 * The address is built from locality, city, region, and country parts,
 * or the label if available. If none of these are present, it returns
 * the latitude and longitude.
 *
 * @param address - The AddressType object containing address components.
 * @returns - A string representing the formatted address.
 */
function resolveAddress(address: AddressType): string {
    const parts = [
        address.locality,
        address.city,
        address.region,
        address.country,
    ].filter(Boolean) as string[]; // Filter out null/undefined and assert as string[]

    if (parts.length > 0) return parts.join(', ');
    if (address.label) return address.label;
    return `${address.lat},${address.long}`;
}

/**
 * Retrieves a formatted address string from geolocation coordinates.
 * It uses the reverseGeoLocation function to fetch the address data and
 * then formats it using the resolveAddress function.
 *
 * @param geolocation - A GeolocationPosition object containing the latitude and longitude.
 * @returns - A Promise that resolves to a string representing the formatted address.
 * @throws - An Error if the reverse geocoding process fails. The Error message
 * will provide context about the underlying geocoding error.
 */
export async function getAddressFromLocation(geolocation: GeolocationPosition) {
    const { latitude, longitude } = geolocation.coords;
    try {
        const address = await reverseGeoLocation(latitude, longitude);
        return resolveAddress(address);
    } catch (error: any) {
        throw new Error(
            `Error transpiling geoLocation: ${error.message || error}`,
        );
    }
}
