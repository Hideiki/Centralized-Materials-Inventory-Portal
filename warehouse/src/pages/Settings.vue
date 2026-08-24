<template>
    <div class="min-h-screen flex-1 bg-gray-50 p-6 space-y-6">
        <!-- HEADER -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <button @click="toggle" class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-600 transition">
                    <FeatherIcon type="menu" />
                </button>
                <div>
                    <h2 class="text-2xl font-semibold text-gray-800">Settings</h2>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                    <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                        <FeatherIcon type="user" class="text-blue-700" />
                    </div>
                    <div class="text-sm leading-tight">
                        <p class="font-semibold text-base text-gray-800">
                            {{ currentUser?.username || 'User' }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <p class="text-sm text-gray-500">Manage system configuration and preferences.</p>
        </div>
        
        <div class="w-full">
            <!-- ACCOUNT SETTINGS -->
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div class="flex items-center gap-3 mb-5">
                    <div class="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                        <FeatherIcon type="user" class="text-white" size="18" />
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-800">Account Settings</h3>
                        <p class="text-xs text-gray-500">Update your account information.</p>
                    </div>
                </div>

                <div v-if="accountError" class="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                    {{ accountError }}
                </div>

                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input type="text" v-model="account.full_name"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 
                                focus:ring-blue-500" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input type="text" v-model="account.username"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 
                                focus:ring-blue-500" />
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" v-model="account.email" disabled
                            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 disabled:opacity-70" />
                        <p class="text-xs text-gray-400 mt-1">Email cannot be changed here.</p>
                    </div>

                    <div class="pt-2 border-t border-gray-100">
                        <p class="text-sm font-medium text-gray-700 mb-3">Change Password</p>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <div class="relative">
                                    <input :type="showNewPw ? 'text' : 'password'" v-model="account.new_password" 
                                    placeholder="New password" class="w-full px-3 py-2 pr-9 border border-gray-300 
                                    rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                    <button type="button" @click="showNewPw = !showNewPw" class="absolute right-2.5 top-1/2 
                                    -translate-y-1/2 text-gray-600">
                                        <FeatherIcon :type="showNewPw ? 'eye-off' : 'eye'" size="16" />
                                    </button>
                                </div>
                            </div>
                            <div class="relative">
                                    <input :type="showNewPw ? 'text' : 'password'" v-model="account.confirm_password" 
                                    placeholder="Confirm password" class="w-full px-3 py-2 pr-9 border border-gray-300 
                                    rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                    <button type="button" @click="showNewPw = !showNewPw" class="absolute right-2.5 top-1/2 
                                    -translate-y-1/2 text-gray-600">
                                        <FeatherIcon :type="showNewPw ? 'eye-off' : 'eye'" size="16" />
                                    </button>
                                </div>
                        </div>
                    </div>

                    <div class="flex justify-end pt-2">
                        <button @click="saveAccount" :disabled="savingAccount" class="flex items-center gap-2 bg-blue-800 
                        hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-60">
                            <FeatherIcon type="save" size="14" />
                            {{ savingAccount ? 'Saving...' : 'Save Changes' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <p class="text-center text-xs text-gray-400 pt-4">
            Centralized Materials Inventory Portal © {{ currentYear }}. All rights reserved.
        </p>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import FeatherIcon from 'vue-feather'
import { useSidebar } from '../composables/useSidebar'
import { currentUser } from '../data/user.js'
import { updateAccountInfo, updatePassword } from '../data/account.js'
import { useToast } from 'vue-toastification'

const { toggle } = useSidebar()
const toast = useToast()
const currentYear = new Date().getFullYear()

const account = reactive({
    full_name: '',
    username: '',
    email: '',  // This should store the email
    new_password: '',
    confirm_password: '',
})
const savingAccount = ref(false)
const accountError = ref('')
const showNewPw = ref(false)

watch(currentUser, (u) => {
    console.log('Current user data:', u) // Debug: check what's available
    if (u?.name) {
        // Use name as email (in Frappe, name is usually the email)
        account.full_name = u.full_name || u.username || ''
        account.username = u.username || ''
        account.email = u.name || u.email || ''  // name is the email
        console.log('Account email set to:', account.email)
    }
}, { immediate: true })

async function saveAccount() {
    accountError.value = ''

    if (!account.full_name.trim()) {
        accountError.value = 'Full Name cannot be empty.'
        return
    }

    const wantsPasswordChange = account.new_password || account.confirm_password
    if (wantsPasswordChange) {
        if (account.new_password !== account.confirm_password) {
            accountError.value = 'New password and confirmation do not match.'
            return
        }
        if (account.new_password.length < 8) {
            accountError.value = 'New password must be at least 8 characters.'
            return
        }
    }

    // IMPORTANT: Make sure we have the email
    if (!account.email) {
        accountError.value = 'User email not found. Please refresh the page.'
        return
    }

    savingAccount.value = true
    try {
        // 1. Update account info
        await updateAccountInfo({
            email: account.email,
            full_name: account.full_name,
            username: account.username,
        })

        // 2. If password change is requested
        if (wantsPasswordChange) {
            // Use the email here, not the username!
            await updatePassword(
                account.new_password,
                account.email  // This should be "administrator@example.com", not "Administrator"
            )
            account.new_password = ''
            account.confirm_password = ''
        }

        toast.success('Account settings saved!')
    } catch (err) {
        console.error(err)
        accountError.value = err?.message || 'Failed to save account settings.'
    } finally {
        savingAccount.value = false
    }
}
</script>