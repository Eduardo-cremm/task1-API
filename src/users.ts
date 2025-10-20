// Exemplo de arquivo TypeScript
interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [];

export function addUser(user: User): void {
  users.push(user);
}

export function getUsers(): User[] {
  return users;
}
