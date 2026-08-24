import { createListResource } from "frappe-ui";

export const roleList = createListResource({
    doctype: 'Role',
    fields: ['name'],
    filters: [['name', 'in', ['Inventory Manager', 'Warehouse Staff', 'CMIP Administrator']]],
    orderBy: 'name asc',
    limit: 100,
    auto: true
})

export function fetchRoles() {
    roleList.fetch()
}