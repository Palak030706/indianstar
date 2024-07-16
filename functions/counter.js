// Worker script
  export async function handleRequest(context) {
    const COUNTER = context.env;
    const {searchParams}= new URL(context.request.url);
    const {action}=searchParams.get('action');

  // Fetch the current counter value
    let counterValue = await COUNTER.get('counter')
    counterValue = parseInt(counterValue);
    if (action=== increment) {
      counterValue = +1
      }
    // Store the new counter value
    await COUNTER.put('counter', counterValue);
  
    // Return the current counter value as the response
    return new Response(`Counter value`);
}