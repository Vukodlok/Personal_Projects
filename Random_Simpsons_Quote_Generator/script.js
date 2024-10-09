//fix script loading order with DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
//fetch a new quote on button click
  document.getElementById('new-quote').addEventListener('click', getQuote);
  
  //fetch a new quote on page load
  getQuote();

  //fetch a quote from Jason Luboff's Simpsons quote API
  function getQuote() {
    fetch('https://thesimpsonsquoteapi.glitch.me/quotes')
    .then(response => response.json())
    .then(data => {
      //access first item in retured array
      const quoteData = data[0];
      console.log(quoteData.quote); // Quote
      console.log(quoteData.character); // Author
      document.getElementById('text').textContent = `"${quoteData.quote}"`;
      document.getElementById('author').textContent = `- ${quoteData.character}`;
      document.getElementById('tweet-quote').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quoteData.quote + ' - ' + quoteData.character)}`; 
      updateScreen();
      })
      //.catch(error => console.error('Error fetching the quote:', error));
  }
  
//function to update the screen
  function updateScreen() {
    //generate random background colors for the body and #quote-box
    const randomBodyColor = getRandomColor();
    const randomDivColor = getRandomColor();
    document.body.style.backgroundColor = randomBodyColor;
    document.getElementById('quote-box').style.backgroundColor = randomDivColor;
  }

  //function to generate a random color
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
});
