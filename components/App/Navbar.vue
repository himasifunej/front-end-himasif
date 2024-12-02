<template>
    <nav class="fixed z-40 top-0 left-0 md:px-16 text-text-primary dark:text-text-primary-dark"
        :class="isOpen ? 'bg-bg-primary dark:bg-bg-primary-dark rounded-b-[32px] border border-border-primary dark:border-border-primary-dark' : 'bg-gradient-to-b from-black/75 to-transparent'">
        <div class="max-w-full mx-auto px-8 py-5 flex flex-wrap items-center justify-between">

            <nuxt-link to="/" class="flex items-center">
                <NuxtImg src="/img/logo/himasif-white.png" sizes="45" width="45" alt="Logo HIMASIF" />
            </nuxt-link>



            <div class="flex items-center space-x-3 lg:order-2">

                <div v-if="!authenticated">
                    <AppButtonSecondary v-if="!authenticated" class="text-white"
                        data-modal-target="authentication-modal" @click="userDropdown.hide()" v-show="!authenticated"
                        data-modal-toggle="authentication-modal">
                        Masuk
                    </AppButtonSecondary>
                </div>

                <button type="button" ref="userDropdownTrigger" v-if="authenticated"
                    class="flex text-sm bg-card-hover dark:bg-card-hover-dark rounded-full border border-border-primary dark:border-border-primary-dark lg:mr-0 focus:ring-0 justify-start items-center py-0.5 pl-0.5 pr-2 gap-2"
                    id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown"
                    data-dropdown-placement="bottom-end">
                    <span class="sr-only">Open user menu</span>

                    <div
                        class="text-center text-text-primary dark:text-text-primary-dark text-lg font-normal font-['Poppins'] leading-7 tracking-widest w-7 h-7 rounded-full bg-card-primary dark:bg-card-primary-dark">
                        A</div>

                    <NuxtImg src="/icon/Iconly/Light/ArrowDown.svg" :alt="'dropdown navbar icon'" width="15"
                        class="w-[10px] invert dark:invert-0" />
                </button>

                <!-- Dropdown menu -->
                <div class="z-50 p-2 hidden text-deskripsi bg-card-primary dark:bg-card-primary-dark rounded-lg border border-border-primary dark:border-border-primary-dark shadow w-32"
                    id="user-dropdown" ref="userDropdownContent">

                    <template v-if="authenticated">
                        <div class="space-y-1.5 text-text-primary dark:text-text-primary-dark w-full">
                            <h5>Hai, {{ getFirstName(username) }} 👋 </h5>

                            <button type="button" data-modal-target="profile-modal" data-modal-toggle="profile-modal"
                                class="w-full bg-card-primary dark:bg-card-primary-dark hover:bg-[#FF6D00] dark:hover:hover:bg-[#FF6D00] active:bg-[#FF7E1D] dark:active:active:bg-[#FF7E1D] px-2 py-1 flex items-center gap-1.5 rounded">
                                <NuxtImg src="/icon/Iconly/Light/Profile-account.svg" class="invert dark:invert-0" width="10"></NuxtImg>
                                <p>Profil</p>
                            </button>

                            <button type="button" data-modal-target="account-modal" data-modal-toggle="account-modal"
                                class="w-full bg-card-primary dark:bg-card-primary-dark hover:bg-[#FF6D00] dark:hover:hover:bg-[#FF6D00] active:bg-[#FF7E1D] dark:active:active:bg-[#FF7E1D] px-2 py-1 flex items-center gap-1.5 rounded">
                                <NuxtImg src="/icon/Iconly/Light/Password.svg" class="invert dark:invert-0" width="12"></NuxtImg>
                                <p>Akun</p>
                            </button>

                            <div class="w-full border-b border-b-border-primary dark:border-b-border-primary-dark">
                            </div>

                            <button type="button" @click="logout()"
                                class="w-full bg-card-primary dark:bg-card-primary-dark hover:bg-[#FF0000] active:bg-[#FF3030] dark:hover:bg-[#FF0000] dark:active:bg-[#FF3030] px-2 py-1 flex items-center gap-1.5 rounded">
                                <NuxtImg src="/icon/Iconly/Light/Logout.svg" class="invert dark:invert-0" width="14"></NuxtImg>
                                <p>Keluar</p>
                            </button>
                        </div>
                    </template>

                    <button type="button" data-modal-target="authentication-modal" @click="userDropdown.hide()"
                        v-show="!authenticated" data-modal-toggle="authentication-modal"
                        class="flex justify-start items-center text-white gap-[5px] pl-2 py-1 pr-12 bg-card-primary dark:bg-card-primary-dark hover:bg-[#ff6d00] active:bg-[#ff7d1d] rounded">
                        <NuxtImg src="/icon/Iconly/Light/ArrowDown.svg" :alt="'dropdown navbar icon'" width="15"
                            class="w-[10px]" />

                        <div class="text-white text-[10px] font-normal leading-[15px]">Masuk
                        </div>
                    </button>


                    <Teleport to="body">

                        <div id="authentication-modal" tabindex="-1" aria-hidden="true"
                            class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center md:inset-0 h-screen bg-black/80">
                            <div class="relative p-4 w-fit max-h-full">
                                <!-- Modal content -->
                                <div
                                    class="relative bg-bg-primary dark:bg-bg-primary-dark border border-border-primary dark:border-border-primary-dark rounded-2xl shadow text-white">
                                    <!-- Modal body -->
                                    <div class="flex">
                                        <div class="relative w-[275px] h-[275px] flex items-center justify-center">

                                            <NuxtImg class="absolute rounded-xl" src="/img/background/login-bg.png"
                                                sizes="300" width="300" height="300">
                                            </NuxtImg>

                                            <div
                                                class="w-full h-full rounded-full absolute bg-bg-primary dark:bg-bg-primary-dark blur-[30px]">
                                            </div>

                                            <NuxtImg src="/img/logo/himasif-white.png" class="mx-auto absolute"
                                                sizes="150" alt="Logo HIMASIF" />
                                        </div>


                                        <div class="py-[18.5px] pl-6 pr-8 w-[400px]" v-show="!isForgetPassword">
                                            <div class="flex">
                                                <h3 class="text-title-4">Masuk</h3>
                                                <div class="absolute bg-bg-primary border dark:bg-bg-primary-dark border-border-primary dark:border-border-primary-dark rounded-full w-8 h-8 top-4 right-4 flex items-center justify-center cursor-pointer"
                                                    data-modal-hide="authentication-modal">
                                                    <svg width="20px" height="20px" fill="#fff" viewBox="-3.5 0 19 19"
                                                        xmlns="http://www.w3.org/2000/svg" class="cf-icon-svg">
                                                        <path
                                                            d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <form class="" @submit.prevent="login()">
                                                <div class="space-y-1 mb-2">
                                                    <label for="email" class="text-deskripsi">Email</label>
                                                    <input type="email" name="email" id="email" v-model="user.email"
                                                        autocomplete="email"
                                                        class="border border-border-primary dark:border-border-primary-dark bg-card-primary dark:bg-card-primary-dark placeholder:text-text-placeholder dark:placeholder:text-text-placeholder-dark text-deskripsi rounded-lg focus:ring-border-primary dark:focus:ring-border-primary-dark focus:border-border-primary dark:focus:border-border-primary-dark block w-full py-2 px-[10px] "
                                                        placeholder="E-mail" required>
                                                </div>

                                                <label for="password" class="text-deskripsi">Password</label>

                                                <div class="relative">

                                                    <input type="password" name="password" id="password"
                                                        placeholder="Password" v-model="user.password"
                                                        autocomplete="current-password" v-if="!passwordShow"
                                                        class="border border-border-primary dark:border-border-primary-dark  bg-card-primary dark:bg-card-primary-dark placeholder:text-text-placeholder dark:placeholder:text-text-placeholder-dark text-deskripsi rounded-lg focus:ring-border-primary dark:focus:ring-border-primary-dark focus:border-border-primary dark:focus:border-border-primary-dark  block w-full py-2 px-[10px] "
                                                        required>
                                                    <input type="text" name="password" id="password"
                                                        placeholder="Password" v-model="user.password"
                                                        autocomplete="current-password" v-else-if="passwordShow"
                                                        class="border border-border-primary dark:border-border-primary-dark  bg-card-primary dark:bg-card-primary-dark placeholder:text-text-placeholder dark:placeholder:text-text-placeholder-dark text-deskripsi rounded-lg focus:ring-border-primary dark:focus:ring-border-primary-dark focus:border-border-primary dark:focus:border-border-primary-dark  block w-full py-2 px-[10px] "
                                                        required>
                                                    <button type="button" @click="togglePassword()"
                                                        class="absolute top-0 right-0 w-8 h-full text-white focus:outline-none">

                                                        <svg width="21" height="20" viewBox="0 0 31 30" fill="none"
                                                            v-show="!passwordShow" class="w-6"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                                d="M26.0222 4.64523C25.656 4.28492 25.0625 4.28492 24.6963 4.64523L22.0866 7.21358C20.0706 5.82863 17.8193 5.09428 15.5 5.09428C12.9289 5.09428 10.4343 5.99427 8.2732 7.67752C6.13818 9.33002 4.35871 11.7133 3.0768 14.6351C2.97467 14.8679 2.97439 15.1318 3.07602 15.3648C4.18303 17.9028 5.66997 20.0319 7.44305 21.6249L4.97884 24.05L4.88806 24.1535C4.61575 24.5147 4.646 25.0272 4.97884 25.3548C5.34495 25.7151 5.93855 25.7151 6.30466 25.3548L26.0222 5.95003L26.1129 5.84655C26.3853 5.48535 26.355 4.97279 26.0222 4.64523ZM8.77046 20.3185L11.4428 17.6886C10.9032 16.907 10.6075 15.9813 10.6075 15.0015C10.6075 12.3355 12.7921 10.1841 15.5 10.1841C16.4902 10.1841 17.4409 10.4772 18.2333 11.0057L20.7365 8.54228C19.1019 7.48819 17.3206 6.93954 15.5 6.93954C13.3628 6.93954 11.2749 7.6928 9.43455 9.1262C7.67227 10.4902 6.16181 12.4509 5.02133 14.8755L4.963 15.0017L5.01969 15.1253C6.0109 17.2435 7.28812 19.0048 8.77046 20.3185ZM16.8669 12.3505C16.4523 12.1426 15.9845 12.0294 15.5 12.0294C13.8279 12.0294 12.4825 13.3544 12.4825 15.0015C12.4825 15.4813 12.5959 15.9369 12.8085 16.3445L16.8669 12.3505ZM19.4207 14.7698L19.5474 14.7837C20.057 14.8739 20.3958 15.3535 20.3042 15.855C19.945 17.8208 18.3739 19.37 16.3777 19.7266C15.8683 19.8176 15.3803 19.485 15.2878 18.9836C15.1953 18.4823 15.5334 18.002 16.0428 17.911C17.2691 17.692 18.238 16.7365 18.4588 15.5284C18.5428 15.0687 18.9594 14.7502 19.4207 14.7698ZM24.2462 10.393C24.6599 10.0865 25.2476 10.1681 25.559 10.5753C26.4663 11.7614 27.2591 13.1231 27.923 14.634C28.0256 14.8675 28.0257 15.1323 27.9232 15.3659C25.3266 21.2861 20.6681 24.9056 15.5 24.9056C14.3235 24.9056 13.1594 24.7183 12.0382 24.3501C11.5471 24.1888 11.2818 23.6662 11.4457 23.1828C11.6096 22.6995 12.1407 22.4384 12.6318 22.5997C13.5622 22.9053 14.5259 23.0603 15.5 23.0603C19.6308 23.0603 23.4763 20.233 25.8409 15.4122L26.0355 15.0017L25.9693 14.8557C25.4935 13.848 24.9556 12.9237 24.3622 12.0927L24.061 11.685C23.7496 11.2779 23.8325 10.6994 24.2462 10.393Z"
                                                                fill="#494949" />
                                                        </svg>

                                                        <svg width="20" height="20" viewBox="0 0 30 30" fill="none"
                                                            v-show="passwordShow" class="w-6"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                                d="M15.3603 5.00602L15.0025 5C9.82635 5 5.16158 8.65385 2.57614 14.6323C2.47462 14.8671 2.47462 15.1329 2.57614 15.3677L2.7553 15.771C5.30798 21.3664 9.7193 24.8304 14.6397 24.994L14.9975 25C20.1737 25 24.8384 21.3461 27.4239 15.3677C27.5267 15.13 27.5253 14.8605 27.4201 14.6238L27.246 14.232C24.6872 8.62614 20.274 5.16933 15.3603 5.00602ZM15.0113 6.86177L15.3099 6.8682L15.6437 6.88556C19.6402 7.16855 23.3157 10.1319 25.5362 14.9989L25.5246 15.0289C23.2484 20.0006 19.4462 22.9816 15.3236 23.1312L15.005 23.136L14.6837 23.1317L14.3508 23.1144C10.4784 22.8401 6.90797 20.043 4.67393 15.4496L4.4625 14.9989L4.65822 14.5827C7.01397 9.71643 10.8644 6.86284 15.0113 6.86177ZM14.9994 10.1418C12.2989 10.1418 10.1106 12.3164 10.1106 15.0002C10.1106 17.6831 12.2991 19.8574 14.9994 19.8574C17.6998 19.8574 19.8894 17.6829 19.8894 15.0002C19.8894 12.3166 17.7 10.1418 14.9994 10.1418ZM14.9994 12.0047C16.6646 12.0047 18.0144 13.3455 18.0144 15.0002C18.0144 16.6539 16.6644 17.9945 14.9994 17.9945C13.3346 17.9945 11.9856 16.6542 11.9856 15.0002C11.9856 13.3452 13.3345 12.0047 14.9994 12.0047Z"
                                                                fill="#494949" />
                                                        </svg>

                                                        <span class="sr-only">Toggle Password</span>
                                                    </button>
                                                </div>

                                                <div @click="isForgetPassword = !isForgetPassword"
                                                    class="cursor-pointer text-deskripsi text-text-secondary dark:text-text-secondary-dark my-4">
                                                    Lupa
                                                    password?</div>

                                                <div class="flex">
                                                    <AppButtonPrimary type="submit"
                                                        :disabled="user.email == '' || user.password == ''"
                                                        data-modal-hide="authentication-modal">Masuk
                                                    </AppButtonPrimary>
                                                </div>
                                            </form>
                                        </div>

                                        <div class="py-[18.5px] pl-6 pr-8 w-[400px]" v-show="isForgetPassword">
                                            <div class="mb-4">
                                                <div>
                                                    <h3 class="text-title-4 mb-4">Ops! Lupa Password</h3>
                                                    <div class="absolute bg-bg-primary dark:bg-bg-primary-dark border border-border-primary dark:border-border-primary-dark rounded-full w-8 h-8 top-4 right-4 flex items-center justify-center cursor-pointer"
                                                        data-modal-hide="authentication-modal"
                                                        @click="isForgetPassword = false">
                                                        <svg width="20px" height="20px" fill="#fff"
                                                            viewBox="-3.5 0 19 19" xmlns="http://www.w3.org/2000/svg"
                                                            class="cf-icon-svg">
                                                            <path
                                                                d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <p
                                                    class="text-deskripsi text-text-secondary dark:text-text-secondary-dark">
                                                    Jangan khawatir!
                                                    Kami siap
                                                    membantu kamu.
                                                    Cukup masukkan alamat email
                                                    yang terdaftar, dan
                                                    kami akan mengirimkan petunjuk untuk mengatur ulang password kamu.
                                                </p>
                                            </div>
                                            <form class="" @submit.prevent="recover()">
                                                <div class="space-y-1 mb-4">
                                                    <label for="recovery-email" class="text-deskripsi">Email</label>
                                                    <input type="email" name="email" id="recovery-email"
                                                        v-model="userRecoveryEmail" autocomplete="email"
                                                        class="border border-border-primary dark:border-border-primary-dark bg-card-primary dark:bg-card-primary-dark placeholder:text-text-placeholder dark:placeholder:text-text-placeholder-dark text-deskripsi rounded-lg focus:ring-border-primary dark:focus:ring-border-primary-dark focus:border-border-primary dark:focus:border-border-primary-dark block w-full py-2 px-[10px] "
                                                        placeholder="Masukan alamat emailmu" required>
                                                </div>

                                                <div class="flex">
                                                    <AppButtonPrimary type="submit" :disabled="userRecoveryEmail == ''"
                                                        data-modal-hide="authentication-modal">Kirimkan link pemulihan
                                                        password
                                                    </AppButtonPrimary>
                                                </div>
                                            </form>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>



                        <div id="profile-modal" tabindex="-1" aria-hidden="true" v-if="authenticated"
                            data-modal-backdrop="static"
                            class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center md:inset-0 h-screen bg-black/80">
                            <div class="relative p-4 w-fit max-h-full">
                                <!-- Modal content -->
                                <div
                                    class="relative bg-bg-primary dark:bg-bg-primary-dark border border-border-primary dark:border-border-primary-dark rounded-2xl shadow text-text-primary dark:text-text-primary-dark">
                                    <!-- Modal body -->
                                    <div>

                                        <div class="relative w-[300px] h-fit">
                                            <div
                                                class="w-full h-full rounded-t-2xl bg-gradient-to-b from-bg-primary/0 to-bg-primary dark:from-bg-primary-dark/0 dark:to-bg-primary-dark absolute top-0 z-10">
                                            </div>

                                            <NuxtImg class="rounded-t-2xl absolute z-0 top-0 left-0 w-full h-full"
                                                src="/img/background/profile-bg.png" sizes="300" width="300"
                                                height="300">
                                            </NuxtImg>

                                            <div class="absolute bg-bg-primary border dark:bg-bg-primary-dark border-border-primary dark:border-border-primary-dark rounded-full w-8 h-8 top-4 right-4 flex items-center justify-center cursor-pointer z-20"
                                                data-modal-hide="profile-modal">
                                                <svg width="20px" height="20px" fill="#fff" viewBox="-3.5 0 19 19"
                                                    xmlns="http://www.w3.org/2000/svg" class="cf-icon-svg">
                                                    <path
                                                        d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z" />
                                                </svg>
                                            </div>

                                            <div class="relative z-10 pt-4 space-y-4">
                                                <h3 class="text-title-4 w-full text-center">
                                                    {{ isEditProfile ? 'Edit Profil' : 'Profil' }}
                                                </h3>

                                                <div
                                                    class="w-24 h-24 text-[50px] leading-[50px] mx-auto rounded-full border border-border-primary dark:border-border-primary-dark flex items-center justify-center text-center bg-card-primary dark:bg-card-primary-dark text-text-primary dark:text-text-primary-dark">
                                                    {{ getUsernameInitial }}
                                                </div>

                                                <div class="text-center space-y-2">
                                                    <h5
                                                        class="text-text-primary dark:text-text-primary-dark text-title-5">
                                                        {{ username }}
                                                    </h5>
                                                    <p
                                                        class="text-text-secondary dark:text-text-secondary-dark text-deskripsi">
                                                        {{ user.email }}</p>


                                                </div>
                                            </div>
                                        </div>



                                        <div class="py-[18.5px] pl-6 pr-8">
                                            <form class="" @submit.prevent="updateProfile()">
                                                <div class="space-y-1 mb-2">
                                                    <label for="name"
                                                        class="text-deskripsi text-text-primary dark:text-text-primary-dark">Nama</label>
                                                    <input type="text" name="name" id="name" v-model="user.email"
                                                        autocomplete="name" :disabled="!isEditProfile"
                                                        class="border border-border-primary dark:border-border-primary-dark bg-card-primary dark:bg-card-primary-dark placeholder:text-text-placeholder dark:placeholder:text-text-placeholder-dark text-deskripsi rounded-lg focus:ring-border-primary dark:focus:ring-border-primary-dark focus:border-border-primary dark:focus:border-border-primary-dark block w-full py-2 px-[10px] disabled:text-text-secondary dark:disabled:text-text-secondary-dark"
                                                        placeholder="Nama" required>
                                                </div>

                                                <div class="space-y-1 mb-2">
                                                    <label for="angkatan"
                                                        class="text-deskripsi text-text-primary dark:text-text-primary-dark">Angkatan</label>
                                                    <input type="text" name="angkatan" id="angkatan"
                                                        v-model="user.email" autocomplete="angkatan"
                                                        :disabled="!isEditProfile"
                                                        class="border border-border-primary dark:border-border-primary-dark bg-card-primary dark:bg-card-primary-dark placeholder:text-text-placeholder dark:placeholder:text-text-placeholder-dark text-deskripsi rounded-lg focus:ring-border-primary dark:focus:ring-border-primary-dark focus:border-border-primary dark:focus:border-border-primary-dark block w-full py-2 px-[10px] disabled:text-text-secondary dark:disabled:text-text-secondary-dark"
                                                        placeholder="Angkatan" required>
                                                </div>

                                                <div class="space-y-1 mb-2">
                                                    <label for="status"
                                                        class="text-deskripsi text-text-primary dark:text-text-primary-dark">Status</label>
                                                    <input type="text" name="status" id="status" v-model="user.email"
                                                        autocomplete="status" disabled
                                                        class="border border-border-primary dark:border-border-primary-dark bg-card-primary dark:bg-card-primary-dark placeholder:text-text-placeholder dark:placeholder:text-text-placeholder-dark text-deskripsi rounded-lg focus:ring-border-primary dark:focus:ring-border-primary-dark focus:border-border-primary dark:focus:border-border-primary-dark block w-full py-2 px-[10px] disabled:text-text-secondary dark:disabled:text-text-secondary-dark"
                                                        placeholder="Status" required>
                                                </div>

                                                <div class="flex mt-8">
                                                    <AppButtonPrimary @click="isEditProfile = true" class="mx-auto"
                                                        v-if="!isEditProfile">
                                                        Edit Profil
                                                    </AppButtonPrimary>

                                                    <AppButtonPrimary type="submit" v-if="isEditProfile"
                                                        class="mx-auto">Simpan
                                                    </AppButtonPrimary>
                                                </div>

                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div id="account-modal" tabindex="-1" aria-hidden="true" v-if="authenticated"
                            data-modal-backdrop="static"
                            class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center md:inset-0 h-screen bg-black/80">
                            <div class="relative p-4 w-fit max-h-full">
                                <!-- Modal content -->
                                <div
                                    class="relative bg-bg-primary dark:bg-bg-primary-dark border border-border-primary dark:border-border-primary-dark rounded-2xl shadow text-text-primary dark:text-text-primary-dark">
                                    <!-- Modal body -->
                                    <div>

                                        <div class="relative w-[300px] h-fit">
                                            <div
                                                class="w-full h-full rounded-t-2xl bg-gradient-to-b from-bg-primary/0 to-bg-primary dark:from-bg-primary-dark/0 dark:to-bg-primary-dark absolute top-0 z-10">
                                            </div>

                                            <NuxtImg class="rounded-t-2xl absolute z-0 top-0 left-0 w-full h-full"
                                                src="/img/background/profile-bg.png" sizes="300" width="300"
                                                height="300">
                                            </NuxtImg>

                                            <div class="absolute bg-bg-primary border dark:bg-bg-primary-dark border-border-primary dark:border-border-primary-dark rounded-full w-8 h-8 top-4 right-4 flex items-center justify-center cursor-pointer z-20"
                                                data-modal-hide="account-modal">
                                                <svg width="20px" height="20px" fill="#fff" viewBox="-3.5 0 19 19"
                                                    xmlns="http://www.w3.org/2000/svg" class="cf-icon-svg">
                                                    <path
                                                        d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z" />
                                                </svg>
                                            </div>

                                            <div class="relative z-10 pt-4 space-y-4">
                                                <h3 class="text-title-4 w-full text-center">Akun</h3>

                                                <div
                                                    class="w-24 h-24 text-[50px] leading-[50px] mx-auto rounded-full border border-border-primary dark:border-border-primary-dark flex items-center justify-center text-center bg-card-primary dark:bg-card-primary-dark text-text-primary dark:text-text-primary-dark">
                                                    {{ getUsernameInitial }}
                                                </div>

                                                <div class="text-center space-y-2">
                                                    <h5
                                                        class="text-text-primary dark:text-text-primary-dark text-title-5">
                                                        {{ username }}
                                                    </h5>
                                                    <p
                                                        class="text-text-secondary dark:text-text-secondary-dark text-deskripsi">
                                                        {{ user.email }}</p>


                                                </div>
                                            </div>
                                        </div>



                                        <div class="py-[18.5px] pl-6 pr-8">


                                            <form class="" @submit.prevent="handleAuthUpdatePassword()"
                                                v-if="!isEditPassword">
                                                <div class="space-y-1 mb-2">
                                                    <label for="email" class="text-deskripsi">Email</label>
                                                    <input type="email" name="email" id="email" v-model="user.email"
                                                        autocomplete="email" disabled
                                                        class="border border-border-primary dark:border-border-primary-dark bg-card-primary dark:bg-card-primary-dark placeholder:text-text-placeholder dark:placeholder:text-text-placeholder-dark text-deskripsi rounded-lg focus:ring-border-primary dark:focus:ring-border-primary-dark focus:border-border-primary dark:focus:border-border-primary-dark block w-full py-2 px-[10px] "
                                                        placeholder="E-mail" required>
                                                </div>

                                                <div class="space-y-1 mb-2">
                                                    <label for="account-update-password"
                                                        class="text-deskripsi">Password</label>
                                                    <input type="password" name="account-update-password"
                                                        id="account-update-password" v-model="userEdit.oldPassword"
                                                        autocomplete="password"
                                                        class="border border-border-primary dark:border-border-primary-dark bg-card-primary dark:bg-card-primary-dark placeholder:text-text-placeholder dark:placeholder:text-text-placeholder-dark text-deskripsi rounded-lg focus:ring-border-primary dark:focus:ring-border-primary-dark focus:border-border-primary dark:focus:border-border-primary-dark block w-full py-2 px-[10px] "
                                                        placeholder="Password" required>
                                                </div>

                                                <div class="flex mt-8">
                                                    <AppButtonPrimary type="submit" class="mx-auto"
                                                        :disabled="user.email == '' || user.password == ''"
                                                        data-modal-hide="authentication-modal">Ubah Password
                                                    </AppButtonPrimary>
                                                </div>
                                            </form>

                                            <form @submit.prevent="handleUpdatePassword()" v-if="isEditPassword">
                                                <div class="space-y-1 mb-2">
                                                    <label for="account-update-password-old"
                                                        class="text-deskripsi">Password Lama</label>
                                                    <input type="password" name="account-update-password-old"
                                                        id="account-update-password-old" v-model="userEdit.oldPassword"
                                                        class="border border-border-primary dark:border-border-primary-dark bg-card-primary dark:bg-card-primary-dark placeholder:text-text-placeholder dark:placeholder:text-text-placeholder-dark text-deskripsi rounded-lg focus:ring-border-primary dark:focus:ring-border-primary-dark focus:border-border-primary dark:focus:border-border-primary-dark block w-full py-2 px-[10px] "
                                                        placeholder="Password lama" required>
                                                </div>

                                                <div class="space-y-1 mb-2">
                                                    <label for="account-update-password-new"
                                                        class="text-deskripsi">Password Baru</label>
                                                    <input type="password" name="account-update-password-new"
                                                        id="account-update-password-new" v-model="userEdit.newPassword"
                                                        class="border border-border-primary dark:border-border-primary-dark bg-card-primary dark:bg-card-primary-dark placeholder:text-text-placeholder dark:placeholder:text-text-placeholder-dark text-deskripsi rounded-lg focus:ring-border-primary dark:focus:ring-border-primary-dark focus:border-border-primary dark:focus:border-border-primary-dark block w-full py-2 px-[10px] "
                                                        placeholder="Password baru" required>
                                                </div>

                                                <div class="space-y-1 mb-2">
                                                    <label for="account-update-password-new-confirm"
                                                        class="text-deskripsi">Konfirmasi
                                                        Password Baru</label>
                                                    <input type="password" name="account-update-password-new-confirm"
                                                        id="account-update-password-new-confirm"
                                                        v-model="userEdit.newPasswordConfirm"
                                                        class="border border-border-primary dark:border-border-primary-dark bg-card-primary dark:bg-card-primary-dark placeholder:text-text-placeholder dark:placeholder:text-text-placeholder-dark text-deskripsi rounded-lg focus:ring-border-primary dark:focus:ring-border-primary-dark focus:border-border-primary dark:focus:border-border-primary-dark block w-full py-2 px-[10px] "
                                                        placeholder="Konfirmasi password baru" required>
                                                </div>

                                                <div class="flex mt-8">
                                                    <AppButtonPrimary type="submit" class="mx-auto"
                                                        :disabled="userEdit.oldPassword == '' || userEdit.newPassword == '' || userEdit.newPasswordConfirm == ''"
                                                        data-modal-hide="authentication-modal">Ubah Password
                                                    </AppButtonPrimary>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                    </Teleport>

                </div>

                <button data-collapse-toggle="main-navbar" type="button" aria-controls="main-navbar"
                    class="inline-flex lg:hidden" aria-expanded="false" id="main-navbar-toggle">
                    <div @click="isOpen = !isOpen" class="cursor-pointer w-8 h-8 relative">
                        <span
                            :class="['block w-full h-0.5 bg-text-primary dark:bg-text-primary-dark absolute top-2/4 transform transition-all duration-300', isOpen ? '-rotate-45' : '-translate-y-1']"></span>
                        <span
                            :class="['block w-full h-0.5 bg-text-primary dark:bg-text-primary-dark absolute top-2/4 transform transition-all duration-300', isOpen ? 'rotate-45' : 'translate-y-1']"></span>
                    </div>
                </button>
            </div>


            <div class="items-center justify-between hidden mt-5 w-screen lg:mt-0 -mx-8 lg:mx-0 lg:flex lg:w-auto lg:order-1"
                id="main-navbar">
                <div class="lg:flex gap-2 rounded-lg h-full"
                    :class="isOpen ? 'bg-bg-primary dark:bg-bg-primary-dark px-8' : 'bg-card-hover dark:bg-card-hover-dark shadow border border-border-primary dark:border-border-primary-dark p-1.5'">

                    <h2 class="text-title-3 text-text-secondary dark:text-text-secondary-dark md:hidden">HIMASIF</h2>

                    <template v-for="navItem in navbarStore?.navItems">
                        <NuxtLink :to="navItem.link" @click="navbarStore.setActiveNav(navItem.link)" class="
                            flex justify-start items-center gap-1
                            rounded-md 
                            px-2 py-1 
                            "
                            :class="navbarStore.activeNav == navItem.link ? 'lg:bg-border-primary dark:lg:bg-border-primary-dark' : 'lg:hover:bg-card-pressed dark:lg:hover:bg-card-pressed-dark'">
                            <NuxtImg :src="'/icon/Iconly/Light/' + navItem.icon" :alt="navItem.title + 'navbar icon'"
                                width="15" class="w-[15px] invert dark:invert-0" />
                            <div
                                class="text-text-primary dark:text-text-primary-dark fill-current text-lg leading-[42px] lg:text-deskripsi">
                                {{ navItem.title }}</div>
                        </NuxtLink>
                    </template>

                    <button id="ButtonDropdownFitur" ref="buttonDropdownFitur" data-dropdown-toggle="dropdownFitur"
                        data-dropdown-placement="bottom-start" type="button"
                        class="flex px-2 py-1 rounded-md justify-start items-center gap-1 w-full lg:w-fit"
                        :class="navbarStore.isFiturActive ? 'lg:bg-border-primary dark:lg:bg-border-primary-dark' : 'lg:hover:bg-card-pressed dark:lg:hover:bg-card-pressed-dark'">
                        <NuxtImg :src="'/icon/Iconly/Light/Fitur.svg'" alt="feature navbar icon" width="15"
                            class="w-[15px] invert dark:invert-0" />


                        <div class="flex justify-between w-full lg:w-fit gap-1">
                            <div
                                class="text-text-primary dark:text-text-primary-dark text-lg leading-[42px] lg:text-deskripsi">
                                Fitur</div>

                            <NuxtImg src="/icon/Iconly/Light/ArrowDown.svg" :alt="'dropdown navbar icon'" width="15"
                                class="w-[10px] invert dark:invert-0" />
                        </div>
                    </button>

                    <div id="dropdownFitur" ref="dropdownFitur"
                        class="z-50 hidden text-sm font-normal bg-card-primary dark:bg-card-primary-dark rounded-lg border border-border-primary dark:border-border-primary-dark shadow">
                        <ul class="p-2 text-base" aria-labelledby="dropdownLargeButton">
                            <li v-for="fiturItem in navbarStore.fiturDropdownItems">
                                <nuxt-link :to="fiturItem.link" @click="navbarStore.setActiveNav(fiturItem.link)"
                                    class="hover:bg-[#FF6D00] active:bg-[#FF7E1D] flex rounded justify-start items-center gap-[7px] px-2 py-1">
                                    <NuxtImg :src="'/icon/Iconly/Light/' + fiturItem.icon" :alt="fiturItem.title + 'navbar icon'"
                                        width="15" class="w-[10px] invert dark:invert-0" />

                                    <div
                                        class="text-text-primary dark:text-text-primary-dark text-[10px] font-normal leading-[15px]">
                                        {{ fiturItem.title }}
                                    </div>
                                </nuxt-link>
                            </li>
                        </ul>
                    </div>

                    <div class="lg:hidden flex justify-between mb-4">
                        <div class="
                            flex justify-start items-center gap-2.5
                            rounded-md 
                            px-2 py-1 
                            ">
                            <div>
                                <NuxtImg :src="'/icon/Iconly/Light/Fitur.svg'" width="15"
                                    class="w-[15px] invert dark:invert-0" />
                            </div>
                            <div
                                class="text-text-primary dark:text-text-primary-dark text-lg leading-[42px] lg:text-deskripsi">
                                Theme</div>
                        </div>

                        <button
                            class="border border-border-primary dark:border-border-primary-dark px-4 text-text-primary dark:text-text-primary-dark rounded-lg"
                            id="themeDropdown" data-dropdown-toggle="theme-dropdown"
                            data-dropdown-placement="bottom-end">{{
                                isDarkMode ? 'Dark' :
                            'Light'}}</button>

                        <div id="theme-dropdown"
                            class="z-10 hidden border border-border-primary dark:border-border-primary-dark bg-bg-primary dark:bg-bg-primary-dark rounded-lg shadow w-44">
                            <ul class="py-2 text-sm text-text-primary dark:text-text-primary-dark"
                                aria-labelledby="dropdownDefaultButton">
                                <li>
                                    <a @click="changeToDark"
                                        class="block px-4 py-2 cursor-pointer">Dark</a>
                                </li>

                                <li>
                                    <a @click="changeToLight" class="block px-4 py-2 cursor-pointer">Light</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="border-t border-t-border-primary dark:border-t-border-primary-dark pt-4 lg:hidden">
                        <AppButtonSecondary v-if="!authenticated" class="text-white">
                            Masuk
                        </AppButtonSecondary>
                    </div>


                </div>

                <div
                    class="px-2.5 py-1.5 bg-card-hover dark:bg-card-hover-dark rounded-lg shadow border border-border-primary dark:border-border-primary-dark hidden lg:flex lg:ml-4">
                    <AppNavbarToggle></AppNavbarToggle>
                </div>
            </div>

        </div>
    </nav>
</template>

<script setup>
import { initDropdowns, initModals, Dropdown, initCollapses, Collapse } from 'flowbite';
import { AppAlertConfirm, AppAlertSuccess, AppAlertError } from '#components';
import { useDarkMode } from '@/composables/useDarkMode';

const { isDarkMode, changeToDark, changeToLight } = useDarkMode();

const isForgetPassword = ref(false)
const isEditProfile = ref(false)
const isEditPassword = ref(false)
const userRecoveryEmail = ref('')
const isOpen = ref(false)

const { authenticateUser, logUserOut } = useAuthStore()
const alertStore = useAlertsStore()
const { authenticated } = storeToRefs(useAuthStore())


const user = ref({
    email: '',
    password: '',
    remember_me: 0
})

const userEdit = ref({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: ''
})

const username = ref(useCookie('username').value)
const navbarStore = useNavbarStore()
const passwordShow = ref(false)
const userDropdownContent = ref(null)
const userDropdownTrigger = ref(null)
const userDropdown = ref(null)

// const navbarTrigger = ref(null)
// const navbarContent = ref(null)
// const navbarCollapse = ref(null)



const getUsernameInitial = computed(() => {
    return username.value[0]
})

function getFirstName(fullName) {
    return fullName.split(" ")[0];
}

const login = async () => {
    await authenticateUser(user.value)

    if (authenticated) {
        username.value = useCookie('username').value
    }
}

const updateProfile = async () => {
    // await 

    alertStore.openModal({
        component: markRaw(AppAlertSuccess),
        props: {
            text: "Sukses Edit Profile"
        }
    })

    isEditProfile.value = false
}

const handleAuthUpdatePassword = async () => {

    if (userEdit.value.oldPassword == user.value.password) {
        userEdit.value.oldPassword = ''
        isEditPassword.value = true
    } else {
        alertStore.openModal({
            component: markRaw(AppAlertError),
            props: {
                text: "Password tidak sesuai"
            }
        })
    }
}

const handleUpdatePassword = async () => {
    //await

    alertStore.openModal({
        component: markRaw(AppAlertSuccess),
        props: {
            text: "Sukses Edit Password"
        }
    })

    isEditPassword.value = false
}

const recover = async () => {

}

const logout = async () => {
    await logUserOut()
    userDropdown.value.hide()
    username.value = ''
    user.value.email = ''
    user.value.password = ''
    user.value.remember_me = 0
}

const togglePassword = () => {
    passwordShow.value = !passwordShow.value
}


onMounted(() => {
    initDropdowns()
    initModals()
    initCollapses()


    // navbarTrigger.value = document.getElementById('main-navbar-toggle')
    // navbarContent.value = document.getElementById('main-navbar')
    // navbarCollapse.value = new Collapse(navbarTrigger, navbarContent)

    userDropdown.value = new Dropdown(userDropdownContent.value, userDropdownTrigger.value, { placement: 'bottom-end' })

    if (!authenticated) {
        navbarStore.setActiveNav('/')
    } else {
        navbarStore.setActiveNav(getRouteLink())
    }
})
</script>

<style scoped>
.addBlur::before {
    content: "";
    position: absolute;
    z-index: -1;
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>