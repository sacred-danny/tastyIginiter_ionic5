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
  menuPrice: string;
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

export interface Menu {
  locationId: string;
  locationName: string;
  delivery: string;
  openTime: string;
  specials: Array<Special>;
  categories: Array<Category>;
  categoryDetails: Array<CategoryDetail>;
}


