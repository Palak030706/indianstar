export default {
  async fetch(request, env) {
    const counterNamespace = env.COUNTER // Replace with your namespace binding

    // Parse the request URL
    const url = new URL(request.url)
    
    // Check if the path is '/export' for exporting the counter
    if (url.pathname === '/export') {
      return await handleExport(counterNamespace)
    }

    // Handle other requests by incrementing the counter
    return await handleRequest(counterNamespace)
  }
}

async function handleRequest(counterNamespace) {
  // Fetch the current counter value
  let counterValue = await counterNamespace.get('counter')
  if (counterValue === null) {
    counterValue = 0
  } else {
    counterValue = parseInt(counterValue)
  }

  // Increment the counter
  counterValue += 1

  // Store the new counter value
  await counterNamespace.put('counter', counterValue.toString())

  // Return the current counter value as the response
  return new Response(`Counter value: ${counterValue}`, {
    headers: { 'content-type': 'text/plain' },
  })
}

async function handleExport(counterNamespace) {
  // Fetch the current counter value
  let counterValue = await counterNamespace.get('counter')
  if (counterValue === null) {
    counterValue = 0
  } else {
    counterValue = parseInt(counterValue)
  }

  // Export the counter value (for simplicity, we'll just return it as JSON)
  const exportData = JSON.stringify({ counter: counterValue })

  // Return the export data as a JSON response
  return new Response(exportData, {
    headers: { 'content-type': 'application/json' },
  })
}
 