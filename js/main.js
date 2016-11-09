/*
 * Exercice Jquery Materializess GULP SASS
 */
 // Jquery Ajax => Get Json

 /*
  * Exercice MaterializeCSS
  *
  * Generation de profil aléatoire: https://randomuser.me/
     Afficher le gendre, le nom, le prénom,dob la photos, l'email ds une card
  * Créer un bouton "Regenerer le profil" pour regenerer aléatoirement le profil

    Bonus: Créer un bouton afiche d'ajouter 16 utilisateur de plus en GRIS
  * Bonus: Créer un bouton qui permet de voir sur une GMAP V3 https://hpneo.github.io/gmaps/examples/geocoding.html la personnes avec le plugin GMap
  *
  */

(function(){

  $(document).ready(function() {

    $.getJSON('https://jsonplaceholder.typicode.com/photos')
    .done(function(datas){
        console.log(datas);
      });

  });

})();
