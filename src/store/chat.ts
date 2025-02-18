import { ref } from 'vue'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function useChatStore() {
  const messages = ref<Message[]>([])
  const isLoading = ref(false)

  const addMessage = (message: Message) => {
    messages.value.push(message)
  }

  const clearMessages = () => {
    messages.value = []
  }

  return {
    messages,
    isLoading,
    addMessage,
    clearMessages
  }
}