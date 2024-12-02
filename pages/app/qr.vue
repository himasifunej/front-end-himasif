<template>
    <div
        class="bg-bg-primary dark:bg-bg-primary-dark text-text-primary dark:text-text-primary-dark pb-20 md:min-h-screen">
        <AppBackgroundHeader background-image="feature/shorten.webp" />

        <AppContentArea class="-mt-[25vh] lg:-mt-[75vh] z-20">
            <AppContainer class="lg:flex justify-between">
                <FeatureTitle class="w-full text-center lg:text-left lg:w-1/3">HIMASIF QR</FeatureTitle>

                <form class="mt-14 w-full lg:w-2/5" @submit.prevent="generateQr">
                    <div class="mb-4">
                        <input type="text" id="inputLink" v-model="formData.destination_url"
                            class="bg-card-primary dark:bg-card-primary-dark border border-border-primary dark:border-border-primary-dark text-text-primary dark:text-text-primary-dark text-deskripsi-sm md:text-deskripsi placeholder-text-secondary dark:placeholder-text-secondary-dark rounded-lg focus:border-border-primary focus:ring-0 block w-full px-4 py-2.5"
                            placeholder="Masukkan link atau text" required />
                    </div>

                    <div class="flex gap-4 justify-center lg:justify-normal">
                        <div>
                            <input type="radio" id="auto" name="short-type" value="auto" class="hidden peer" required
                                v-model="formData.qrTypePicked" checked />
                            <label for="auto"
                                class="inline-flex text-deskripsi-sm md:text-deskripsi items-center justify-center px-4 py-2.5 bg-card-primary dark:bg-card-primary-dark border border-border-primary dark:border-border-primary-dark text-text-secondary dark:text-text-secondary-dark rounded-lg cursor-pointer peer-checked:bg-card-pressed dark:peer-checked:bg-card-pressed-dark peer-checked:text-text-primary dark:peer-checked:text-text-primary-dark">
                                Normal
                            </label>
                        </div>

                        <div>
                            <input type="radio" id="custom" name="short-type" value="custom" class="hidden peer"
                                v-model="formData.qrTypePicked" />
                            <label for="custom"
                                class="inline-flex text-deskripsi-sm md:text-deskripsi items-center justify-center px-4 py-2.5 bg-card-primary dark:bg-card-primary-dark border border-border-primary dark:border-border-primary-dark text-text-secondary dark:text-text-secondary-dark rounded-lg cursor-pointer peer-checked:bg-card-pressed dark:peer-checked:bg-card-pressed-dark peer-checked:text-text-primary dark:peer-checked:text-text-primary-dark">
                                Add HIMASIF Logo
                            </label>
                        </div>
                    </div>

                    <div class="flex mt-4 space-x-4 justify-center lg:justify-normal">
                        <AppButtonSecondary variant="secondary" type="submit"
                            :disabled="formData.destination_url == '' || qr">
                            Generate QR Code
                        </AppButtonSecondary>
                        <AppButtonSecondary @click="resetForm" v-if="qr">Generate Another</AppButtonSecondary>
                    </div>

                    <section class="mt-4 z-10" v-show="qr">
                        <canvas ref="canvasRef" class="max-w-48 max-h-48 mx-auto lg:m-0 rounded-lg"></canvas>
                        <div class="flex justify-center md:justify-start">
                            <AppButtonSecondary @click="downloadQr" class="mt-4">Download QR Code</AppButtonSecondary>
                        </div>
                    </section>
                </form>
            </AppContainer>
        </AppContentArea>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import QRCode from 'qrcode';

useHead({ title: 'Shorten Link' });

const baseFormData = {
    destination_url: '',
    url_key: '',
    qrTypePicked: 'auto',
};

const qr = ref(null);
const formData = ref({ ...baseFormData });
const qrCanvas = ref(null);
const canvasRef = ref(null);

const generateQr = async () => {
    const canvas = canvasRef.value;

    if (!canvas) {
        console.error('Canvas element is not found.');
        return;
    }

    const customLogo =
        formData.value.qrTypePicked === 'custom' ? '/img/logo/himasif-white.png' : null;

    try {
        await createQrCode(formData.value.destination_url, canvas, customLogo);
        qr.value = true;
    } catch (error) {
        console.error('QR Code generation failed:', error);
    }
};

const downloadQr = () => {
    const canvas = canvasRef.value;

    if (!canvas) {
        console.error('Canvas element is not found.');
        return;
    }

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
};

const resetForm = () => {
    formData.value = { ...baseFormData };
    qr.value = null;
};
</script>