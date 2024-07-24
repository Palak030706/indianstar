export async function onRequest(context) {
  const { MYKV } = context.env;
  const counterKey = 'counter';

  // Retrieve the current counter value from KV
  let value = await MYKV.get(counterKey);

  // Initialize the counter if it doesn't exist
  if (value === null) {
    value = 0;
  } else {
    value = parseFloat(value, 10);
  }

  // Get the action parameter from the request URL
  const url = new URL(context.request.url)
  const action = url.searchParams.get('action');

  // Perform the appropriate action
  switch(action) {
    case 'increment':
      value += 1;
      break;
    case 'decrement':
      value -= 1;
      break;
    case 'half':
      value /= 2;
      break;
    case 'double':
      value *= 2;
      break;
      case 'reset':
        value = 0;
        break;
    default:
      return new Response('Invalid action', {
        status: 400,
        headers: { 'content-type': 'text/plain' },
      });
  }

  // Store the new value in KV
  await MYKV.put(counterKey, value.toString());

  // Return the current counter value in the response
  return new Response(`{value}`, {
    headers: { 'content-type': 'text/plain' },
  });
}