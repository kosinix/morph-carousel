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
                scrollSpeed: 200,
                cssClass: {
                    carousel: 'morph-carousel',
                    inner: 'morph-carousel-inner',
                    viewPort: 'morph-carousel-viewport',
                    strip: 'morph-carousel-strip',
                    item: 'morph-carousel-item',
                    prev: 'morph-carousel-prev',
                    next: 'morph-carousel-next'
                },
                initHook: function(carousel, settings){
                    _initialize( carousel, settings )
                },
                prevHook: function( settings, carousel, event ){
                    _defaultPrevHook( settings, carousel, event );
                },
                nextHook: function( settings, carousel, event ){
                    _defaultNextHook( settings, carousel, event );
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

                    settings.initHook( carousel, settings );
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
        }
        return false;
    };

    /*** Private Functions ***/
    function _initialize( carousel, settings ) {
        var inner = carousel.find( '.'+settings.cssClass.inner ),
            viewPort = carousel.find( '.'+settings.cssClass.viewPort ),
            strip = carousel.find( '.'+settings.cssClass.strip ),
            items = carousel.find( '.'+settings.cssClass.item),
            prev = carousel.find( '.'+settings.cssClass.prev ),
            next = carousel.find( '.'+settings.cssClass.next ),

            stripWidth = _getStripWidth(items),
            itemHeight = items.eq(0).outerHeight(),
            stripHeight = itemHeight;

        strip.width( stripWidth );
        viewPort.height( stripHeight );
        inner.css('maxWidth', stripWidth+'px');

        strip.css('transition', 'all '+settings.scrollSpeed+'ms ease');

        prev.prop('disabled', false);
        next.prop('disabled', false);

        items.eq(0).find('img').load(function () {
            viewPort.height( $(this).parent().outerHeight() ); // Wait for image to load to get correct height
        })
    }

    function _hookEvents( carousel, settings ) {

        carousel.on('click', '.'+settings.cssClass.next, function(e){

            settings.nextHook( settings, $(this).parents( '.'+settings.cssClass.carousel ), e);


        }).on('click', '.'+settings.cssClass.prev, function(e){

            settings.prevHook( settings, $(this).parents( '.'+settings.cssClass.carousel ), e);

        });

    }

    function _defaultNextHook( settings, carousel, event){
        var strip = carousel.find( '.'+settings.cssClass.strip ),
            prev = carousel.find( '.'+settings.cssClass.prev ),
            next = carousel.find( '.'+settings.cssClass.next),
            viewPort = carousel.find( '.'+settings.cssClass.viewPort ),
            items = carousel.find( '.'+settings.cssClass.item ),

            itemsPos = _itemsPosArray(items),
            viewPortWidth = viewPort.width(),
            stripWidth = _getStripWidth(items),
            nextLimit = -Math.floor( stripWidth - viewPortWidth),
            scrollAmount = nextLimit,
            left = parseInt(strip.position().left);

        for(i=0; i<itemsPos.length; ++i){
            if(itemsPos[i] > (viewPortWidth + (0-left)) && i>0){
                //console.log('if (', itemsPos[i], '>', viewPortWidth, '+', (0-left), '=', viewPortWidth + (0-left) , ')');
                scrollAmount = -itemsPos[i-1]; // Negate

                break;
            }
        }

        // Overflow check
        if(scrollAmount < nextLimit ) {
            scrollAmount = nextLimit;
        }

        prev.prop('disabled', false);
        next.prop('disabled', false);

        if(scrollAmount == nextLimit ) {
            next.prop('disabled', true);
        }

        strip.css('left', scrollAmount+'px');

    }

    function _defaultPrevHook( settings, carousel, event){
        var strip = carousel.find( '.'+settings.cssClass.strip ),
            prev = carousel.find( '.'+settings.cssClass.prev ),
            next = carousel.find( '.'+settings.cssClass.next),
            viewPort = carousel.find( '.'+settings.cssClass.viewPort ),
            items = carousel.find( '.'+settings.cssClass.item ),

            itemsPos = _itemsPosArray(items),
            viewPortWidth = viewPort.width(),
            scrollAmount = 0,
            left = parseInt(strip.position().left);

        for(i=itemsPos.length; i>0; --i){
            if(itemsPos[i] < (Math.abs(left) - viewPortWidth) && i<itemsPos.length){
                //console.log('if (', itemsPos[i], '<', Math.abs(left), '-', viewPortWidth, '=', (Math.abs(left) - viewPortWidth), ')');
                scrollAmount = -itemsPos[i+1]; // Negate

                break;
            }
        }

        // Overflow check
        if(scrollAmount > 0 ) {
            scrollAmount = 0;
        }

        prev.prop('disabled', false);
        next.prop('disabled', false);

        if(scrollAmount == 0 ) {
            prev.prop('disabled', true);
        }

        strip.css('left', scrollAmount+'px');

    }

    function _getStripWidth(items){
        var stripWidth = 0;
        items.each(function(i,e){
            stripWidth += $(e).outerWidth();
        });
        return stripWidth;
    }

    function _itemsPosArray(items){
        var itemsPos = [];
        items.each(function(i,e){
            itemsPos[i] = $(e).position().left;
        });
        return itemsPos;
    }

})(jQuery);
