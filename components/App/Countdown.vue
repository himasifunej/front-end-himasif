<template>
  <div>
    <div class="grid grid-cols-4">
      <div class="text-center">
        <h2 class="text-8xl font-bold">{{ timerOutput?.days}}</h2>
        <p class="text-3xl">Days</p>
      </div>

      <div class="text-center">
        <h2 class="text-8xl font-bold">{{ timerOutput?.hours}}</h2>
        <p class="text-3xl">Hours</p>
      </div>
      
      <div class="text-center">
        <h2 class="text-8xl font-bold">{{ timerOutput?.minutes}}</h2>
        <p class="text-3xl">Minutes</p>
      </div>

      <div class="text-center">
        <h2 class="text-8xl font-bold">{{ timerOutput?.seconds}}</h2>
        <p class="text-3xl">Seconds</p>
      </div>

    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  'end': String
})

const countDownToTime = new Date(props.end).getTime()
const timerOutput = ref(null)

const startTimer = function() {
  const timeNow = new Date().getTime();
  const timeDifference = countDownToTime - timeNow;
  const millisecondsInOneSecond = 1000;
  const millisecondsInOneMinute = millisecondsInOneSecond * 60;
  const millisecondsInOneHour = millisecondsInOneMinute * 60;
  const millisecondsInOneDay = millisecondsInOneHour * 24;
  const differenceInDays = timeDifference / millisecondsInOneDay;
  const remainderDifferenceInHours = (timeDifference % millisecondsInOneDay) / millisecondsInOneHour;
  const remainderDifferenceInMinutes = (timeDifference % millisecondsInOneHour) / millisecondsInOneMinute;
  const remainderDifferenceInSeconds = (timeDifference % millisecondsInOneMinute) / millisecondsInOneSecond;
  const remainingDays = Math.floor(differenceInDays);
  const remainingHours = Math.floor(remainderDifferenceInHours);
  const remainingMinutes = Math.floor(remainderDifferenceInMinutes);
  const remainingSeconds = Math.floor(remainderDifferenceInSeconds);
  timerOutput.value = {
    days: remainingDays,
    hours: remainingHours,
    minutes: remainingMinutes,
    seconds: remainingSeconds
  }
  // timerOutput.value = remainingDays + " Days " + ": " + remainingHours + " Hours " + ": " + remainingMinutes + " Minutes " + ": " + remainingSeconds + " Seconds";
}

onMounted(() => {
  setInterval(() => { startTimer() }, 1000);
})

</script>

<style></style>