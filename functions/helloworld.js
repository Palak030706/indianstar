addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  if (url.pathname === '/store') {
      const { key, value } = await request.json()
      await COUNTER.put(key, value)
      return new Response('Stored successfully', { status: 200 })
  }

  return new Response('Not found', { status: 404 })
}