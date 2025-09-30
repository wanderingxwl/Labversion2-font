<script setup lang="ts">
import { ref } from "vue";
import "pdfjs-viewer-element";

const src = ref<string | null>("https://snippet.embedpdf.com/ebook.pdf");
const viewerPath = ref<string | null>("/dist/pdfjs-dist");
const page = ref<string | null>("2");
const locale = ref<string | null>("uk");
const zoom = ref<string | null>("auto");
const pagemode = ref<string | null>("none");
const search = ref<string | null>(null);
const phrase = ref<boolean>(true);
const textLayer = ref<string | null>("hover");
const viewerCssTheme = ref<string | null>("DARK");
</script>

<template>
  <main>
    <pdfjs-viewer-element
      class="viewer"
      :src="src"
      :viewer-path="viewerPath"
      :locale="locale"
      :page="page"
      :search="search"
      :phrase="phrase"
      :zoom="zoom"
      :pagemode="pagemode"
      :text-layer="textLayer"
      :viewer-css-theme="viewerCssTheme"
    />
  </main>
</template>

<style>
.viewer {
  height: 100vh;
  height: 100dvh;
}
</style>
