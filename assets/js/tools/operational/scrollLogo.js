$(document).ready(function() {
	$(window).bind('scroll', function() {
		if ($(this).scrollTop() > 0) {
			$('header.menu div.logo img').addClass('scoll')
	    } else{
	    	$('header.menu div.logo img').removeClass('scoll')
	    }
	  	
	});
	/*$('div.responShow.close, div.responShow.openMenu').click(function() {
		

		if ($('header.menu').hasClass('showResponsive')) {
			console.log("La tiene al darle click al icono")
			$('header.menu').removeClass('showResponsive');
		}else{
			console.log("No la tiene al darle click al icono")
			$('header.menu').addClass('showResponsive');
		}
		$('header.menu').toggleClass('showResponsive');
		$('body').toggleClass('noScroll');
	});*/
	
});

function menuActions(activate){
	console.log("click")
	if (activate) {
		if ($('header.menu').hasClass('showResponsive')) {
			$('header.menu').removeClass('showResponsive');
			$('body').removeClass('noScroll');
		};
		console.log("si sirve")
	}else{
		if (!$('header.menu').hasClass('showResponsive')) {
			$('header.menu').addClass('showResponsive');
			$('body').addClass('noScroll');
		};
	}
}
