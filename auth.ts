/**
 * Defines the available permissions in the system.
 * Each resource (e.g., `data_objects`, `evidence`) has a set of actions it supports.
 */
export type Permissions = {
  data_objects: {
    action: "inventory" | "evidence" | "metadata" | "table";
  };
  evidence: {
    action: "evidence" | "create_data_firewall";
  };
};

/**
 * Defines roles and their associated permissions.
 * Each role is mapped to specific actions under each resource.
 * Permissions can be `true` (granted), `false` (denied), or a function for dynamic checks.
 */
const ROLES = {
  admin: {
    data_objects: {
      inventory: true,
      evidence: true,
      metadata: true,
      table: true,
    },
    evidence: {
      evidence: true,
      create_data_firewall: true,
    },
  },
  readOnlyUser: {
    data_objects: {
      inventory: true,
      evidence: false,
      metadata: false,
      table: false,
    },
    evidence: {
      evidence: true,
      create_data_firewall: true,
    },
  },
  "read OnlyWithDataObject": {
    data_objects: {
      inventory: true,
      evidence: true,
      metadata: true,
      table: true,
    },
    evidence: {
      evidence: true,
      create_data_firewall: true,
    },
  },
} as const satisfies RolesWithPermissions;

/**
 * Defines the allowed roles in the system.
 */
export type Role = "readOnlyUser" | "admin" | "read OnlyWithDataObject";

/**
 * Defines the possible values for a permission:
 * - `true` → Access is granted.
 * - `false` → Access is denied.
 * - `(user: User) => boolean` → Conditional access based on user properties.
 */
type PermissionCheck = boolean | ((user: User) => boolean);

/**
 * Defines the structure of the `ROLES` object.
 * - Each role has a set of permissions for different resources.
 * - Each resource has specific actions, each with a permission check.
 */
type RolesWithPermissions = {
  [R in Role]: {
    [Key in keyof Permissions]: {
      [Action in Permissions[Key]["action"]]: PermissionCheck;
    };
  };
};

export type User = {
  id: string;
  roles: Role[];
};

/**
 * Checks if a user has permission to perform a given action on a resource.
 *
 * @param user - The user attempting the action.
 * @param resource - The resource being accessed.
 * @param action - The action being performed.
 * @returns `true` if the user has permission, `false` otherwise.
 */
export function hasPermission<Resource extends keyof Permissions>(
  user: User,
  resource: Resource,
  action: Permissions[Resource]["action"]
): boolean {
  return user.roles.some((role) => {
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[
      action
    ];

    if (permission === null) return false; // Explicitly deny if null (should not happen in this setup)
    if (typeof permission === "function") return permission(user); // Handle function-based permissions
    return permission; // Return boolean value
  });
}
