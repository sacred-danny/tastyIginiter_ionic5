export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  password: string;
}

export interface TokenRequest {
  user: User;
}

export interface PrepareLocationRequest {
  houseName: string;
  postcode: string;
}

export interface Address {
  address1: string;
  address2: string;
  postcode: string;
  city: string;
  state: string;
  countryId: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  name?: string;
  areaId?: string;
  deliveryAddress?: string;
  stripeCustomerId?: string;
}
