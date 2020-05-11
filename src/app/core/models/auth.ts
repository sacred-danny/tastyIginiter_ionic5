export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  first_name: string;
  last_name: string;
  telephone: string;
  email: string;
  password: string;
}

export interface SetLocationRequest {
  postCode: string;
  houseNumber: string;
  userId: string;
  token: string;
  address?: Address;
}

export interface Address {
  customer_id: string;
  address_1: string;
  address_2: string;
  postcode: string;
  city: string;
  state: string;
  country_id: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  mobile: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country_id: string;
  access_token: string;
}
