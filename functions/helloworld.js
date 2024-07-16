// functions/counter.js

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const counterKey = 'counter';

  // Fetch the current counter value from KV
  let counterValue = await env.COUNTER_NAMESPACE.get(counterKey);
  counterValue = counterValue ? parseInt(counterValue) : 0;

  if (url.pathname === '/api/increment') {
    // Increment counter
    counterValue += 1;
    await env.COUNTER_NAMESPACE.put(counterKey, counterValue.toString());
    return new Response(`Counter incremented to ${counterValue}`, { status: 200 });
  } else if (url.pathname === '/api/decrement') {
    // Decrement counter
    counterValue -= 1;
    await env.COUNTER_NAMESPACE.put(counterKey, counterValue.toString());
    return new Response(`Counter decremented to ${counterValue}`, { status: 200 });
  } else if (url.pathname === '/api/reset') {
    // Reset counter
    counterValue = 0;
    await env.COUNTER_NAMESPACE.put(counterKey, counterValue.toString());
    return new Response(`Counter reset to ${counterValue}`, { status: 200 });
  } else if (url.pathname === '/api/get') {
    // Get counter value
    return new Response(`Counter value is ${counterValue}`, { status: 200 });
  }

  return new Response('Not found', { status: 404 });
}
