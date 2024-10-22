//fix script loading order with DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
  const editor = document.getElementById('editor');
  const preview = document.getElementById('preview');
  //enable breaks in marked to interpret carriage returns as line breaks
  marked.setOptions({
    breaks: true
  });
  
  //set default text
  const defaultMarkdown = `
  # Welcome to Markdown Previewer
  
  ## The text you type in the top preview box with be converted to markdown in the bottom markdown box
  
  The [API](https://cdnjs.com/libraries/marked) used for this project
  
  \`inline code looks like this\`
  
  \`\`\`
  //We could write the code below to make a list of breakfast cereals
  - Booberry
  - Cap n' Crunch
  - Fruity Pebbles
  
  The list will look like...
  \`\`\`
  
  - Booberry
  - Cap n' Crunch
  - Fruity Pebbles
  
  The purpose of this project was a freeCodeCamp project
  
  > Objective: Build an app that is functionally similar to this: https://markdown-previewer.freecodecamp.rocks/.
  
  **Enjoy Zoidberg**
  
  ![Zoidberg eating a fish](data:image/jpeg;base64,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)
  `;
  
  editor.value = defaultMarkdown;
  
  //update screen function
  function updatePreview() {
    const markdownText = editor.value;
    //convert markdown to html
    const htmlContent = marked.parse(markdownText);
    //set preview to converted html
    preview.innerHTML = htmlContent;
  }
  
  //event listener for editor textbox
  editor.addEventListener('input', updatePreview);
  
  //initialize screen
  updatePreview();
});
