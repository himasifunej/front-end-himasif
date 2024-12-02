// composables/useDarkMode.js
export function useDarkMode() {
    // Create a state to manage dark mode
    const isDarkMode = useState('isDarkMode', () => true); // Default to true for dark mode
  
    // Use onMounted to manipulate the DOM when the component is mounted
    onMounted(() => {
      const html = document.documentElement;
      html.classList.add('dark'); // Add 'dark' class by default
    });
  
    // Function to toggle dark mode
    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
      document.documentElement.classList.toggle('dark', isDarkMode.value);
    };

    const changeToDark = () => {
      isDarkMode.value = true
      document.documentElement.classList.add('dark')
    }

    const changeToLight = () => {
      isDarkMode.value = false
      document.documentElement.classList.remove('dark')
    }
  
    return { isDarkMode, toggleDarkMode, changeToDark, changeToLight };
  }