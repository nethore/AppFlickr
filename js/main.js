$(document).ready(function() {

  // On initialise la side nav
  $(".affiche-sidebar").sideNav();
  $(".button-collapse").sideNav({
    edge: 'right', // Choose the horizontal origin
    closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
  });


  var flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
  var nombreImg = 20;

  // Sessions storage
  var tagArray = [];
  // Si le SS est vide on definie le tableau par defaut
  if (!sessionStorage.tags) {
    tagArray = ['bateau', 'avion', 'train', 'velo', 'voiture'];
    console.log("SS Vide");
  }
  else { // Sinon on récupère le SS
    tagArray = JSON.parse(sessionStorage.tags);
    console.log("SS", tagArray);
  }

  var regexTag = /[^\, ]+/ig;

  // On initie les menu et les tags en fonction du tableau
  boucleInitTags(tagArray);

  // On lance le premier retrieveDatas
  initMasonryWithLastItem(tagArray);

  // Fonctions

  function initMasonryWithLastItem(array) {
    array = array.reverse();
    var currentTag = array[array.length-1];
    retrieveDatas(flickrAPI, currentTag);
    $('.selecteur li a[name=' + currentTag + ']').parent().addClass('active');
  }

  // Initialise la liste des menus et des chips

  function boucleInitTags(array) {

    array = array.reverse();

    // on vide tout
    $('ul#nav-mobile li').remove();
    $('ul#mobile-demo li').remove();
    $('div.chip-holder div.chip').remove();
    $('ul#mobile-demo p').remove();


    // On itinitalise tout l'html
    var tagAjoute = "";
    var tagAjoute2 = "";
    var chipAjoute = "";

    // On initialise les boutons et tags en fonction du tableau
    for (var i = 0; i < array.length; i++) {
      tagAjoute += '<li><a href="#" name="' + array[i] + '">' + array[i] + '</a></li>';
      console.log(tagAjoute);
      tagAjoute2 += '<li><a href="#" name="' + array[i] + '">' + array[i] + '</a></li>';
      // Reste a ajoiter les chips
      chipAjoute += '<div class="chip" name="' + array[i] + '">' + array[i] + '<i class="close-chip material-icons">close</i></div>';
    }

    // On push l'HTML
    $('div.chip-holder').prepend(chipAjoute);
    $('ul#nav-mobile').prepend(tagAjoute);
    $('ul#mobile-demo').prepend(tagAjoute2);
    $('ul#mobile-demo').prepend('<p>Veuillez sélectionner un tag à afficher :</p>');
  }

  // Affiche mes photos
  function displayPhotos(data){
		var photoHTML = '';

		$.each( data.items, function(i, photo){

      if (i == nombreImg) {
        return false;
      }

			photoHTML += '<div class="grid-item"><div class="card light-blue darken-3">';
			photoHTML += '<div class="card-image waves-effect waves-block waves-light"><img class="activator" src="' + photo.media.m + '"></div>';
      photoHTML += '<div class="card-reveal"><span class="card-title grey-text text-darken-4">Tags<i class="material-icons right">close</i></span><p class="tags"><span>' + photo.tags + '</span></p><p><a class="waves-effect waves-light btn" href="' + photo.link + '" target="_blank">Ouvrir sur Flickr</a></p></div>';
      photoHTML += '</div></div>';

		});

    // On push l'html et on reinitialise masonry
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

  // Retrieve Ajax datas
  function retrieveDatas(api, tag) {
    $.ajax({
     url: api,
     dataType: 'jsonp',
     data: {
        tags: tag,
        format: "json"
      },
     success: function(data) {
       displayPhotos(data);
     }
    });
  }

  // Gère le range selector
  $('input#range-image').change(function(){
    nombreImg = $('input#range-image').val();
    $('span.img-counter').text(nombreImg);
    retrieveDatas(flickrAPI, currentTag);
  });

  // Au clic sur le bouton add
  $('button#add-tag').click(function(){

    var monTag = $(this).parents('form').find('input#tags').val().toLowerCase();
    // Si il n'est pas vide
    if (monTag !== "") {

      var monTagDecoupe = monTag.match(regexTag);

      // J'ajoute mon tag au tableau
      tagArray = tagArray.concat(monTagDecoupe);

      // Je stocke mon array
      sessionStorage.setItem("tags", JSON.stringify(tagArray));

      boucleInitTags(tagArray);
      initMasonryWithLastItem(tagArray);

      // JE vide le champ
      $(this).parents('form').find('input#tags').val('');
    }

  });

  // Gere la suppression des chips
  $('div.chip-holder').on('click', 'i.close-chip', function(){
    var tagName = $(this).parent().attr('name');
    var index = tagArray.indexOf(tagName);
    if (index > -1) {
        tagArray.splice(index, 1);
    }
    // Je stock mon array
    sessionStorage.setItem("tags", JSON.stringify(tagArray));
    boucleInitTags(tagArray);
    initMasonryWithLastItem(tagArray);

  });


  // Gere l'état active
  $('.selecteur').on('click', 'a', function(){
    $(this).parents('.selecteur').find('li').removeClass('active');
    $(this).parent().addClass('active');
    $(this).sideNav('hide');

  });

  // Charge les images sous flickr en fonction de l'attribut name du lien et affiche les photos en masonry
  $('.selecteur').on("click", 'a', function(){
    currentTag = $(this).attr('name');
    retrieveDatas(flickrAPI, currentTag);
  });

  // Mon loader
  $('.loader-div')
    .hide()  // Hide it initially
    .ajaxStart(function() {
        $(this).show();
    })
    .ajaxStop(function() {
        $(this).hide();
    });

});
