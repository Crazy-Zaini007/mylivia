(function ($) {
    "use strict";
    $(document).ready(function () {

        //mobile menu
        $('#js-stripes-menu').on('click', function () {
            $('body').toggleClass('mobile-menu-opened');
        });

        //fixed header
        $(window).on('scroll', function () {
            var body = $('body');
            body.addClass('fixed-header');
            if ($(window).scrollTop() === 0) {
                body.removeClass('fixed-header');
            }
        });

        //responsive manipulation
        function responsiveManipulation() {
            if ($(window).width() < 992) {
                var header = $('.s-header');
                var headerHeight = header.height() + 'px';
                var pageHeight = header.height() + 19 + 'px';
                var page = $('.js-page');
                var nav = $('#js-nav');
               
                page.css('padding-top', pageHeight);
                nav.css('top', headerHeight);

                if ($(window).width() >= 768) {
                    pageHeight = header.height() + 20 + 'px';
                    page.css('padding-top', pageHeight);
                    nav.css('top', headerHeight);
                }
            } else {
                $('body.home .js-page').css('padding-top', '5rem');
                $('#js-nav').css('top', 'inherit');
            }
        }

        responsiveManipulation();
        $(window).on('resize', function () {
            responsiveManipulation();
        });
		
		var path = window.location.pathname;
		var currentLang = "EN";
		if(path.indexOf('/de/')==0){
			currentLang = "DE";
		}else if(path.indexOf('/fr/')==0){
			currentLang = "FR";
		}else if(path.indexOf('/es/')==0){
			currentLang = "ES";
		}

		$('.my-language .select-items div').each(function(index,element){
			if(element.innerText == currentLang){
				$(element).click(); 
				$(element).addClass('hidden');
			}else{
				$(element).removeClass('hidden');
			}
		})

		$('.menu-language select option').each(function(index,element){
			if(element.innerText == currentLang){
				$(element).attr('selected',true); 
				$(element).addClass('hidden');
			}else{
				$(element).removeClass('hidden');
			}
		});
		
		
		
		$('.my-language .select-items div').on('click',function(ev){
				changeLang(this.innerText);
		})

    });


})(jQuery);

function changeLang(lang){
	var lang = lang.toLowerCase();
		var cleanedPath = window.location.pathname;
		if(cleanedPath.indexOf('/de/')==0 || cleanedPath.indexOf('/fr/')==0 || cleanedPath.indexOf('/es/')==0)
			cleanedPath = cleanedPath.substring(3);
		console.log(lang,"LANG",cleanedPath)
		if(lang == "en"){
			window.location.href = "/";
		}else{
			window.location.href = "/"+lang;
		} 
}

function dochange(obj){
	changeLang($(obj).val());
}