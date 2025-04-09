//type para usuario 
export interface User {
  id: string;
  name: string;
  email: string;
  vehicles:  Vehicle[];
  createdAt: string;
  updatedAt?: string;
}
// type para veiculo
export interface Vehicle {
  id: number;
  name: string;
  plate: string;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

