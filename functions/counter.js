// Worker script
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  async function handleRequest(request) {
    const counterNamespace = COUNTER // Replace with your namespace binding
  
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