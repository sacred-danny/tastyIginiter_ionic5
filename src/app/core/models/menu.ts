export interface MenuOptionValue {
  optionId: string;
  optionValueId: string;
  price: number;
  priority: string;
  value: string;
  isChecked?: boolean;
}

export interface MenuOptions {
  displayType: string;
  maxSelected: string;
  menuId: string;
  menuOptionId: string;
  minSelected: string;
  option?: any;
  optionId: string;
  optionName: string;
  optionValues: Array<MenuOptionValue>;
}
export interface MenuDetailOption {
  menu: MenuDetail;
  options: Array<MenuOptions>;
}

export interface CategoryDetail {
  categoryId: string;
  name: string;
  description: string;
  parentId: string;
  priority: string;
  image: string;
  status: string;
  nestLeft: string;
  nestRight: string;
  permalinkSlug: string;
  menus: Array<MenuDetail>;
}

export interface Category {
  categoryId: string;
  name: string;
  description: string;
  parentId: string;
  priority: string;
  image: string;
  status: string;
  nestLeft: string;
  nestRight: string;
  permalinkSlug: string;
}

export interface MenuDetail {
  menuId: string;
  menuName: string;
  menuDescription: string;
  menuPrice: number;
  menuPhoto: string;
  menuCategoryId: string;
  stockQty: string;
  minimumQty: string;
  subtractStock: string;
  mealtimeId: string;
  menuStatus: string;
  menuPriority: string;
  orderRestriction: string;
  pivot?: any;
}

export interface Special {
  menuId: string;
  categoryId: string;
  menu: MenuDetail;
}

export interface Coupon {
  code: string;
  type: string;
  discount: number;
}

export interface Menu {
  locationId: string;
  locationName: string;
  delivery: string;
  titleOpenTime: string;
  openTime: string;
  specials: Array<Special>;
  categories: Array<Category>;
  categoryDetails: Array<CategoryDetail>;
  deliveryAmount: number;
  deliveryTotal: number;
  coupons: Array<Coupon>;
}

export interface Item {
  name: string;
  count: number;
  extras: string;
  price: number;
  comment: string;
  photo: string;
}

export interface Order {
  totalPrice: number;
  totalCount: number;
  currentPrice?: number;
  items: Array<Item>;
}

export interface CheckOutTime {
  id: number;
  date: string;
  day: string;
  weekDay: string;
  savedCards: any;
  times: Array<SelectTime>;
}

export interface SelectTime {
  orderTime: string;
  showTime: string;
}


