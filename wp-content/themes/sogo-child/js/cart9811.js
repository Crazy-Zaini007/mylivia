(function ($) {
    "use strict";
    $(document).ready(function () {
        $('body').bind('added_to_cart', function (event, fragments, cart_hash) {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: wc_add_to_cart_params.ajax_url,
                data: {
                    action: "sogo_mini_cart"

                },
                success: function (response) {
                    $('#mini-cart').replaceWith(response.miniCart);
                }
            });
        });

        /**
         * Ajax delete product in the cart
         */
        $(document).on('click', '.cart-container__form a.remove, .cart-container-form a.remove', function (e) {
            e.preventDefault();

            var product_id = $(this).attr("data-product_id"),
                cart_item_key = $(this).attr("data-cart_item_key"),
                product_container = $(this).parents('.cart-container__form'),
                row = $(this).closest('.cart-item-wrapper');

            // Add loader
            product_container.block({
                message: null,
                overlayCSS: {
                    cursor: 'none'
                }
            });

            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: wc_add_to_cart_params.ajax_url,
                data: {
                    action: "product_remove",
                    product_id: product_id,
                    cart_item_key: cart_item_key
                },
                success: function (response) {
                    if (!response || response.error)
                        return;
                  //  row.replaceWith(response.undo);

                    // if (response.remove_free) {
                    //     console.log(response.remove_free);
                    //     $('[data-product_id="' + response.remove_free + '"]').closest('.cart-item-wrapper').remove();
                    // }
                    // if (response.cart_sum) {
                    //     $('#header-cart-sum').text(response.cart_sum)
                    // }
                    location.reload();
                    // product_container.unblock();


                }
            });
        });

        /**
         *  undo product remove from cart
         */
        $(document).on('click', '.undo_remove_product', function (e) {
            e.preventDefault();

            /**
             * data-product_id='$product_id'
             data-quantity='$quantity'
             data-variation_id='$variation_id'
             data-variation='$variation'
             */
            var product_id = $(this).data("product_id"),
                quantity = $(this).data("quantity"),
                variation_id = $(this).data("variation_id"),
                product_container = $(this).parents('.cart-container__form');


            // Add loader
            product_container.block({
                message: null,
                overlayCSS: {
                    cursor: 'none'
                }
            });

            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: sogo.ajaxurl,
                data: {
                    action: "sogo_add_undo_product",
                    product_id: product_id,
                    quantity: quantity,
                    variation_id: variation_id
                },
                success: function (response) {
                    if (!response || response.error)
                        return;
                    location.reload();

                }
            });
        });

        /**
         * Hook place order click
         */
        $(document).on("click", "#place_order", function (e) {
			
			try{			
				if (!$('.checkout').valid()) {
					
					e.preventDefault();
					$('html,body').animate({scrollTop: $('input.error').eq(0).focus().offset().top - 150});

				} else {
					$('html,body').animate({scrollTop: $('#stripe-payment-data').offset().top - 150});
				}
			}catch(ex){
				e.preventDefault();
                //$('html,body').animate({scrollTop: $('input.error').eq(0).focus().offset().top - 150});
			
			}
        });
		

        /**
         * validate checkout form
         */
        $('.checkout').validate({
            rules: {
                "billing_first_name": {
                    required: true,
                    minlength: 2
                },
                "billing_last_name": {
                    required: true,
                    minlength: 2
                },
                "billing_email": {
                    required: true,
                    email: true
                },
                "billing_phone": {
                    required: true,
                    minlength: 10
                },
                "billing_city": {
                    required: true,
                    minlength: 2
                },
				"billing_postcode":{
					required: true,					
				},	
				"billing_address_1":{
					required: true,					
				},
								
                "taxes": {
                    required: true
                }

                // billing_phone
                // billing_postc
                // billing_city'
                // billing_state
                //
            }
        });

        /**
         * update cart on value change
         */
        $(".quantity input[type='number']").bind("change", function () {
            $(".cart__update-cart input[type='submit']").click();
        });


        /**
         * woocommerce cart increment and  decrease quantity
         */
        var updateCart = $('input[name=update_cart]');
        $(document).on("click", ".increment-quantity", function (e) {
            e.preventDefault();
            updateCart.removeAttr('disabled');
            var qty = $(this).parent().find('.qty');
            var value = qty.val();
            value++;
			
			if ( (qty.attr("max") && qty.attr("max").length > 0 && qty.attr("max") >= value) || (!qty.attr("max") || qty.attr("max").length == 0)){
				qty.val(value);
			}
            if (!$('body').hasClass('single-product')) {
                // Add loader
                $(this).closest('form').block({
                    message: null,
                    overlayCSS: {
                        cursor: 'none'
                    }
                });
                qty.trigger('change')
            }
        });

        $(document).on("click", ".decrease-quantity", function (e) {
            e.preventDefault();
            // Add loader
            updateCart.removeAttr('disabled');
            var qty = $(this).parent().find('.qty');
            var value = qty.val();
            if (value > 1) {
                value--;
            }
			if ( (qty.attr("min") && qty.attr("min").length > 0 && qty.attr("min") <= value) || (!qty.attr("min") || qty.attr("min").length == 0)){
				qty.val(value);
			}
            if (!$('body').hasClass('single-product')) {
                $(this).closest('form').block({
                    message: null,
                    overlayCSS: {
                        cursor: 'none'
                    }
                });
                qty.trigger('change')
            }
        });


        /**
         *  Author: Oren
         *  change the variation on click using ajax.
         */
        $(document).on("click", ".cart-container__form .cart_variations_change .swatch ", function (e) {
            e.preventDefault();
            if ($(this).hasClass('selected')) {
                return;
            }
            $(this).closest('form').block({
                message: null,
                overlayCSS: {
                    cursor: 'none'
                }
            });
            var obj = $(this).closest('.cart_variations_change');
            obj.find('.swatch').removeClass('selected');
            $(this).addClass('selected');
            $.ajax({
                type: "POST",
                url: sogo.ajaxurl,
                data: {
                    'action': 'sogo_change_cart_item_variation',
                    'product_id': obj.data('variation'),
                    'new_variation_id': $(this).data('value'),
                    'key': obj.data('key')
                },
                success: function (response) {
                    location.reload()
                }
            });

        });	
		
		$('.woocommerce-notices-wrapper').bind('DOMSubtreeModified', function(){
				var err = $('#unknown-error');				
				if (err && err.html() && err.html().indexOf("PayPal rejected your shipping address because the city, state, and/or ZIP code are incorrect") >=0){
					$('#billing_postcode').closest('p').removeClass('woocommerce-validated');
					$('#billing_city').closest('p').removeClass('woocommerce-validated');
					$('#billing_state').closest('p').removeClass('woocommerce-validated');
				}			
				if ($('#payment_method_stripe').is(':checked') && $(window).width() > 900){
					if (err){					
						var notice = err.closest('.woocommerce-notices-wrapper').html();						
						if (notice)
						{	
							 setTimeout(function(){

								 $('.payment_box.payment_method_stripe').prepend(notice);
								 
								
							 },1000);							
							
						}
						$('.woocommerce>.woocommerce-notices-wrapper').first().hide();						
					}
				}
		});
		


    });

    // $(window).on('load', function () {
    //     $('#stripe-cvc-element').prev().text('CVC code');
    //
    // });

})(jQuery);





