addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  if (url.pathname === '/increment') {
    return incrementCounter()
  } else if (url.pathname === '/value') {
    return getCounterValue()
  } else {
    return new Response('Not found', { status: 404 })
  }
}

async function incrementCounter() {
  const counter = await COUNTER_NAMESPACE.get('counter')
  let value = parseInt(counter) || 0
  value += 1
  await COUNTER_NAMESPACE.put('counter', value.toString())
  return new Response(value.toString(), { status: 200 })
}

async function getCounterValue() {
  const counter = await COUNTER_NAMESPACE.get('counter')
  const value = counter ? parseInt(counter) : 0
  return new Response(value.toString(), { status: 200 })
}
