export async function onRequest(context) {
    const { MYKV } = context.env;
    const counterKey = 'counter';
  
    // Retrieve the current counter value from KV
    let value = await MYKV.get(counterKey);
    
    // Initialize the counter if it doesn't exist
    if (value === null) {
      value = 0;
    } else {
      value = parseInt(value, 10);
    }
  
    // Increment the counter
    value= 2*value;
  
    // Store the new value in KV
    await MYKV.put(counterKey, value.toString());
  
    // Return the current counter value in the response
    return new Response(`${value}`, {
      headers: { 'content-type': 'text/plain' },
    });
  }