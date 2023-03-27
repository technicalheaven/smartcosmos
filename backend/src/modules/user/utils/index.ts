export const createUserResponse = (data: any) => {    
    try {
      let response = {
        id: data.id,
        username: data.username,
        name: data.name,
        email: data.email,
        imageUrl: data.imageUrl,
        gender: data.gender,
        status: data.status,
        password: data.password,
        contact: data.contact || null,
        tenantId: data.userRole.tenantId,
        roleId: data.userRole.roleId,
        roleName: data.userRole.roleName,
        siteId: data.userRole.siteId,
        zoneId: data.userRole.zoneId || null,
        homeSite:data.userRole.homeSite,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        deletedAt: data.deletedAt,
        createdBy: data.createdBy || null,
        updatedBy: data.updatedBy || null,


      }
      return Promise.resolve(response)
    } catch (err) {
      return Promise.reject(err)
    }
  }