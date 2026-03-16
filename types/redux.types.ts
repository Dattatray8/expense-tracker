export interface user {
  user: {
    authLoad: boolean;
    userData: {
      username: string;
      email: string;
      image: string;
      [prop: string]: unknown;
    };
    authUser: {
      username: string;
      email: string;
      image: string;
      id: string
    };
    
  };
}
