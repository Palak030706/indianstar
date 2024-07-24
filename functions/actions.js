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
    const url = new URL(context.request.url);
    const action = url.searchParams.get('increment');
  
    const operations = {
        increment: (val) => val + 1,
        decrement: (val) => val - 1,
        half: (val) => val / 2,
        double: (val) => val * 2,
      };
    
      // Check if the action is valid
      if (operations[increment]) {
        value = operations[increment](value);
      } else {
        return new Response('Invalid action', {
          status: 400,
          headers: { 'content-type': 'text/plain' },
        });
      }
    
      // Store the new value in KV
      await MYKV.put(counterKey, value.toString());
    
      // Return the current counter value in the response
      return new Response(`Counter value: ${value}`, {
        headers: { 'content-type': 'text/plain' },
      });
    }