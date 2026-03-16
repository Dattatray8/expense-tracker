export interface user {
  user: {
    authLoad: boolean;
    userData: {
      username: string;
      email: string;
      image: string;
      monthlyIncome: number;
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
