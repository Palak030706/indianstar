export async function onCommentRequest(context) {
    const { MYKV } = context.env;
    const commentsKey = 'comments';
  
    // Retrieve the existing comments from KV
    let comments = await MYKV.get(commentsKey);
    
    // Initialize comments array if it doesn't exist
    if (comments === null) {
        comments = [];
    } else {
        comments = JSON.parse(comments);
    }
  
    // Parse the incoming request to get the new comment as plain text
    const newComment = await context.request.text();
  
    // Add the new comment to the comments array
    comments.push(newComment);
  
    // Store the updated comments array in KV
    await MYKV.put(commentsKey, comments.string());
  
    // Return the updated comments in the response
    return new Response(comments, {
        headers: { 'content-type': 'text/plain' },
    });
}
