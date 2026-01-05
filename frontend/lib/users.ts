import api from "./api"

export type Role = "admin" | "user"

export async function fetchUserRole(email: string): Promise<Role> {
  const res = await api.get("/users/role", { params: { email } })
  return res.data.role as Role
}

export async function createUser(email: string, role: Role) {
  const res = await api.post("/users", { email, role })
  return res.data
}

export async function listUsers() {
  const res = await api.get("/users")
  return res.data as Array<{ user_id: string; email: string; role: Role }>
}
