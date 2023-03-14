(function ($) {
    "use strict";
    $(document).ready(function () {
		
		var productName = $('.product_title.entry-title').text();
		

        var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ? 'firefox': '';
        $('body').addClass(isFirefox);
        

        //TODO write explanation about this;
        /**
         * Disable possibility of uncheck newsletter checkbox
         */
        try {

            var newsletter_wrappwe  = document.querySelector('p.mailchimp-newsletter');
            var newsletter_checkbox = document.getElementById('mailchimp_woocommerce_newsletter');

            newsletter_wrappwe.style.visibility = 'hidden';
            newsletter_checkbox.addEventListener('click', function (e) {
                e.preventDefault();
                return false;
            });

        } catch (e) {
            
        }


        /**
         * checkbox
         */
        var checkbox = $('input[type=checkbox]');
        checkbox.change(function () {
            if ($(this).prop("checked")) {
                $(this).parent().addClass('checked');
            } else {
                $(this).parent().removeClass('checked');
            }
        });

        checkbox.focusin(function () {
            $(this).parent().addClass('focused');
        });
        checkbox.focusout(function () {
            $(this).parent().removeClass('focused');
        });

        /**
         * input label
         */
        $(".page-contact input").focus(function () {
            $("label[for='" + this.id + "']:first-child").addClass("labelfocus");
        }).blur(function () {
            if ($(this).val() === '') {
                $("label[for='" + this.id + "']:first-child").removeClass("labelfocus");
            }
        });


        /**
         * video modal
         */
        $('.js-play-video').on('click', function () {
            var url = $(this).data('url');
            var src = $(url).attr('src');

            $('#sogo_simple_iframe').attr('src', src);

            // ajax - set video play
            $.ajax({
                type: 'POST',
                url: sogo.ajaxurl,
                data: {
                    'video_index': $(this).data('post_id')
                },
                success: function (response) {
                }
            });
        });


        /**
         * product slider
         */
        // $('.js-product-slider').slick({
        //     slidesToShow: 1,
        //     nextArrow: '<span class="slick-next icon-arrowright color-9 y-align cursor-pointer"></span>',
        //     prevArrow: '<span class="slick-prev icon-arrowleft color-9 y-align cursor-pointer"></span>',
        //     dots: false,
        // });


        /**
         * testimonial slider
         */
        $('#js-testimonials-slick').slick({
            slidesToShow: 3,
            autoplay: true,
            nextArrow: '<span class="slick-next icon-arrowright color-9 y-align cursor-pointer"></span>',
            prevArrow: '<span class="slick-prev icon-arrowleft color-9 y-align cursor-pointer"></span>',
            responsive: [
                {
                    breakpoint: 993,
                    settings: {
                        arrows: true,
                        slidesToShow: 1
                    }
                }
            ], 
            rtl: $('body').hasClass('rtl')
        });

        /**
         * widget slider
         *
        if (typeof sogoWidgetSlider !== 'undefined') {
            if ('.' + sogoWidgetSlider.js_slider_class.length > 0) {
                $('.' + sogoWidgetSlider.js_slider_class).not('.slick-initialized').slick({
                    slidesToShow: 1,
                    autoplay: true,
                    nextArrow: '<span class="slick-next icon-arrowright color-9 y-align cursor-pointer"></span>',
                    prevArrow: '<span class="slick-prev icon-arrowleft color-9 y-align cursor-pointer"></span>',
                    dots: true, 
					rtl: $('body').hasClass('rtl')
                });
            }

        }

        /**
         * buttons-bar
         */
        /*$(window).on('scroll', function (e) {
            var scroll = $(window).scrollTop();
            if (scroll > 0) {
                $('#js-buttons-bar').removeClass('buttons-bar__hide');
            } else {
                $('#js-buttons-bar').addClass('buttons-bar__hide');
            }
        });*/


        /**
         * display variation color
         */
        $('.swatch-color').on('click', function () {

            var color = $(this).attr('title');
            var $form = $(this).closest('.variations_form');
            $form.find('.js-selected-color').text(color);
 		 
			if($(this).hasClass("selected") == true)
			{
				$(this).prop('disabled', true);
			}
			else
			{
				$(this).prop('disabled', false);
			}
			
			/*
			if(color == 'Purple')
			{
				$(".single_add_to_cart_button").prop('disabled', true);
				$('.product_title.entry-title').text("Sold out").css("color","red");
			}
			else
			{
				$('.product_title.entry-title').text(productName).css("color","#004262");
				$(".single_add_to_cart_button").prop('disabled', false);
			}
			*/
			
            // out of stock
			try{
				var vars = JSON.parse( $form.attr('data-product_variations') );
				var varValue = $(this).data('value');
				//console.log(vars);
				for( var j = 0; j < vars.length; j++)
				{
					if( vars[j].attributes.attribute_pa_color == varValue )
					{
						if( !vars[j].is_in_stock )
						{
							$form.find(".single_add_to_cart_button__cart-text").html('<span style="color:red">'+sogoc.sold_out+'</span>');
							$form.find('.single_add_to_cart_button').prop('disabled', true);
						}
						else
						{
							$form.find(".single_add_to_cart_button__cart-text").text(sogoc.add_to_cart);
							$form.find('.single_add_to_cart_button').prop('disabled', false);
						}
					}
				}
			}catch(e){
			}
			

        });

        /*  $(document).on("click", ".single-product  .swatch ", function (e) {

              if ($(this).parent().parent().hasClass('cart_variations_change')) {
                  return false;
              }
              e.preventDefault();

              var obj = $(this).closest('.tawcvs-swatches');
              obj.find('.swatch').removeClass('selected');
              $(this).addClass('selected');
              var val = $(this).data('value');
              var product_id = $(this).closest('form').find('.variation_id');
              if(product_id.val() == ''){
                  product_id.val(current_product_id);
                  current_product_select.val(val);
              }

              var data = $('.variations_form').data('product_variations');
              data.forEach(function(item){

                  if(item.variation_id ==  product_id.val()){
                      $('.flex-active-slide img').attr({'srcset':item.image.srcset, 'src': item.image.src});
                  }
              });

              // select the ddl
              var extra = obj.closest('.skins__box')
              if (extra.length > 0) {
                  extra.find('select option').filter(function () {
                      console.log($(this).val());
                      console.log(val);
                      return ($(this).val() == val); //To select Blue
                  }).prop('selected', 'selected');
              }

          });*/

        /**
         * dots on single product (mobile)
         */
        var winWidth = $(window).width();
        if (winWidth <= 992) {

        }

        $('.flex-control-nav li').eq($('.flex-active-slide').index()).addClass('active');

        /**
         *smooth slide
         */
        $('a[href^="#"]:not([data-toggle = "collapse"])').on('click', function (e) {
            var obj = $($(this).attr('href'));
            if (obj.length > 0) {
                $('html, body').animate({
                    scrollTop: obj.offset().top - $('header').height()
                }, 500);
            }
            e.preventDefault();
        });


        $('.recommendations-slider').slick({
            rtl: $('body').hasClass('rtl'),
            dots: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplaySpeed: 4000,
            autoplay: true,
            infinite: true,
            asNavFor: '.companies-slider',
            adaptiveHeight: false,
            arrows: true,
            nextArrow: '<span class="icon-arrowrightcircle" aria-hidden="true"></span>',
            prevArrow: '<span class="icon-arrowleftcircle" aria-hidden="true"></span>',
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        adaptiveHeight: true,
                        dots: false
                    }
                }

            ]

        });

        $('.companies-slider').slick({
            dots: false,
            slidesToShow: 4,
            slidesToScroll: 2,
            autoplay: false,
            infinite: true,
            arrows: false,
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2
                    }
                }
            ], 
            rtl: $('body').hasClass('rtl')

        });

        /**
         * product extra accordion arrows
         */
        $('.extra-bottom .card-header > a').on('click', function () {
            $(this).toggleClass('opened');
        });

		

        /**
         * video modal
         */
        $('.video-modal').on('show.bs.modal', function (e) {
            $("#sogo_simple_iframe")[0].src += "&autoplay=1";
        });

        $('.video-modal').on('hidden.bs.modal', function (e) {
            var iframe_src = $("#sogo_simple_iframe")[0].src;
            var src = iframe_src.slice(0, -11);

            $("#sogo_simple_iframe")[0].src = src;
        });

       
        if( $(window).width() > 767 )
        {
	        $('#blog-wrap').imagesLoaded(function(){
		        console.debug('masonry');
		        $('#blog-wrap').masonry();
	        });
        }

        /**
         * video modal
         */
        $('.js-play-video').on('click', function () {
            var url = $(this).data('url');
            var src = $(url).attr('src');

            $('#sogo_simple_iframe').attr('src', src);

            // ajax - set video play
            $.ajax({
                type: 'POST',
                url: sogo.ajaxurl,
                data: {
                    'video_index': $(this).data('post_id')
                },
                success: function (response) {
                }
            });
        });

        $('.video-modal').on('show.bs.modal', function (e) {
            $("#sogo_simple_iframe")[0].src += "&autoplay=1";
        });

        $('.video-modal').on('hidden.bs.modal', function (e) {
            var iframe_src = $("#sogo_simple_iframe")[0].src;
            var src = iframe_src.slice(0, -11);

            $("#sogo_simple_iframe")[0].src = src;
        });

		    /* how-it-works-wrap */
		if( $(window).width() < 768 ) {    
			$('#how-it-works-wrap').slick({
				slidesToShow: 3,
				autoplay: true,
				nextArrow: '<span class="slick-next icon-arrowright color-9 y-align cursor-pointer"></span>',
				prevArrow: '<span class="slick-prev icon-arrowleft color-9 y-align cursor-pointer"></span>',
				responsive: [
					{
						breakpoint: 993,
						settings: {
							arrows: true,
							slidesToShow: 1
						}
					}
				], 
				rtl: $('body').hasClass('rtl')
			});
		}
		

			
		$('#survey-show').click(function(){		
			$('#survey-overlay').show();
		});

		$('#survey-close').click(function(){
			$('#survey-overlay').hide();
		});
		
		
		function getUrlParameter(name) {
			name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
			var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
			var results = regex.exec(location.search);
			return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
		};
 
		if(getUrlParameter('surveyshow') == "1"){$('#survey-overlay').show();}
		
		if(getUrlParameter('mediashow').length > 0){
			var mediaUrl = getUrlParameter('mediashow');			 
			document.getElementById('popupFrame').src = mediaUrl;
			$('#media-overlay').show();
		}
		$('#media-overlay').click(function(){
			$('#media-overlay').hide();
		});
		
		var menu = $('#menu-top-menu'); 
		var li  = menu.find('li')[0];
		var clone_li = $(li).clone();
		
		clone_li.find('a').remove();
		if (location.href.indexOf('my-account') < 0){
			clone_li.removeClass('current-menu-item');
		}
		else{
			clone_li.addClass('current-menu-item');
		}
		clone_li.addClass('custom-menu-item');
		
		var clone_li2 = $(li).clone();
		
		clone_li2.find('a').remove();
		clone_li2.removeClass('current-menu-item');
		clone_li2.addClass('custom-menu-item');

		if ($(window).width() < 765 && menu.find('.custom-menu-item').length == 0){
			clone_li.append('<a href="/my-account/">My Account</a>');
			menu.append(clone_li);
			var path = window.location.pathname;
			var currentLang = "EN";
			var label = "Language";
			if(path.indexOf('/de/')==0){
				currentLang = "DE";
				label = "Sprache";
			}else if(path.indexOf('/fr/')==0){
				currentLang = "FR";
				label = "Langue";
			}else if(path.indexOf('/es/')==0){
				currentLang = "ES";
				label = "Idioma";
			}
			clone_li2.addClass('menu-language');
			var select_options = '';
			if (currentLang == 'EN') select_options +=  '<option selected="selected">EN</option>';
			else select_options+='<option>EN</option>';
			if (currentLang == 'DE') select_options +=  '<option selected="selected">DE</option>';
			else select_options+='<option>DE</option>';
			if (currentLang == 'ES') select_options +=  '<option selected="selected">ES</option>';
			else select_options+='<option>ES</option>';
			if (currentLang == 'FR') select_options +=  '<option selected="selected">FR</option>';
			else select_options+='<option>FR</option>';
			
			clone_li2.append('<label>'+label+': </label><select onchange="dochange(this)">'+																
								select_options+
							'</select>');
						
			menu.append(clone_li2); 
			
			$('.menu-language select option').each(function(index,element){
				if(element.innerText == currentLang){
					$(element).attr('selected',true); 
					$(element).addClass('hidden');
				}else{
					$(element).removeClass('hidden');
				}
			});	
		}
    });

	$( window ).resize(function() {
		var menu = $('#menu-top-menu'); 
		var li  = menu.find('li')[0];
		var clone_li = $(li).clone();
		
		clone_li.find('a').remove();
		if (location.href.indexOf('my-account') < 0){
			clone_li.removeClass('current-menu-item');
		}
		else{
			clone_li.addClass('current-menu-item');
		}
		clone_li.addClass('custom-menu-item');
		
		var clone_li2 = $(li).clone();
		
		clone_li2.find('a').remove();
		clone_li2.removeClass('current-menu-item');
		clone_li2.addClass('custom-menu-item');

		if ($(window).width() < 765 && menu.find('.custom-menu-item').length == 0){
			clone_li.append('<a href="/my-account/">My Account</a>');
			menu.append(clone_li);
			
			clone_li2.addClass('menu-language');
			var path = window.location.pathname;
			var currentLang = "EN";
			var label = "Language";
			if(path.indexOf('/de/')==0){
				currentLang = "DE";
				label = "Sprache";
			}else if(path.indexOf('/fr/')==0){
				currentLang = "FR";
				label = "Langue";
			}else if(path.indexOf('/es/')==0){
				currentLang = "ES";
				label = "Idioma";
			}
			
			var select_options = '';
			if (currentLang == 'EN') select_options +=  '<option selected="selected">EN</option>';
			else select_options+='<option>EN</option>';
			if (currentLang == 'DE') select_options +=  '<option selected="selected">DE</option>';
			else select_options+='<option>DE</option>';
			if (currentLang == 'ES') select_options +=  '<option selected="selected">ES</option>';
			else select_options+='<option>ES</option>';
			if (currentLang == 'FR') select_options +=  '<option selected="selected">FR</option>';
			else select_options+='<option>FR</option>';
			
			clone_li2.append('<label>'+label+': </label><select onchange="dochange(this)">'+																
								select_options+
							'</select>');
			menu.append(clone_li2); 
			
			$('.menu-language select option').each(function(index,element){
				if(element.innerText == currentLang){
					$(element).attr('selected',true); 
					$(element).addClass('hidden');
				}else{
					$(element).removeClass('hidden');
				}
			});				
		}
	});

    $(document).on("click",".lb-trigger",function(){
        var num = $(this).attr('data-num');
        $("#lighbox-wrap,#lb-overlay").show();
        $('#lighbox-wrap img[data-num="'+ num +'"]').attr('data-active','active').show();
    }).on("click","#lb-rarr,#lb-larr",function(){
        var active = $('img[data-active="active"]').attr('data-num');
        if($(this).attr("id")=='lb-rarr'){
            var newNum = parseInt(active) + 1;
            if(newNum==4){newNum=1;}
        }else if($(this).attr("id")=='lb-larr'){
            var newNum = parseInt(active) - 1;
            if(newNum==0){newNum=3;}
        }

        $('#lighbox-wrap img').removeAttr('data-active').hide();
        $('#lighbox-wrap img[data-num="'+ newNum +'"]').attr('data-active','active').show();
    }).on("click","#lb-close,#lb-overlay",function(){
        $("#lighbox-wrap,#lb-overlay").hide();
    });

    setTimeout(function () {
        if(!$(".single_add_to_cart_button").hasClass('liviaVariationKitCart') && !$(".single_add_to_cart_button").hasClass('liviaVariationLiteCart')){
            $(".single_add_to_cart_button").addClass('liviaControlCart');
        }
    },500);


    $(window).on('load', function () {
        /**
         * gallery arrows
         */
        var flexArrows = $('.flex-direction-nav');
        flexArrows.find('.flex-nav-prev').detach().appendTo('.flex-viewport').find('.flex-prev').empty().attr('title', sogoc.single_product_prev_arrow).addClass('icon-arrowleft01 color-5 icon-m focus-hide').addClass('show');
        flexArrows.find('.flex-nav-next').detach().appendTo('.flex-viewport').find('.flex-next').empty().attr('title', sogoc.single_product_next_arrow).addClass('icon-arrowright01 color-5 icon-m focus-hide').addClass('show');


    });
	
	
	add_custom_select();	
	document.addEventListener("click", closeAllSelect);

})(jQuery);


function add_custom_select(){	
	var x, i, j, l, ll, selElmnt, a, b, c;
	/*look for any elements with the class "custom-select2":*/
	x = document.getElementsByClassName("custom-select2");
	l = x.length;
	for (i = 0; i < l; i++) {
	  selElmnt = x[i].getElementsByTagName("select")[0];
	  ll = selElmnt.length;
	  /*for each element, create a new DIV that will act as the selected item:*/
	  a = document.createElement("DIV");
	  a.setAttribute("class", "select-selected");
	  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
	  x[i].appendChild(a);
	  /*for each element, create a new DIV that will contain the option list:*/
	  b = document.createElement("DIV");
	  b.setAttribute("class", "select-items select-hide");
	  for (j = 1; j < ll; j++) {
		/*for each option in the original select element,
		create a new DIV that will act as an option item:*/
		c = document.createElement("DIV");
		c.innerHTML = selElmnt.options[j].innerHTML;
		c.addEventListener("click", function(e) {
			/*when an item is clicked, update the original select box,
			and the selected item:*/
			var y, i, k, s, h, sl, yl;
			s = this.parentNode.parentNode.getElementsByTagName("select")[0];
			sl = s.length;
			h = this.parentNode.previousSibling;
			for (i = 0; i < sl; i++) {
			  if (s.options[i].innerHTML == this.innerHTML) {
				s.selectedIndex = i;
				h.innerHTML = this.innerHTML;
				y = this.parentNode.getElementsByClassName("same-as-selected");
				yl = y.length;
				for (k = 0; k < yl; k++) {
				  y[k].removeAttribute("class");
				}
				this.setAttribute("class", "same-as-selected");
				break;
			  }
			}
			h.click();
		});
		b.appendChild(c);
	  }
	  x[i].appendChild(b);
	  a.addEventListener("click", function(e) {
		  /*when the select box is clicked, close any other select boxes,
		  and open/close the current select box:*/
		  e.stopPropagation();
		  closeAllSelect(this);
		  this.nextSibling.classList.toggle("select-hide");
		  this.classList.toggle("select-arrow-active");
		});
	}
}

function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

