import apiServices from "../apiServices"
import endpoints from "../endpoints"

export const getPotentialRolesApi = async () => {
    const result = await apiServices.get(endpoints.getPotentialRoles)
    return result?.data?.data
}