<script setup>
import { ref } from 'vue'
import { useThreadsStore } from '../../composables/useThreadsStore'

const store = useThreadsStore()

const mode = ref('login') // 'login', 'register', 'forgot', 'otp'
const email = ref('alex@threads.app')
const password = ref('••••••••')
const username = ref('alex_dev')
const displayName = ref('Alex Rivera')
const otpCode = ref('')
const message = ref('')

const handleLogin = () => {
  if (!email.value || !password.value) return
  store.isLoggedIn = true
  store.currentUser.email = email.value
  store.isAuthModalOpen = false
  message.value = ''
}

const handleRegister = () => {
  if (!email.value || !username.value || !password.value) return
  mode.value = 'otp'
}

const handleVerifyOtp = () => {
  if (otpCode.value.length < 4) {
    message.value = 'Vui lòng nhập mã OTP gồm 4-6 chữ số'
    return
  }
  store.isLoggedIn = true
  store.currentUser.username = username.value
  store.currentUser.display_name = displayName.value || username.value
  store.currentUser.email = email.value
  store.isAuthModalOpen = false
  mode.value = 'login'
  message.value = ''
}

const handleSendForgot = () => {
  if (!email.value) return
  message.value = 'Mã khôi phục đã được gửi đến email ' + email.value
  setTimeout(() => {
    mode.value = 'otp'
  }, 1000)
}

const handleGuestMode = () => {
  store.isLoggedIn = false
  store.isAuthModalOpen = false
}

const handleClose = () => {
  store.isAuthModalOpen = false
}
</script>

<template>
  <div v-if="store.isAuthModalOpen" class="modal-overlay" @click.self="handleClose">
    <div class="modal-content max-w-md relative">
      <!-- Top Glow Accent -->
      <div class="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

      <!-- Close Button -->
      <button @click="handleClose" class="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <div class="p-8">
        <!-- Logo Header -->
        <div class="text-center mb-8">
          <div class="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-500/30">
            R
          </div>
          <h2 class="text-2xl font-black bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            {{ mode === 'login' ? 'Đăng nhập Rocket' : mode === 'register' ? 'Tạo tài khoản mới' : mode === 'forgot' ? 'Quên mật khẩu' : 'Xác thực OTP' }}
          </h2>
          <p class="text-xs text-gray-400 mt-1">
            {{ mode === 'login' ? 'Tham gia mạng xã hội thế hệ mới' : mode === 'register' ? 'Trải nghiệm không giới hạn tính năng' : mode === 'forgot' ? 'Nhập email để nhận mã xác minh' : 'Nhập mã 4 chữ số được gửi tới email' }}
          </p>
        </div>

        <div v-if="message" class="mb-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs text-center">
          {{ message }}
        </div>

        <!-- Login Form -->
        <form v-if="mode === 'login'" @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1">Email / Tên người dùng</label>
            <input
              type="text"
              v-model="email"
              required
              class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              placeholder="alex@threads.app"
            />
          </div>
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="text-xs font-semibold text-gray-400">Mật khẩu</label>
              <button type="button" @click="mode = 'forgot'" class="text-xs text-indigo-400 hover:underline">Quên mật khẩu?</button>
            </div>
            <input
              type="password"
              v-model="password"
              required
              class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            class="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:opacity-95 text-white shadow-lg shadow-indigo-500/20 transition"
          >
            Đăng nhập
          </button>
        </form>

        <!-- Register Form -->
        <form v-else-if="mode === 'register'" @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1">Tên hiển thị</label>
            <input
              type="text"
              v-model="displayName"
              required
              class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              placeholder="Alex Rivera"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1">Username (@handle)</label>
            <input
              type="text"
              v-model="username"
              required
              class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              placeholder="alex_dev"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1">Email</label>
            <input
              type="email"
              v-model="email"
              required
              class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              placeholder="alex@threads.app"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1">Mật khẩu</label>
            <input
              type="password"
              v-model="password"
              required
              class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            class="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:opacity-95 text-white shadow-lg shadow-indigo-500/20 transition"
          >
            Tiếp tục (Nhận mã OTP)
          </button>
        </form>

        <!-- Forgot Password Form -->
        <form v-else-if="mode === 'forgot'" @submit.prevent="handleSendForgot" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1">Email đăng ký</label>
            <input
              type="email"
              v-model="email"
              required
              class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              placeholder="alex@threads.app"
            />
          </div>
          <button
            type="submit"
            class="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white shadow-lg transition"
          >
            Gửi mã xác minh OTP
          </button>
        </form>

        <!-- OTP Form -->
        <form v-else-if="mode === 'otp'" @submit.prevent="handleVerifyOtp" class="space-y-4 text-center">
          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-2">Nhập mã OTP (Ví dụ: 8888)</label>
            <input
              type="text"
              v-model="otpCode"
              maxlength="6"
              required
              class="w-3/4 mx-auto text-center tracking-[0.5em] text-xl font-bold bg-gray-950 border border-gray-800 rounded-xl py-3 text-white focus:outline-none focus:border-indigo-500"
              placeholder="8888"
            />
          </div>
          <button
            type="submit"
            class="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white shadow-lg transition"
          >
            Xác nhận & Đăng nhập
          </button>
        </form>

        <!-- Switch Mode & Guest Flow -->
        <div class="mt-6 pt-4 border-t border-gray-800/60 flex flex-col items-center gap-3 text-xs">
          <div v-if="mode === 'login'">
            Chưa có tài khoản?
            <button @click="mode = 'register'" class="font-bold text-indigo-400 hover:underline ml-1">Đăng ký ngay</button>
          </div>
          <div v-else>
            Đã có tài khoản?
            <button @click="mode = 'login'" class="font-bold text-indigo-400 hover:underline ml-1">Quay lại Đăng nhập</button>
          </div>

          <button
            @click="handleGuestMode"
            class="text-gray-400 hover:text-white underline underline-offset-2 transition"
          >
            Tiếp tục trải nghiệm dưới dạng Khách (Guest mode)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
