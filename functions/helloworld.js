addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const path = url.pathname

  // Initialize the KV namespace
  const kv = VIEW_COUNTER

  // Get the current count from KV
  let count = await kv.get(path)

  // If there's no count yet, initialize it
  if (count === null) {
    count = 0
  } else {
    count = parseInt(count)
  }

  // Increment the count
  count++

  // Store the new count in KV
  await kv.put(path, count.toString())

  // Return the count as the response
  return new Response(`This page has been viewed ${count} times.`)
}
  