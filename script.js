$(document).ready(function() {
    $('#getJokeButton').click(function() {
    
      $.ajax({
            url: 'https://official-joke-api.appspot.com/random_joke',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                setTimeout(function() {
                    $('#jokeDisplay').html(data.setup + ' - ' + data.punchline);
                }, 5000); // Delay for 2000 milliseconds (2 seconds)
            },
            error: function() {
                $('#jokeDisplay').html('An error occurred while fetching the joke.');
            }
        });

        console.log("execute me ...");
    });
});

