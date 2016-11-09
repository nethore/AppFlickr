$(document).ready(function() {

  // On initialise la side nav
  $(".affiche-sidebar").sideNav();

  var flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

  var tagArray = ['css', 'html', 'angularjs', 'php', 'javascript'];


  // Affiche mes photos
  function displayPhotos(data){
		var photoHTML = '';
		$.each( data.items, function(i, photo){
			photoHTML += '<div class="grid-item"><div class="card">';
			photoHTML += '<div class="card-image"><a href="' + photo.link + '"><img src="' + photo.media.m + '"></a></div>';
      photoHTML += '</div></div>';
		});

		$('.grid').html(photoHTML)
    .masonry('remove', $('.grid').find('grid-item'))
    .masonry('destroy')
    .imagesLoaded(function(){
      $('.grid').masonry({
        itemSelector: '.grid-item',
        gutter: 10,
        fitWidth: true,
        columnWidth: 300
      });
    });
	}


  // Au clic sur le bouton add
  $('button#add-tag').click(function(){

    var monTag = $(this).parents('form').find('input#tags').val().toLowerCase();
    // Si il n'est pas vide
    if (monTag !== "") {

      // J'ajoute mon tag au tableau
      tagArray.push(monTag);
      console.log(tagArray);

      // Je vide la barre de nav
      $('ul#nav-mobile li').remove();

      // J'ajoute dynamiquement tous les elements du tableau a la barre de nav
      for (var i = 0; i < tagArray.length; i++) {
        var tagAjoute = '<li><a href="#" name="' + tagArray[i] + '">' + tagArray[i] + '</a></li>';
        $('ul#nav-mobile').prepend(tagAjoute);

        // Reste a ajoiter les chips
        var chipAjoute

      }
      // JE vide le champ
      $(this).parents('form').find('input#tags').val('');
      $(".affiche-sidebar").sideNav('hide');

    }

  });

  // Gere l'état active
  $('#nav-mobile').on('click', 'a', function(){
    $(this).parents('#nav-mobile').find('li').removeClass('active');
    $(this).parent().addClass('active');

  });


  // Charge les images sous flickr en fonction de l'attribut name du lien et affiche les photos en masonry
  $('#nav-mobile').on("click", 'a', function(){
    var tag = $(this).attr('name');
    console.log(tag);

    $.ajax({
     url: flickrAPI,
     dataType: 'jsonp',
     data: {
   			tags: tag,
   			format: "json"
   		},
     success: function(data) {
       displayPhotos(data);
     }
    });
  });



});
