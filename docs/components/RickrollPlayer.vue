<template>
  <div class="wrapper">
    <div class="overlay" v-show="!accepted">
      <div class="overlay-body">
        <p class="overlay-title">Cookies and user-generated content</p>
        <p class="overlay-description">
          This website uses cookies to offer you the most relevant information and better understand how you use this website. Please accept cookies for optimal performance.
        </p>
        <div class="overlay-buttons-wrapper">
          <button id="accept-button" class="overlay-button" @click="onAccept">Accept</button>
          <button id="decline-button" class="overlay-button" @click="onAccept">Decline</button>
        </div>
        <a href="https://github.com/kenchou2006" target="_blank" class="overlay-link">Privacy policy</a>
      </div>
    </div>

    <div class="scare">
      <video ref="videoEl" id="video" class="video" loop playsinline></video>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const videoEl = ref(null)
let hls = null
let HlsLib = null
const accepted = ref(false)

const videoSrc = 'https://cdn.jsdelivr.net/gh/kenchou2006/rickroll-site/public/media/video.m3u8'
const fallbackSrc = 'https://cdn.jsdelivr.net/gh/kenchou2006/rickroll-site/public/media/video.mp4'

async function initHLS() {
  const video = videoEl.value
  if (!video) return

  try {
    if (!HlsLib && typeof window !== 'undefined') {
      // Load hls.js from a pinned public ESM CDN at runtime to avoid bundling the dependency
      const mod = await import('https://cdn.jsdelivr.net/npm/hls.js/dist/hls.mjs')
      HlsLib = mod.default || mod
    }

    if (HlsLib && HlsLib.isSupported()) {
      hls = new HlsLib()
      hls.loadSource(videoSrc)
      hls.attachMedia(video)
      hls.on(HlsLib.Events.ERROR, (_event, data) => {
        console.error('HLS.js error:', data)
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Some Safari versions support native HLS
      video.src = videoSrc
    } else {
      video.src = fallbackSrc
    }
  } catch (err) {
    console.error('Failed to initialize HLS (CDN import):', err)
    const video = videoEl.value
    if (video) video.src = fallbackSrc
  }
}

function addGlobalLock() {
  if (typeof document === 'undefined') return
  document.documentElement.classList.add('rickroll-active')
}

function removeGlobalLock() {
  if (typeof document === 'undefined') return
  document.documentElement.classList.remove('rickroll-active')
}

function isFullscreenActive() {
  if (typeof document === 'undefined') return false
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement ||
    false
  )
}

function updateGlobalLock() {
  if (isFullscreenActive()) addGlobalLock()
  else removeGlobalLock()
}

function enterFullScreen() {
  const video = videoEl.value
  if (!video) return

  // Prefer full-screening the overlay/container so the VitePress nav can be hidden reliably.
  // Find the nearest overlay container (.scare) or fallback to the documentElement.
  const container = video.closest?.('.scare') || video.parentElement || (typeof document !== 'undefined' ? document.documentElement : null)

  // iOS Safari: try video-specific fullscreen first for native behavior
  if (video.webkitEnterFullscreen) {
    try { return video.webkitEnterFullscreen() } catch (e) { /* continue to container fullscreen */ }
  }

  // Request fullscreen on the container (preferred) so page-level styles apply and nav can be hidden.
  if (container) {
    const req = container.requestFullscreen || container.webkitRequestFullscreen || container.mozRequestFullScreen || container.msRequestFullscreen
    if (req) return req.call(container)
  }

  // Fallback: try video requestFullscreen if available
  const vidReq = video.requestFullscreen || video.webkitRequestFullscreen || video.mozRequestFullScreen || video.msRequestFullscreen
  if (vidReq) return vidReq.call(video)
}

async function playVideo() {
  const video = videoEl.value
  if (!video) return
  try {
    await video.play()
    await enterFullScreen()
  } catch (e) {
    console.error('Error playing video:', e)
  }
}

function onAccept(e) {
  e?.preventDefault?.()
  accepted.value = true
  // Global lock will be toggled by fullscreen events
  playVideo()
}

function beforeUnloadHandler(e) {
  if (accepted.value) {
    e.preventDefault()
    e.returnValue = ''
    return ''
  }
}

function bindFullscreenListeners() {
  if (typeof document === 'undefined') return
  document.addEventListener('fullscreenchange', updateGlobalLock)
  document.addEventListener('webkitfullscreenchange', updateGlobalLock)
  document.addEventListener('mozfullscreenchange', updateGlobalLock)
  document.addEventListener('MSFullscreenChange', updateGlobalLock)
  const video = videoEl.value
  if (video) {
    // iOS Safari video-specific fullscreen events
    video.addEventListener('webkitbeginfullscreen', addGlobalLock)
    video.addEventListener('webkitendfullscreen', removeGlobalLock)
  }
}

function unbindFullscreenListeners() {
  if (typeof document === 'undefined') return
  document.removeEventListener('fullscreenchange', updateGlobalLock)
  document.removeEventListener('webkitfullscreenchange', updateGlobalLock)
  document.removeEventListener('mozfullscreenchange', updateGlobalLock)
  document.removeEventListener('MSFullscreenChange', updateGlobalLock)
  const video = videoEl.value
  if (video) {
    video.removeEventListener('webkitbeginfullscreen', addGlobalLock)
    video.removeEventListener('webkitendfullscreen', removeGlobalLock)
  }
}

onMounted(() => {
  initHLS()
  const video = videoEl.value
  if (video) {
    video.addEventListener('click', enterFullScreen)
  }
  bindFullscreenListeners()
  window.addEventListener('beforeunload', beforeUnloadHandler)
})

onBeforeUnmount(() => {
  const video = videoEl.value
  if (video) {
    video.removeEventListener('click', enterFullScreen)
  }
  window.removeEventListener('beforeunload', beforeUnloadHandler)
  unbindFullscreenListeners()
  removeGlobalLock()
  if (hls) {
    hls.destroy?.()
    hls = null
  }
})
</script>

<style scoped>
.wrapper {
  position: relative;
  /* Follow site theme background to avoid flash between themes */
  background-color: var(--vp-c-bg, #ffffff);
}

p { margin: 0; }
* { box-sizing: border-box; }

/* Default: keep nav visible by starting below it */
.overlay, .scare {
  position: fixed;
  top: var(--vp-nav-height, 56px);
  left: 0;
  height: calc(100vh - var(--vp-nav-height, 56px));
  width: 100vw;
}

/* Keep our layers above page content but not above hidden nav */
.overlay { z-index: 10010; }
.scare { z-index: 10000; background-color: var(--vp-c-bg, #000); }

p.overlay-title {
  font-size: 24px;
  font-weight: 900;
  color: var(--vp-c-text-1, #000000);
  line-height: 1;
  margin-bottom: 16px;
}

.overlay-button {
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 0 24px;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  border-radius: 4px;
  margin: 4px;
  cursor: pointer;
}

.overlay-buttons-wrapper {
  margin: 24px -8px -8px;
}

#accept-button {
  background-color: var(--vp-c-brand-2, #845ec2);
  color: var(--vp-c-white, #ffffff);
}

#decline-button {
  color: var(--vp-c-brand-2, #845ec2);
  border: 2px solid var(--vp-c-brand-2, #845ec2);
  background: transparent;
}

p.overlay-description {
  font-size: 16px;
  font-weight: 400;
  color: var(--vp-c-text-2, rgba(0, 0, 0, 0.6));
  line-height: 1.25;
  margin-bottom: 16px;
}

a.overlay-link {
  display: inline-block;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  color: var(--vp-c-brand, #845ec2);
  line-height: 1;
  position: relative;
  margin-top: 16px;
}

a.overlay-link::before {
  position: absolute;
  content: "";
  height: calc(50% + 4px);
  width: calc(100% + 8px);
  bottom: -4px;
  left: -4px;
  /* Fallback then theme-aware */
  background-color: rgba(132, 94, 194, 0.1);
  background-image: none;
  background: color-mix(in srgb, var(--vp-c-brand, #845ec2) 10%, transparent);
}

.overlay-body {
  max-width: 512px;
  text-align: center;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji";
}

.overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  /* follow theme bg */
  background-color: color-mix(in srgb, var(--vp-c-bg, #f5f6fa) 80%, transparent);
  padding: 0 24px;
}

video#video {
  height: 100%;
  width: 100%;
  object-fit: cover;
  background-color: var(--vp-c-bg, #000); /* ensure player background matches theme when video not loaded */
}

video#video::-webkit-media-controls-enclosure {
  display: none !important;
}

/* When active (fullscreen), hide nav and stretch to full viewport */
:global(html.rickroll-active) {
  overflow: hidden;
}
:global(html.rickroll-active .VPNav),
:global(html.rickroll-active .VPLocalNav) {
  display: none !important;
}
:global(html.rickroll-active) .overlay,
:global(html.rickroll-active) .scare {
  top: 0;
  height: 100vh;
}
</style>
