export interface LoginRequest {
  email: string;
  password: string;
}

export interface Notification {
  token: string;
  phoneType: string;
}

export interface SignUpRequest {
  userId?: string;
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  password: string;
  isFacebook?: boolean;
  notification?: Notification;
}

export interface PrepareLocationRequest {
  houseName: string;
  postcode: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  telephone?: string;
  areaId?: string;
  locationId?: string;
  deliveryAddress?: string;
  stripeCustomerId?: string;
  isFacebook?: boolean;
}
