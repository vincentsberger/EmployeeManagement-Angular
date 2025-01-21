import { AuthGuardData, createAuthGuard } from 'keycloak-angular';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { inject } from '@angular/core';
import Keycloak from 'keycloak-js';

/**
 * The logic below is a simple example, please make it more robust when implementing in your application.
 *
 * Reason: isAccessGranted is not validating the resource, since it is merging all roles. Two resources might
 * have the same role name and it makes sense to validate it more granular.
 */
const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  __: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  const { authenticated, grantedRoles } = authData;

  // const requiredRole = route.data['role'];
  // if (!requiredRole) {
  //   return false;
  // }

  // const hasRequiredRole = (role: string): boolean =>
  //   Object.values(grantedRoles.resourceRoles).some((roles) => roles.includes(role));

  // if (authenticated && hasRequiredRole(requiredRole)) {
  //   return true;
  // }

  const keycloak = inject(Keycloak);
  if (!keycloak.authenticated) {
    keycloak.login();
  }

  return true;
};

export const canActivateAuthRole =
  createAuthGuard<CanActivateFn>(isAccessAllowed);
