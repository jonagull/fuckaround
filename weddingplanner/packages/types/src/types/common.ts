
export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;

    latitude: number;
    longitude: number;
    placeId: string;
}


export interface Personalia {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    phoneCountryCode: string;
}
