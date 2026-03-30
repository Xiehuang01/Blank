<template>
  <div class="relative flex flex-col items-center justify-center w-full h-screen bg-paper-bg font-sans select-none overflow-hidden">
    <!-- Container for the whole animation -->
    <div class="relative w-full h-80 flex flex-col items-center justify-center animate-group-flow">
      
      <!-- Envelope Group -->
      <div class="relative w-64 h-44 flex items-center justify-center">
        
        <!-- Postcard / Letter -->
        <div class="absolute z-10 w-48 h-32 bg-white border border-stone-200 rounded-sm shadow-md flex flex-col p-3 animate-postcard-in overflow-hidden">
          <!-- Postcard Header/Stamp Area -->
          <div class="flex justify-between items-start mb-2">
            <div class="space-y-1.5 w-1/2">
              <div class="w-12 h-1 bg-stone-100 rounded-full"></div>
              <div class="w-16 h-1 bg-stone-100 rounded-full"></div>
            </div>
            <!-- Stamp -->
            <div class="w-10 h-12 bg-stone-50 border-2 border-dashed border-stone-200 rounded-sm flex items-center justify-center relative">
              <div class="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center">
                <div class="w-3 h-3 rounded-full border border-stone-200"></div>
              </div>
              <div class="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></div>
              <div class="absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>

          <!-- Postcard Body -->
          <div class="flex h-full gap-4">
            <!-- Left Side: Message -->
            <div class="flex-1 space-y-2 pt-1">
              <div class="w-full h-1 bg-stone-100 rounded-full"></div>
              <div class="w-full h-1 bg-stone-100 rounded-full"></div>
              <div class="w-4/5 h-1 bg-stone-100 rounded-full"></div>
              <div class="w-3/5 h-1 bg-stone-100 rounded-full"></div>
            </div>
            
            <!-- Divider -->
            <div class="w-px h-full bg-stone-100"></div>

            <!-- Right Side: Address -->
            <div class="flex-1 space-y-3 pt-4">
              <div class="w-full border-b border-stone-100 h-1"></div>
              <div class="w-full border-b border-stone-100 h-1"></div>
              <div class="w-4/5 border-b border-stone-100 h-1"></div>
            </div>
          </div>
          
          <!-- Subtle Texture Overlay -->
          <div class="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px]"></div>
        </div>

        <!-- Envelope Back Layer (Interior Color) -->
        <div class="absolute inset-0 bg-envelope-inner border border-gray-100 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.02)] z-0"></div>

        <!-- Envelope Flap (Triangle pointing UP when open, flips DOWN to close) -->
        <div 
          class="absolute top-0 left-0 w-full h-24 -translate-y-full z-5 animate-flap-sync"
          :style="{ 
            clipPath: 'polygon(0 100%, 100% 100%, 50% 0)',
            backgroundColor: '#f7e7ce',
            borderBottom: '1px solid #e7d7be',
          }"
        ></div>

        <!-- Envelope Front Folds -->
        
        <!-- Left Triangle -->
        <div 
          class="absolute inset-0 z-20"
          :style="{ 
            clipPath: 'polygon(0 0, 50% 50%, 0 100%)',
            backgroundColor: '#f0e0c7',
            borderRight: '1px solid #e7d7be'
          }"
        ></div>

        <!-- Right Triangle -->
        <div 
          class="absolute inset-0 z-20"
          :style="{ 
            clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)',
            backgroundColor: '#f0e0c7',
            borderLeft: '1px solid #e7d7be'
          }"
        ></div>

        <!-- Bottom Triangle -->
        <div 
          class="absolute inset-0 z-20"
          :style="{ 
            clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)',
            backgroundColor: '#e0d0b7',
            borderTop: '1px solid #d7c7ae'
          }"
        ></div>

        <!-- Shadow below envelope -->
        <div class="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-3 bg-black/5 blur-xl rounded-full"></div>
      </div>
    </div>

    <!-- Loading Text -->
    <div class="mt-4 text-gray-300 font-light tracking-[0.5em] text-[8px] uppercase">
      Processing
    </div>
  </div>
</template>

<script setup lang="ts">
// No logic needed for now
</script>

<style scoped>
/* Scoped styles can be added here if needed, but we use Tailwind and global CSS for animations */
</style>
