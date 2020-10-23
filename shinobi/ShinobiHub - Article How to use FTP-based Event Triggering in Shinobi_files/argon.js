/*!

=========================================================
* Argon Design System - v1.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system
* Copyright 2018 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system/blob/master/LICENSE.md)

* Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

"use strict";
$(document).ready(function() {

    // Collapse navigation
    $('.navbar-main .collapse').on('hide.bs.collapse', function () {
        var $this = $(this);
        $this.addClass('collapsing-out');
    });

    $('.navbar-main .collapse').on('hidden.bs.collapse', function () {
        var $this = $(this);
        $this.removeClass('collapsing-out');
    });

    $('.navbar-main .dropdown').on('hide.bs.dropdown', function () {
        var $this = $(this).find('.dropdown-menu');

        $this.addClass('close');

        setTimeout(function(){
            $this.removeClass('close');
        }, 200);

    });

    // Headroom - show/hide navbar on scroll
    if($('.headroom')[0]) {
        var headroom  = new Headroom(document.querySelector("#navbar-main"), {
            offset: 300,
            tolerance : {
                up : 30,
                down : 30
            },
        });
        headroom.init();
    }

    // Tooltip
    $('[data-toggle="tooltip"]').tooltip();

    // Popover
    $('[data-toggle="popover"]').each(function() {
        var popoverClass = '';
        if($(this).data('color')) {
            popoverClass = 'popover-'+$(this).data('color');
        }
        $(this).popover({
            trigger: 'focus',
            template: '<div class="popover '+ popoverClass +'" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
        })
    });

    // Additional .focus class on form-groups
    $('.form-control').on('focus blur', function(e) {
        $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
    }).trigger('blur');


    // When in viewport
    $('[data-toggle="on-screen"]')[0] && $('[data-toggle="on-screen"]').onScreen({
        container: window,
        direction: 'vertical',
        doIn: function() {
            //alert();
        },
        doOut: function() {
            // Do something to the matched elements as they get off scren
        },
        tolerance: 200,
        throttle: 50,
        toggleClass: 'on-screen',
        debug: false
    });

    // Scroll to anchor with scroll animation
    $('[data-toggle="scroll"]').on('click', function(event) {
        var hash = $(this).attr('href');
        var offset = $(this).data('offset') ? $(this).data('offset') : 0;

        // Animate scroll to the selected section
        $('html, body').stop(true, true).animate({
            scrollTop: $(hash).offset().top - offset
        }, 600);

        event.preventDefault();
    });
 });
