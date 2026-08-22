import { createDocumentResource } from 'frappe-ui'

export const portalSettings = createDocumentResource({
    doctype: 'Portal Settings',
    name: 'Portal Settings',
    auto: true,
})

export function fetchPortalSettings() {
    return portalSettings.fetch()
}

export function savePortalSettings(values) {
    return portalSettings.setValue.submit(values)
}