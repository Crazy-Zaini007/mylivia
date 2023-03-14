(function ($) {
    "use strict";
    $(window).bind("load", function () {

		// uk amazon
		if( $('body').hasClass('country-GB') )
		{
			//$('.woocommerce-variation-add-to-cart').html('<a href="https://www.amazon.co.uk/stores/page/A0CA7DD4-9528-4368-8E97-4C7A5DE2EF9B" target="_blank" class="amazon"></a>');
		}


        var current_product_id = $('.variations_form').find('.variation_id').val();
        var current_product_select = $('.variations_form').find('[name=attribute_pa_color]');
        // $('.woocommerce-product-gallery img.flex-active').closest('li').addClass('dot-active');

        $('.single_add_to_cart_button').click(function () {
            $(this).addClass('loading');
        });

        /**
         *  Author: Oren
         *  change the variation
         */
        $(document).on("click", ".single-product  .swatch ", function (e) {

            e.preventDefault();
			

            var obj, val, data, product, variation_id, extra, product_id, add_to_card_btn;

            obj = $(this).closest('.tawcvs-swatches');
            val = $(this).data('value');

            obj.find('.swatch').removeClass('selected');
            $(this).addClass('selected');

            //If is not product on slider
            if ($(this).closest('.variations').hasClass('cart_variations_change')) {				
                product    = $(this).parent().parent();
                data       = $(this).closest('.cart_variations_change').data('variations');
                add_to_card_btn =  $(this).closest('.skins__box').find('a');

                //Json of all variations
                data.forEach(function(item){
                    if(item.attributes.attribute_pa_color ===  val){
                        variation_id = item.variation_id;

                        add_to_card_btn.attr('data-variation_id', variation_id);
                        variation_id = '';
                        product.closest('.skins__box').find('.skins__img-wrapper img').attr({'srcset':item.image.srcset, 'src': item.image.src});
                    }
                });

                // select the ddl
                extra = obj.closest('.skins__box');

                if (extra.length > 0) {
                    extra.find('select option').filter(function () {
                        return ($(this).val() == val); //To select Blue
                    }).prop('selected', 'selected');
                }

            //If is product on slider
            } else {
				
                product_id = $(this).closest('form').find('.variation_id');
				
                if(product_id.val() == ''){
                    product_id.val(current_product_id);
                    current_product_select.val(val);
                }

                data = $('.variations_form').data('product_variations');			

                data.forEach(function(item){

                    if(item.variation_id ==  product_id.val()){
						if ($('.flex-active-slide img').length == 0){
							$('.woocommerce-product-gallery__wrapper .woocommerce-product-gallery__image img').attr({'srcset':item.image.srcset, 'src': item.image.src});
						}else
						{
							$('.flex-active-slide img').attr({'srcset':item.image.srcset, 'src': item.image.src});
						}
                    }
                });

                // select the ddl
                extra = obj.closest('.skins__box');

                if (extra.length > 0) {
                    extra.find('select option').filter(function () {
                        return ($(this).val() == val); //To select Blue
                    }).prop('selected', 'selected');
                }
            }



        });


        /**
         *  Add skins to cart
         */
        $(document).on('click', '.skin_ajax_add_to_cart', function (e) {
            e.preventDefault();
            console.log($(this).closest('.skins__box').find('select').val());
            var btn = $(this),
                product_id   = $(this).data("product_id"),
                variation_id = $(this).data("variation_id"),
                product_container = $(this).closest('.skins__box'),
                quantity = 1,
                variation = product_container.find('select').val();


            btn.addClass('loading');

            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: sogo.ajaxurl,
                data: {
                    action: "sogo_skin_add_to_cart",
                    product_id: product_id,
                    variation_id: variation_id,
                    quantity: quantity,
                    variation: variation
                },
                success: function (response) {
                    if (!response || response.error) {
                        return;
                    }
                    btn.removeClass('loading').addClass('added');
                    btn.find('.extras__plus').remove();
                    btn.find('.extras__cart-text').text(sogoc.added_to_cart);
                    if (response.cart_sum) {
                        $('#header-cart-sum').text(response.cart_sum)
                    }
                    $('#mini-cart').replaceWith(response.miniCart);
                    if(btn.parent().find('.js-view-cart').length === 0){
                        $(response.btn).insertAfter(btn)
                    }
                },
            });
        });
    });


})(jQuery);





