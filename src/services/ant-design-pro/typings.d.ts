declare namespace API {
  type User = {
    id: number;
    username?: string;
    userAccount: string;
    avatarUrl?: string;
    gender?: number;
    phone?: string;
    email?: string;
    userStatus: number;
    createTime?: string;
    updateTime?: string;
    role: number;
    planetCode: string;
  };

  type LoginParams = {
    userAccount: string;
    userPassword: string;
    autoLogin?: boolean;
  };

  type RegisterParams = {
    userAccount: string;
    userPassword: string;
    checkPassword: string;
    planetCode: string;
    email?: string;
    phone?: string;
  };

  interface BaseResponse<T> {
    code: number;
    data: T;
    message: string;
    description?: string;
    timestamp?: number;
  }


}
