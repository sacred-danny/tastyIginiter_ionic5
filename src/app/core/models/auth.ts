export interface LoginRequest {
  email: string;
  password: string;
  fcmToken?: string;
  deviceType?: string;
}

export interface SignUpRequest {
  userId?: string;
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  password: string;
  isFacebook?: boolean;
  fcmToken?: string;
  deviceType?: string;
}

export interface PrepareLocationRequest {
  houseName: string;
  postcode: string;
}

export interface Location {
  locationId: string;
  locationName: string;
  offerDelivery: boolean;
  offerCollection: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
  locations: Array<Location>;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  telephone: string;
  areaId: string;
  locationId: string;
  deliveryAddress: string;
  stripeCustomerId: string;
  isFacebook: boolean;
  isPush: boolean;
}
