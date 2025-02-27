<script>
  import { beforeUpdate, afterUpdate, onMount, onDestroy } from "svelte";
  import { chatTopic, user } from "./stores.js";
  import { gun } from "./initGun.js";
  import ScrollToBottom from "./ScrollToBottom.svelte";
  import MessageInput from "./MessageInput.svelte";
  import MessageList from "./MessageList.svelte";
  import Spinner from "./ui/Spinner.svelte";
  import { getMessageSizeInBytes, formatBytes } from "./utils/messageUtils.js";

  const ADD_ON_SCROLL = 50; // messages to add when scrolling to the top
  let showMessages = 100; // initial messages to load

  let store = {};
  let chats = [];
  let autoscroll;
  let showScrollToBottom;
  let main;
  let isLoading = false;
  let timeout;
  let totalBytesUsed = 0;

  $: {
    isLoading = true;
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      // convert key/value object to sorted array of messages (with a max length)
      const arr = Object.values(store);
      const sorted = arr.sort((a, b) => a.time - b.time);
      const begin = Math.max(0, sorted.length - showMessages);
      const end = arr.length;
      chats = arr.slice(begin, end);
      isLoading = false;
    }, 200);
  }

  function scrollToBottom() {
    main.scrollTo({ left: 0, top: main.scrollHeight });
  }
  function deleteChatPage() {
  Object.keys(store).forEach(msgId => {
    gun.get($chatTopic).get(msgId).put(null);
  });

  gun.get($chatTopic).put(null);

  chats = [];
  store = {};

  
}

  function handleScroll(e) {
    showScrollToBottom =
      main.scrollHeight - main.offsetHeight > main.scrollTop + 300;
    if (!isLoading && main.scrollTop <= main.scrollHeight / 10) {
      const totalMessages = Object.keys(store).length - 1;
      if (showMessages >= totalMessages) return;
      isLoading = true;
      setTimeout(() => {
        showMessages += ADD_ON_SCROLL;
        if (main.scrollTop === 0) main.scrollTop = 1;
        isLoading = false;
      }, 200);
    }
  }

  // Check if messages are getting too large
  function handleNewMessage(msg) {
    const now = new Date().getTime();
    const msgId = Gun.text.random();
    const message = { msg, user: $user, time: now };
    
    gun
      .get($chatTopic)
      .get(msgId)
      .put(message);
      
    updateTotalSize();
  }

  function handleDelete(msgId) {
    gun
      .get($chatTopic)
      .get(msgId)
      .put(null);
  }

  function updateTotalSize() {
    totalBytesUsed = Object.values(store).reduce((total, chat) => {
      return total + getMessageSizeInBytes(chat.msg || '');
    }, 0);
  }

  onMount(async () => {
    gun
      .get($chatTopic)
      .map()
      .on((val, msgId) => {
        if (val) {
          store[msgId] = { msgId, ...val };
        } else {
          // null messages are deleted
          delete store[msgId];
          // reassign store to trigger svelte's reactivity
          store = store;
        }
        updateTotalSize();
      });
  });

  beforeUpdate(() => {
    autoscroll =
      main && main.offsetHeight + main.scrollTop > main.scrollHeight - 50;
  });

  afterUpdate(() => {
    if (autoscroll) main.scrollTo(0, main.scrollHeight);
  });

  onDestroy(() => {
    // remove gun listeners
    gun.get($chatTopic).off();
  });
</script>
<div class="button-container">
<button on:click={deleteChatPage}>Delete all🗑️</button>
<span class="data-usage">Data: {formatBytes(totalBytesUsed)}</span>
</div>
<main bind:this={main} on:scroll={handleScroll}>
  {#if isLoading}
    <Spinner />
  {/if}
  <MessageList
    {chats}
    on:delete={e => {
      handleDelete(e.detail);
    }}
  />
</main>

<MessageInput
  on:message={e => {
    handleNewMessage(e.detail);
    scrollToBottom();
  }}
/>

{#if showScrollToBottom}
  <ScrollToBottom onScroll={scrollToBottom} />
{/if}

<style>
  main {
    margin: auto 0 3em 0;
    width: 100%;
    padding: 0.5em 1em 0.5em 1em;
    overflow-y: auto;
  }

  .button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
  }
  button {
    width: fit-content;
    background-color: #F5BF03;
    color: white;
    border-radius: 0.8em;
    padding: 0.3em;
  }
  button:hover{
    background-color: #d7ad22;
  }
  .data-usage {
    margin-left: 1em;
    font-size: 0.8em;
    color: #666;
  }
  
  :global(.dark-mode) .data-usage {
    color: #aaa;
  }

</style>
