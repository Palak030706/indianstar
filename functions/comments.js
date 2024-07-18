export async function onCommentRequest(context) {
    const { MYKV } = context.env;
    const commentsKey = 'comments';
  
    // Retrieve the existing comments from KV
    let value = await MYKV.get(commentsKey);
    
    // Initialize comments array if it doesn't exist
    if (value === null) {
        value = [];
    } else {
        value = value.split('\n'); // Assuming comments are stored as newline-separated strings
    }
  
    // Parse the incoming request to get the new comment as plain text
    const newComment = await context.request.text();
  
    // Add the new comment to the comments array
    value.push(newComment);
  
    // Store the updated comments array in KV as a newline-separated string
    await MYKV.put(commentsKey, value.join('\n'));
  
    // Return the updated comments in the response
    return new Response(value.join('\n'), {
        headers: { 'content-type': 'text/plain' },
    });
}