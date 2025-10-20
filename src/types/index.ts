export interface ErrorResponse {
  error?: string;
}

export interface ResponseType<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationQuery {
  page: number | string;
  limit: number | string;
  search?: string;
  timeFilter?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
  statusFilter?: string;
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface PaginatedResponse<T = any>
  extends ResponseType<{ paginationInfo: PaginationInfo; data: T }> {}

export interface ICheckIn {
  _id: string;
  user: {
    _id: string;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
  };

  checkedInBy: {
    _id: string;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
  };
  checkInType: "self" | "admin";
  createdAt: string;
}
