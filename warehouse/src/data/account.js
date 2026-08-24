import { createResource } from 'frappe-ui'

export async function updateAccountInfo(values) {
    const getResource = createResource({ url: 'frappe.client.get' })
    const saveResource = createResource({ url: 'frappe.client.save' })

    const doc = await getResource.submit({ doctype: 'User', name: values.email })

    doc.full_name = values.full_name
    doc.username = values.username

    return saveResource.submit({ doc })
}

export function updatePassword(newPassword, userEmail) {
    console.log('Updating password for user email:', userEmail) // Debug log
    
    const changePassword = createResource({
        url: 'frappe.core.doctype.user.user.update_password',
        method: 'POST',
    })
    
    // Use the email as the 'user' parameter
    const payload = { 
        user: userEmail,  // This MUST be the email, not username
        new_password: newPassword 
    }
    console.log('Password update payload:', payload)
    
    return changePassword.submit(payload)
}