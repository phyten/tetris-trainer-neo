<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const frameRef = ref(null)
const frameLoaded = ref(false)
const gamepadIndex = ref(null)
const loopId = ref(null)
const pressed = new Set()

const buttonKeyMap = {
  0: 'J',
  1: 'K',
  2: 'S',
  3: 'W',
  12: 'W',
  13: 'S',
  14: 'A',
  15: 'D',
}

const statusText = computed(() => {
  if (!frameLoaded.value) return '読み込み中...'
  if (gamepadIndex.value === null) return 'ゲームパッド未接続'
  return `ゲームパッド接続中 (index: ${gamepadIndex.value})`
})

function normalizeKeyCode(key) {
  if (key.length !== 1) return 0
  return key.toUpperCase().charCodeAt(0)
}

function dispatchKey(type, key) {
  const frameWindow = frameRef.value?.contentWindow
  const frameDocument = frameWindow?.document
  if (!frameWindow || !frameDocument) return

  const upperKey = key.toUpperCase()
  const keyCode = normalizeKeyCode(upperKey)
  const eventInit = {
    key: upperKey.toLowerCase(),
    code: `Key${upperKey}`,
    bubbles: true,
    cancelable: true,
    keyCode,
    which: keyCode,
  }

  frameDocument.dispatchEvent(new KeyboardEvent(type, eventInit))
  frameWindow.dispatchEvent(new KeyboardEvent(type, eventInit))
}

function handleButtons(gp) {
  const nextPressed = new Set()

  gp.buttons.forEach((button, index) => {
    if (!button.pressed) return
    const mapped = buttonKeyMap[index]
    if (!mapped) return
    nextPressed.add(mapped)
    if (!pressed.has(mapped)) {
      dispatchKey('keydown', mapped)
    }
  })

  for (const key of pressed) {
    if (!nextPressed.has(key)) {
      dispatchKey('keyup', key)
    }
  }

  pressed.clear()
  for (const key of nextPressed) {
    pressed.add(key)
  }
}

function pollGamepad() {
  const pads = navigator.getGamepads?.() ?? []
  let activePad = null

  for (const pad of pads) {
    if (pad?.connected) {
      activePad = pad
      break
    }
  }

  if (!activePad) {
    gamepadIndex.value = null
    for (const key of pressed) dispatchKey('keyup', key)
    pressed.clear()
    loopId.value = requestAnimationFrame(pollGamepad)
    return
  }

  gamepadIndex.value = activePad.index
  handleButtons(activePad)
  loopId.value = requestAnimationFrame(pollGamepad)
}

function onGamepadConnected(event) {
  gamepadIndex.value = event.gamepad.index
}

function onGamepadDisconnected() {
  gamepadIndex.value = null
}

function onLoadFrame() {
  frameLoaded.value = true
}

onMounted(() => {
  window.addEventListener('gamepadconnected', onGamepadConnected)
  window.addEventListener('gamepaddisconnected', onGamepadDisconnected)
  loopId.value = requestAnimationFrame(pollGamepad)
})

onBeforeUnmount(() => {
  window.removeEventListener('gamepadconnected', onGamepadConnected)
  window.removeEventListener('gamepaddisconnected', onGamepadDisconnected)
  if (loopId.value) cancelAnimationFrame(loopId.value)
  for (const key of pressed) dispatchKey('keyup', key)
  pressed.clear()
})
</script>

<template>
  <main class="trainer-shell">
    <header class="toolbar">
      <h1>TETRiS TRAiNER TRÈS-BiEN (Clone)</h1>
      <p>{{ statusText }}</p>
      <p>A/Y: 回転, B: 逆回転, 十字キー左右: 移動, 下: ソフトドロップ, 上: ハードドロップ</p>
    </header>
    <iframe
      ref="frameRef"
      title="Tetris Trainer Legacy"
      src="/legacy/index.html"
      class="legacy-frame"
      @load="onLoadFrame"
    />
  </main>
</template>

<style scoped>
.trainer-shell {
  min-height: 100vh;
  background: #f3f4f6;
  display: grid;
  grid-template-rows: auto 1fr;
}

.toolbar {
  padding: 8px 16px;
  border-bottom: 1px solid #d1d5db;
  background: #fff;
}

.toolbar h1 {
  margin: 0;
  font-size: 18px;
}

.toolbar p {
  margin: 2px 0;
  font-size: 12px;
}

.legacy-frame {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
