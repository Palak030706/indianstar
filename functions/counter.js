// Worker script
  export async function handleRequest(context) {
    const COUNTER = context.env;
    const {searchParams}= new URL(context.request.url);
    const {action}=searchParams.get('action');

  // Fetch the current counter value
    let counterValue = await COUNTER.get('counter')
    if (counterValue === null) {
      counterValue = 0
    } else {
      counterValue = parseInt(counterValue)
    }
  
    // Increment the counter
    counterValue += 1
  
    // Store the new counter value
    await COUNTER.put('counter', counterValue);
  
    // Return the current counter value as the response
    return new Response(`Counter value`);
}