/*
 * Morph Carousel 1.0.0
 * https://github.com/kosinix/morph-carousel
 *
 *
 * Copyright 2015, Nico Amarilla
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
(function($){
    var methods = {
        init : function( settings ) {
            //Default plugin settings
            var defaults = {
                cssClass: {
                    carousel: 'morph-carousel',
                    inner: 'morph-carousel-inner',
                    viewPort: 'morph-carousel-viewport',
                    strip: 'morph-carousel-strip',
                    item: 'morph-carousel-item',
                    prev: 'morph-carousel-prev',
                    next: 'morph-carousel-next'
                }
            };
            settings = $.extend(true, {}, defaults, settings); // Combine defaults and user-provided settings

            return this.each(function() {
                var carousel = $(this), // jQuery object of our element
                    items = carousel.find('.'+settings.cssClass.item);


                if('div' != carousel.prop('nodeName').toLowerCase()){ // Check if its a <div> tag
                    $.error( 'Not a DIV element' );

                } else {

                    carousel.append(
                        '<div class="'+settings.cssClass.inner+'">'+
                            '<div class="'+settings.cssClass.viewPort+'">'+
                                '<div class="'+settings.cssClass.strip+'"></div>'+
                            '</div>'+
                            '<button class="'+settings.cssClass.prev+'"></button>'+
                            '<button class="'+settings.cssClass.next+'"></button>'+
                        '</div>'
                    );
                    items.appendTo(carousel.find('.'+settings.cssClass.strip));

                    _initialize( carousel, settings );
                    _hookEvents( carousel, settings );

                    carousel.find('.'+settings.cssClass.prev).prop('disabled', true);
                }
            });
        }
    };

    /*** Plugin Main ***/
    $.fn.morphCarousel = function(method) {

        // Method calling logic
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist.' );
        }
        return false;
    }

    /*** Private Functions ***/
    function _initialize( carousel, settings ) {
        var inner = carousel.find( '.'+settings.cssClass.inner ),
            viewPort = carousel.find( '.'+settings.cssClass.viewPort ),
            strip = carousel.find( '.'+settings.cssClass.strip ),
            items = carousel.find( '.'+settings.cssClass.item),
            prev = carousel.find( '.'+settings.cssClass.prev ),
            next = carousel.find( '.'+settings.cssClass.next ),

            carouselVars = _computeVars( carousel, settings);

        strip.width( carouselVars.stripWidth );
        viewPort.height( carouselVars.stripHeight );
        inner.css('maxWidth', carouselVars.stripWidth+'px');

        prev.prop('disabled', false);
        next.prop('disabled', false);

    }

    function _computeVars( carousel, settings ){
        var viewPort = carousel.find( '.'+settings.cssClass.viewPort ),
            strip = carousel.find( '.'+settings.cssClass.strip ),
            items = carousel.find( '.'+settings.cssClass.item ),
            prev = carousel.find( '.'+settings.cssClass.prev ),
            next = carousel.find( '.'+settings.cssClass.next ),

            itemWidth = items.eq(0).outerWidth(),
            itemHeight = items.eq(0).outerHeight(),
            viewPortWidth = viewPort.width(),
            stripWidth = itemWidth * items.length,
            stripHeight = itemHeight,
            scrollAmount = Math.floor(viewPortWidth / itemWidth) * itemWidth,
            prevLimit = 0,
            nextLimit = 0 - Math.floor( stripWidth - viewPortWidth),
            left = parseInt(strip.position().left);

        return {
            itemWidth: itemWidth,
            itemHeight: itemHeight,
            viewPortWidth: viewPortWidth,
            stripWidth:stripWidth,
            stripHeight:stripHeight,
            scrollAmount:scrollAmount,
            prevLimit:prevLimit,
            nextLimit:nextLimit,
            left:left
        }
    }

    function _hookEvents( carouselObj, settings ) {

        carouselObj.on('click', '.'+settings.cssClass.next, function(e){
            var carousel = $(this).parents( '.'+settings.cssClass.carousel ),
                viewPort = carousel.find( '.'+settings.cssClass.viewPort ),
                strip = carousel.find( '.'+settings.cssClass.strip ),
                items = carousel.find( '.'+settings.cssClass.item ),
                prev = carousel.find( '.'+settings.cssClass.prev ),
                next = carousel.find( '.'+settings.cssClass.next ),

                carouselVars = _computeVars( carousel, settings );

            prev.prop('disabled', false);
            next.prop('disabled', false);

            carouselVars.left -= carouselVars.scrollAmount;
            if(carouselVars.left < carouselVars.nextLimit ) {
                carouselVars.left = carouselVars.nextLimit;
                $(this).prop('disabled', true);
            }

            strip.animate({'left': carouselVars.left}, 100);


        }).on('click', '.'+settings.cssClass.prev, function(e){
            var carousel = $(this).parents( '.'+settings.cssClass.carousel ),
                viewPort = carousel.find( '.'+settings.cssClass.viewPort ),
                strip = carousel.find( '.'+settings.cssClass.strip ),
                items = carousel.find( '.'+settings.cssClass.item ),
                prev = carousel.find( '.'+settings.cssClass.prev ),
                next = carousel.find( '.'+settings.cssClass.next ),

                carouselVars = _computeVars( carousel, settings );

            prev.prop('disabled', false);
            next.prop('disabled', false);

            carouselVars.left += carouselVars.scrollAmount;
            if( carouselVars.left > 0 ) {
                carouselVars.left = 0;
                $(this).prop('disabled', true);
            }

            strip.animate({'left': carouselVars.left}, 100);

        });

        $(window).on("resize", function( event ) {
            _on_resize(function () {

                $( '.'+settings.cssClass.carousel ).each(function () {

                    _initialize($(this), settings);

                });
            })();
        });


    }

    //Debounced resize - https://github.com/louisremi/jquery-smartresize
    function _on_resize(c,t){
        onresize=function(){
            clearTimeout(t);
            t=setTimeout(c,150)
        };
        return c
    };

})(jQuery);
