
import { Permission, Role} from "../../../config/db";
import { PermissionTypes } from "../utils/permissionType";
import { logger } from "../../../libs/logger/index";


// get unique permissions for role
export const getRolesUniquePermissions = async (permissions: any[]): Promise<any[]> => {
    let filteredPermissionsCopy: any[] = [];
    permissions && permissions.map((element: any) => {
        const elementsIndex = filteredPermissionsCopy.findIndex(
            (item: any) => item?.name === element?.name
        );

        if (elementsIndex >= 0) {
            if (element.action === PermissionTypes.VIEW ) {
                filteredPermissionsCopy[elementsIndex] = {
                    ...filteredPermissionsCopy[elementsIndex],
                    isView: true
                };
            } else if (element.action === PermissionTypes.CREATE || element.action === PermissionTypes.EDIT || element.action === PermissionTypes.DELETE) {
                filteredPermissionsCopy[elementsIndex] = {
                    ...filteredPermissionsCopy[elementsIndex],
                    isEdit: true
                };
            }
        } else {
            let modifiedElement: any;
            if (element.action === PermissionTypes.VIEW ) {
                modifiedElement = { ...element, isView: true }
                filteredPermissionsCopy.push(modifiedElement);
            } else if (element.action === PermissionTypes.CREATE || element.action === PermissionTypes.EDIT || element.action === PermissionTypes.DELETE) {
                modifiedElement = { ...element, isEdit: true }
                filteredPermissionsCopy.push(modifiedElement);
            }
        }
    });
    return filteredPermissionsCopy;
}

// get transformed permission to permission type
export const getRolesTransformedPermissions = async (permissions: any[]): Promise<Permission[]> => {
    let transformedPermission: any[] = [] as any[];

    // get unique permissions
    const uniquePerm = await getRolesUniquePermissions(permissions);

    // transform to Permission type
    transformedPermission = uniquePerm.map(({name, isView, isEdit, description }: { name: string, isView: boolean, isEdit: boolean, description: string }) => ({ name, isView, isEdit, description }));

    return transformedPermission;
}

// transform response to role list response
export const transformRolesListData = async (response: any) => {
    try {
        const roleList: Role[] = response?.map(({ id, name, description }: { id: number, name: string, description: string }) => ({ id, name, description }));
        return roleList;
    } catch (err) {
        logger.error('Failed to transform role list data')
        return err
    }
}

// get transformed role details
export const transformRoleDetailData = async (orignalDetails: any) => {
    try {
        let roleDetails: any = {} as any;
        roleDetails.id = orignalDetails?.id;
        roleDetails.name = orignalDetails?.name;
        roleDetails.description = orignalDetails?.description;
        roleDetails.editable = orignalDetails?.isCustom;
        const permissions = JSON.parse(JSON.stringify(orignalDetails?.rolePermission))
        const uniquePermission: Permission[] = await getRolesTransformedPermissions(permissions);
        roleDetails.permission = uniquePermission;
        return roleDetails;

    } catch (err) {
        logger.error('Failed to transform role details data');
        return null;
    }
}