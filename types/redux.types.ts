export interface user {
  user: {
    authLoad: boolean;
    userData: {
      username: string;
      email: string;
      image: string;
      [prop: string]: any;
    };
    authUser: {
      username: string;
      email: string;
      image: string;
      id: string
    };
    
  };
}
