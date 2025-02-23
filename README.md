# Role-Based Access Control (RBAC) in TypeScript

This repository implements a **Role-Based Access Control (RBAC)** system in TypeScript. It allows defining **roles**, **permissions**, and **resources**, ensuring strict type safety while supporting boolean and function-based permission checks.

## 🚀 Features
- ✅ Strongly typed **permissions system**
- ✅ Supports **boolean and dynamic function-based** permissions
- ✅ Ensures **all roles define explicit permissions**
- ✅ Scalable and easy to extend

## 📂 File Structure
```
📦 your-repo-name
 ┣ 📜 roles.ts  # Defines roles, permissions, and access check function
 ┣ 📜 README.md  # Documentation
```

## 📖 How It Works
### **1. Define Resources and Actions**
Permissions are grouped under **resources**, and each resource supports **specific actions**:
```ts
export type Permissions = {
  data_objects: {
    action: "inventory" | "evidence" | "metadata" | "table";
  };
  evidence: {
    action: "evidence" | "create_data_firewall";
  };
};
```

### **2. Define Roles and Permissions**
Roles explicitly define **which actions they can perform**:
```ts
const ROLES = {
  admin: {
    data_objects: { inventory: true, evidence: true, metadata: true, table: true },
    evidence: { evidence: true, create_data_firewall: true },
  },
  readOnlyUser: {
    data_objects: { inventory: true, evidence: false, metadata: false, table: false },
    evidence: { evidence: true, create_data_firewall: true },
  },
} as const satisfies RolesWithPermissions;
```

### **3. Define Users and Check Permissions**
Users have **one or more roles**, and permissions are validated using `hasPermission`:
```ts
export function hasPermission<Resource extends keyof Permissions>(
  user: User,
  resource: Resource,
  action: Permissions[Resource]["action"]
): boolean {
  return user.roles.some((role) => {
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[action];
    return typeof permission === "function" ? permission(user) : !!permission;
  });
}
```

### **4. Usage Example**
```ts
const user: User = { id: "123", roles: ["admin"] };

console.log(hasPermission(user, "data_objects", "inventory")); // true
console.log(hasPermission(user, "data_objects", "metadata")); // true
```

## 📌 How to Extend
- Add **new roles** in `ROLES`
- Define new **resources and actions** in `Permissions`
- Implement **custom permission functions** inside `ROLES`


## 📜 License
This project is licensed under the MIT License.

