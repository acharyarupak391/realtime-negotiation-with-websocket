async function handleCopy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error("Error copying text to clipboard", error);
  }
}

export { handleCopy }