/*
 * # Semantic - Popup
 * http://github.com/jlukic/semantic-ui/
 *
 *
 * Copyright 2013 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ($, window, document, undefined) {

$.fn.popup = function(parameters) {
  var
    $allModules     = $(this),
<<<<<<< HEAD

    settings        = ( $.isPlainObject(parameters) )
      ? $.extend(true, {}, $.fn.popup.settings, parameters)
      : $.fn.popup.settings,
=======
    $document       = $(document),
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862

    moduleSelector  = $allModules.selector || '',

    time            = new Date().getTime(),
    performance     = [],

    query           = arguments[0],
    methodInvoked   = (typeof query == 'string'),
    queryArguments  = [].slice.call(arguments, 1),

<<<<<<< HEAD
    invokedResponse
=======
    returnedValue
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
  ;
  $allModules
    .each(function() {
      var
<<<<<<< HEAD
        $module         = $(this),

        $window         = $(window),
        $offsetParent   = $module.offsetParent(),
        $popup          = (settings.inline)
          ? $module.next(settings.selector.popup)
=======
        settings        = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.popup.settings, parameters)
          : $.extend({}, $.fn.popup.settings),

        selector        = settings.selector,
        className       = settings.className,
        error           = settings.error,
        metadata        = settings.metadata,
        namespace       = settings.namespace,

        eventNamespace  = '.' + settings.namespace,
        moduleNamespace = 'module-' + namespace,

        $module         = $(this),
        $context        = $(settings.context),
        $target         = (settings.target)
          ? $(settings.target)
          : $module,

        $window         = $(window),

        $offsetParent   = (settings.inline)
          ? $target.offsetParent()
          : $window,
        $popup          = (settings.inline)
          ? $target.next(settings.selector.popup)
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          : $window.children(settings.selector.popup).last(),

        searchDepth     = 0,

<<<<<<< HEAD
        eventNamespace  = '.' + settings.namespace,
        moduleNamespace = settings.namespace + '-module',

        selector        = settings.selector,
        className       = settings.className,
        error           = settings.error,
        metadata        = settings.metadata,
        namespace       = settings.namespace,

=======
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
        element         = this,
        instance        = $module.data(moduleNamespace),
        module
      ;

      module = {

        // binds events
        initialize: function() {
          module.debug('Initializing module', $module);
<<<<<<< HEAD
          if(settings.on == 'hover') {
            $module
              .on('mouseenter' + eventNamespace, module.event.mouseenter)
              .on('mouseleave' + eventNamespace, module.event.mouseleave)
=======
          if(settings.on == 'click') {
            $module
              .on('click', module.toggle)
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
            ;
          }
          else {
            $module
<<<<<<< HEAD
              .on(settings.on + '' + eventNamespace, module.event[settings.on])
            ;
          }
=======
              .on(module.get.startEvent() + eventNamespace, module.event.start)
              .on(module.get.endEvent() + eventNamespace, module.event.end)
            ;
          }
          if(settings.target) {
            module.debug('Target set to element', $target);
          }
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          $window
            .on('resize' + eventNamespace, module.event.resize)
          ;
          module.instantiate();
        },

        instantiate: function() {
          module.verbose('Storing instance of module', module);
          instance = module;
          $module
            .data(moduleNamespace, instance)
          ;
        },

        refresh: function() {
<<<<<<< HEAD
          $popup        = (settings.inline)
            ? $module.next(selector.popup)
            : $window.children(selector.popup).last()
          ;
          $offsetParent = $module.offsetParent();
=======
          if(settings.inline) {
            $popup = $target.next(selector.popup);
            $offsetParent = $target.offsetParent();
          }
          else {
            $popup = $window.children(selector.popup).last();
          }
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
        },

        destroy: function() {
          module.debug('Destroying previous module');
<<<<<<< HEAD
=======
          $window
            .off(eventNamespace)
          ;
          $popup
            .remove()
          ;
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          $module
            .off(eventNamespace)
            .removeData(moduleNamespace)
          ;
        },

        event: {
<<<<<<< HEAD
          mouseenter:  function(event) {
            var element = this;
            module.timer = setTimeout(function() {
              $.proxy(module.toggle, element)();
              if( $(element).hasClass(className.visible) ) {
                event.stopPropagation();
              }
            }, settings.delay);
          },
          mouseleave:  function() {
            clearTimeout(module.timer);
            if( $module.is(':visible') ) {
              module.hide();
            }
          },
          click: function(event) {
            $.proxy(module.toggle, this)();
            if( $(this).hasClass(className.visible) ) {
              event.stopPropagation();
            }
          },
          resize: function() {
            if( $popup.is(':visible') ) {
              module.position();
=======
          start:  function(event) {
            module.timer = setTimeout(function() {
              if( module.is.hidden() ) {
                module.show();
              }
            }, settings.delay);
          },
          end:  function() {
            clearTimeout(module.timer);
            if( module.is.visible() ) {
              module.hide();
            }
          },
          resize: function() {
            if( module.is.visible() ) {
              module.set.position();
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
            }
          }
        },

        // generates popup html from metadata
        create: function() {
          module.debug('Creating pop-up html');
          var
            html      = $module.data(metadata.html)      || settings.html,
            variation = $module.data(metadata.variation) || settings.variation,
            title     = $module.data(metadata.title)     || settings.title,
            content   = $module.data(metadata.content)   || $module.attr('title') || settings.content
          ;
          if(html || content || title) {
            if(!html) {
              html = settings.template({
                title   : title,
                content : content
              });
            }
            $popup = $('<div/>')
              .addClass(className.popup)
              .addClass(variation)
              .html(html)
            ;
            if(settings.inline) {
<<<<<<< HEAD
              module.verbose('Inserting popup element inline');
=======
              module.verbose('Inserting popup element inline', $popup);
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
              $popup
                .insertAfter($module)
              ;
            }
            else {
<<<<<<< HEAD
              module.verbose('Appending popup element to body');
              $popup
                .appendTo( $('body') )
              ;
            }
            $.proxy(settings.onInit, $popup)();
=======
              module.verbose('Appending popup element to body', $popup);
              $popup
                .appendTo( $context )
              ;
            }
            $.proxy(settings.onCreate, $popup)();
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          }
          else {
            module.error(error.content);
          }
        },

<<<<<<< HEAD
=======
        // determines popup state
        toggle: function() {
          module.debug('Toggling pop-up');
          if( module.is.hidden() ) {
            module.debug('Popup is hidden, showing pop-up');
            module.unbind.close();
            module.hideAll();
            module.show();
          }
          else {
            module.debug('Popup is visible, hiding pop-up');
            module.hide();
          }
        },

        show: function(callback) {
          callback = callback || function(){};
          module.debug('Showing pop-up', settings.transition);
          if(!settings.preserve) {
            module.refresh();
          }
          if( !module.exists() ) {
            module.create();
          }
          module.save.conditions();
          module.set.position();
          module.animate.show(callback);
        },


        hide: function(callback) {
          callback = callback || function(){};
          $module
            .removeClass(className.visible)
          ;
          module.restore.conditions();
          module.unbind.close();
          if( module.is.visible() ) {
            module.animate.hide(callback);
          }
        },

        hideAll: function() {
          $(selector.popup)
            .filter(':visible')
              .popup('hide')
          ;
        },

        hideGracefully: function(event) {
          // don't close on clicks inside popup
          if(event && $(event.target).closest(selector.popup).size() === 0) {
            module.debug('Click occurred outside popup hiding popup');
            module.hide();
          }
          else {
            module.debug('Click was inside popup, keeping popup open');
          }
        },

        exists: function() {
          if(settings.inline) {
            return ( $popup.size() !== 0 );
          }
          else {
            return ( $popup.parent($context).size() );
          }
        },

>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
        remove: function() {
          module.debug('Removing popup');
          $popup
            .remove()
          ;
        },

<<<<<<< HEAD
        get: {
=======
        save: {
          conditions: function() {
            module.cache = {
              title: $module.attr('title')
            };
            if (module.cache.title) {
              $module.removeAttr('title');
            }
            module.verbose('Saving original attributes', module.cache.title);
          }
        },
        restore: {
          conditions: function() {
            if(module.cache && module.cache.title) {
              $module.attr('title', module.cache.title);
            }
            module.verbose('Restoring original attributes', module.cache.title);
            return true;
          }
        },
        animate: {
          show: function(callback) {
            callback = callback || function(){};
            $module
              .addClass(className.visible)
            ;
            if(settings.transition && $.fn.transition !== undefined && $module.transition('is supported')) {
              $popup
                .transition(settings.transition + ' in', settings.duration, function() {
                  module.bind.close();
                  $.proxy(callback, element)();
                })
              ;
            }
            else {
              $popup
                .stop()
                .fadeIn(settings.duration, settings.easing, function() {
                  module.bind.close();
                  $.proxy(callback, element)();
                })
              ;
            }
            $.proxy(settings.onShow, element)();
          },
          hide: function(callback) {
            callback = callback || function(){};
            module.debug('Hiding pop-up');
            if(settings.transition && $.fn.transition !== undefined && $module.transition('is supported')) {
              $popup
                .transition(settings.transition + ' out', settings.duration, function() {
                  module.reset();
                  callback();
                })
              ;
            }
            else {
              $popup
                .stop()
                .fadeOut(settings.duration, settings.easing, function() {
                  module.reset();
                  callback();
                })
              ;
            }
            $.proxy(settings.onHide, element)();
          }
        },

        get: {
          startEvent: function() {
            if(settings.on == 'hover') {
              return 'mouseenter';
            }
            else if(settings.on == 'focus') {
              return 'focus';
            }
          },
          endEvent: function() {
            if(settings.on == 'hover') {
              return 'mouseleave';
            }
            else if(settings.on == 'focus') {
              return 'blur';
            }
          },
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          offstagePosition: function() {
            var
              boundary  = {
                top    : $(window).scrollTop(),
                bottom : $(window).scrollTop() + $(window).height(),
                left   : 0,
                right  : $(window).width()
              },
              popup     = {
                width    : $popup.width(),
                height   : $popup.outerHeight(),
                position : $popup.offset()
              },
              offstage  = {},
              offstagePositions = []
            ;
            if(popup.position) {
              offstage = {
                top    : (popup.position.top < boundary.top),
                bottom : (popup.position.top + popup.height > boundary.bottom),
                right  : (popup.position.left + popup.width > boundary.right),
                left   : (popup.position.left < boundary.left)
              };
            }
<<<<<<< HEAD
=======
            module.verbose('Checking if outside viewable area', popup.position);
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
            // return only boundaries that have been surpassed
            $.each(offstage, function(direction, isOffstage) {
              if(isOffstage) {
                offstagePositions.push(direction);
              }
            });
            return (offstagePositions.length > 0)
              ? offstagePositions.join(' ')
              : false
            ;
          },
          nextPosition: function(position) {
            switch(position) {
              case 'top left':
                position = 'bottom left';
              break;
              case 'bottom left':
                position = 'top right';
              break;
              case 'top right':
                position = 'bottom right';
              break;
              case 'bottom right':
                position = 'top center';
              break;
              case 'top center':
                position = 'bottom center';
              break;
              case 'bottom center':
                position = 'right center';
              break;
              case 'right center':
                position = 'left center';
              break;
              case 'left center':
                position = 'top center';
              break;
            }
            return position;
          }
        },

<<<<<<< HEAD
        // determines popup state
        toggle: function() {
          $module = $(this);
          module.debug('Toggling pop-up');
          // refresh state of module
          module.refresh();
          if( !$module.hasClass(className.visible) ) {
            if(settings.on == 'click') {
              module.hideAll();
            }
            module.show();
          }
          else {
            module.hide();
          }
        },

        position: function(position, arrowOffset) {
          var
            windowWidth  = $(window).width(),
            windowHeight = $(window).height(),
            width        = $module.outerWidth(),
            height       = $module.outerHeight(),
            popupWidth   = $popup.width(),
            popupHeight  = $popup.outerHeight(),

            offset       = (settings.inline)
              ? $module.position()
              : $module.offset(),
            parentWidth  = (settings.inline)
              ? $offsetParent.outerWidth()
              : $window.outerWidth(),
            parentHeight = (settings.inline)
              ? $offsetParent.outerHeight()
              : $window.outerHeight(),

            positioning,
            offstagePosition
          ;
          position    = position    || $module.data(metadata.position)    || settings.position;
          arrowOffset = arrowOffset || $module.data(metadata.arrowOffset) || settings.arrowOffset;
          module.debug('Calculating offset for position', position);
          switch(position) {
            case 'top left':
              positioning = {
                top    : 'auto',
                bottom :  parentHeight - offset.top + settings.distanceAway,
                left   : offset.left + arrowOffset
              };
            break;
            case 'top center':
              positioning = {
                bottom :  parentHeight - offset.top + settings.distanceAway,
                left   : offset.left + (width / 2) - (popupWidth / 2) + arrowOffset,
                top    : 'auto',
                right  : 'auto'
              };
            break;
            case 'top right':
              positioning = {
                bottom :  parentHeight - offset.top + settings.distanceAway,
                right  :  parentWidth - offset.left - width - arrowOffset,
                top    : 'auto',
                left   : 'auto'
              };
            break;
            case 'left center':
              positioning = {
                top    :  offset.top + (height / 2) - (popupHeight / 2),
                right  : parentWidth - offset.left + settings.distanceAway - arrowOffset,
                left   : 'auto',
                bottom : 'auto'
              };
            break;
            case 'right center':
              positioning = {
                top    :  offset.top + (height / 2) - (popupHeight / 2),
                left   : offset.left + width + settings.distanceAway + arrowOffset,
                bottom : 'auto',
                right  : 'auto'
              };
            break;
            case 'bottom left':
              positioning = {
                top    :  offset.top + height + settings.distanceAway,
                left   : offset.left + arrowOffset,
                bottom : 'auto',
                right  : 'auto'
              };
            break;
            case 'bottom center':
              positioning = {
                top    :  offset.top + height + settings.distanceAway,
                left   : offset.left + (width / 2) - (popupWidth / 2) + arrowOffset,
                bottom : 'auto',
                right  : 'auto'
              };
            break;
            case 'bottom right':
              positioning = {
                top    :  offset.top + height + settings.distanceAway,
                right  : parentWidth - offset.left - width - arrowOffset,
                left   : 'auto',
                bottom : 'auto'
              };
            break;
          }
          // true width on popup, avoid rounding error
          $.extend(positioning, {
            width: $popup.width() + 1
          });
          // tentatively place on stage
          $popup
            .removeAttr('style')
            .removeClass('top right bottom left center')
            .css(positioning)
            .addClass(position)
            .addClass(className.loading)
          ;
          // check if is offstage
          offstagePosition = module.get.offstagePosition();
          // recursively find new positioning
          if(offstagePosition) {
            module.debug('Element is outside boundaries ', offstagePosition);
            if(searchDepth < settings.maxSearchDepth) {
              position = module.get.nextPosition(position);
              searchDepth++;
              module.debug('Trying new position: ', position);
              return module.position(position);
            }
            else {
              module.error(error.recursion);
              searchDepth = 0;
              return false;
            }
          }
          else {
            module.debug('Position is on stage', position);
            searchDepth = 0;
            return true;
          }
        },

        show: function() {
          module.debug('Showing pop-up', settings.transition);
          if($popup.size() === 0) {
            module.create();
          }
          module.position();
          $module
            .addClass(className.visible)
          ;
          $popup
            .removeClass(className.loading)
          ;
          if(settings.transition && $.fn.transition !== undefined) {
            $popup
              .transition(settings.transition + ' in', settings.duration)
            ;
          }
          else {
            $popup
              .stop()
              .fadeIn(settings.duration, settings.easing)
            ;
          }
          if(settings.on == 'click' && settings.clicktoClose) {
            module.debug('Binding popup close event');
            $(document)
              .on('click.' + namespace, module.gracefully.hide)
            ;
          }
          $.proxy(settings.onShow, $popup)();
        },

        hideAll: function() {
          $(selector.popup)
            .filter(':visible')
              .popup('hide')
          ;
        },

        hide: function() {
          $module
            .removeClass(className.visible)
          ;
          if($popup.is(':visible') ) {
            module.debug('Hiding pop-up');
            if(settings.transition && $.fn.transition !== undefined) {
              $popup
                .transition(settings.transition + ' out', settings.duration)
              ;
            }
            else {
              $popup
                .stop()
                .fadeOut(settings.duration, settings.easing)
              ;
            }
          }
          if(settings.on == 'click' && settings.clicktoClose) {
            $(document)
              .off('click.' + namespace)
            ;
          }
          $.proxy(settings.onHide, $popup)();
          if(!settings.inline) {
            module.remove();
          }
        },

        gracefully: {
          hide: function(event) {
            // don't close on clicks inside popup
            if( $(event.target).closest(selector.popup).size() === 0) {
              module.hide();
            }
=======
        set: {
          position: function(position, arrowOffset) {
            var
              windowWidth  = $(window).width(),
              windowHeight = $(window).height(),

              width        = $target.outerWidth(),
              height       = $target.outerHeight(),

              popupWidth   = $popup.width(),
              popupHeight  = $popup.outerHeight(),

              parentWidth  = $offsetParent.outerWidth(),
              parentHeight = $offsetParent.outerHeight(),

              distanceAway = settings.distanceAway,

              offset       = (settings.inline)
                ? $target.position()
                : $target.offset(),

              positioning,
              offstagePosition
            ;
            position    = position    || $module.data(metadata.position)    || settings.position;
            arrowOffset = arrowOffset || $module.data(metadata.offset)      || settings.offset;
            // adjust for margin when inline
            if(settings.inline) {
              if(position == 'left center' || position == 'right center') {
                arrowOffset  += parseInt( window.getComputedStyle(element).getPropertyValue('margin-top'), 10);
                distanceAway += -parseInt( window.getComputedStyle(element).getPropertyValue('margin-left'), 10);
              }
              else {
                arrowOffset  += parseInt( window.getComputedStyle(element).getPropertyValue('margin-left'), 10);
                distanceAway += parseInt( window.getComputedStyle(element).getPropertyValue('margin-top'), 10);
              }
            }
            module.debug('Calculating offset for position', position);
            switch(position) {
              case 'top left':
                positioning = {
                  bottom :  parentHeight - offset.top + distanceAway,
                  right  :  parentWidth - offset.left - arrowOffset,
                  top    : 'auto',
                  left   : 'auto'
                };
              break;
              case 'top center':
                positioning = {
                  bottom :  parentHeight - offset.top + distanceAway,
                  left   : offset.left + (width / 2) - (popupWidth / 2) + arrowOffset,
                  top    : 'auto',
                  right  : 'auto'
                };
              break;
              case 'top right':
                positioning = {
                  top    : 'auto',
                  bottom :  parentHeight - offset.top + distanceAway,
                  left   : offset.left + width + arrowOffset,
                  right  : 'auto'
                };
              break;
              case 'left center':
                positioning = {
                  top    :  offset.top + (height / 2) - (popupHeight / 2) + arrowOffset,
                  right  : parentWidth - offset.left + distanceAway,
                  left   : 'auto',
                  bottom : 'auto'
                };
              break;
              case 'right center':
                positioning = {
                  top    :  offset.top + (height / 2) - (popupHeight / 2) + arrowOffset,
                  left   : offset.left + width + distanceAway,
                  bottom : 'auto',
                  right  : 'auto'
                };
              break;
              case 'bottom left':
                positioning = {
                  top    :  offset.top + height + distanceAway,
                  right  : parentWidth - offset.left - arrowOffset,
                  left   : 'auto',
                  bottom : 'auto'
                };
              break;
              case 'bottom center':
                positioning = {
                  top    :  offset.top + height + distanceAway,
                  left   : offset.left + (width / 2) - (popupWidth / 2) + arrowOffset,
                  bottom : 'auto',
                  right  : 'auto'
                };
              break;
              case 'bottom right':
                positioning = {
                  top    :  offset.top + height + distanceAway,
                  left   : offset.left + width + arrowOffset,
                  bottom : 'auto',
                  right  : 'auto'
                };
              break;
            }
            // tentatively place on stage
            $popup
              .css(positioning)
              .removeClass(className.position)
              .addClass(position)
              .addClass(className.loading)
            ;
            // check if is offstage
            offstagePosition = module.get.offstagePosition();

            // recursively find new positioning
            if(offstagePosition) {
              module.debug('Element is outside boundaries', offstagePosition);
              if(searchDepth < settings.maxSearchDepth) {
                position = module.get.nextPosition(position);
                searchDepth++;
                module.debug('Trying new position', position);
                return module.set.position(position);
              }
              else {
                module.error(error.recursion);
                searchDepth = 0;
                module.reset();
                $popup.removeClass(className.loading);
                return false;
              }
            }
            else {
              module.debug('Position is on stage', position);
              searchDepth = 0;
              $popup.removeClass(className.loading);
              return true;
            }
          }

        },

        bind: {
          close:function() {
            if(settings.on == 'click' && settings.closable) {
              module.verbose('Binding popup close event to document');
              $document
                .on('click' + eventNamespace, function(event) {
                  module.verbose('Pop-up clickaway intent detected');
                  $.proxy(module.hideGracefully, this)(event);
                })
              ;
            }
          }
        },

        unbind: {
          close: function() {
            if(settings.on == 'click' && settings.closable) {
              module.verbose('Removing close event from document');
              $document
                .off('click' + eventNamespace)
              ;
            }
          }
        },

        is: {
          animating: function() {
            return ( $popup.is(':animated') || $popup.hasClass(className.animating) );
          },
          visible: function() {
            return $popup.is(':visible');
          },
          hidden: function() {
            return !module.is.visible();
          }
        },

        reset: function() {
          $popup
            .attr('style', '')
            .removeAttr('style')
          ;
          if(!settings.preserve) {
            module.remove();
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          }
        },

        setting: function(name, value) {
<<<<<<< HEAD
          if(value !== undefined) {
            if( $.isPlainObject(name) ) {
              $.extend(true, settings, name);
            }
            else {
              settings[name] = value;
            }
=======
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
<<<<<<< HEAD
          if(value !== undefined) {
            if( $.isPlainObject(name) ) {
              $.extend(true, module, name);
            }
            else {
              module[name] = value;
            }
=======
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Element'        : element,
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 100);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
<<<<<<< HEAD
=======
            object = instance,
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
<<<<<<< HEAD
          if(typeof query == 'string' && instance !== undefined) {
=======
          if(typeof query == 'string' && object !== undefined) {
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
<<<<<<< HEAD
              if( $.isPlainObject( instance[value] ) && (depth != maxDepth) ) {
                instance = instance[value];
              }
              else if( $.isPlainObject( instance[camelCaseValue] ) && (depth != maxDepth) ) {
                instance = instance[camelCaseValue];
              }
              else if( instance[value] !== undefined ) {
                found = instance[value];
                return false;
              }
              else if( instance[camelCaseValue] !== undefined ) {
                found = instance[camelCaseValue];
                return false;
              }
              else {
                module.error(error.method);
=======
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
<<<<<<< HEAD
          if($.isArray(invokedResponse)) {
            invokedResponse.push(response);
          }
          else if(typeof invokedResponse == 'string') {
            invokedResponse = [invokedResponse, response];
          }
          else if(response !== undefined) {
            invokedResponse = response;
=======
          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          }
          return found;
        }
      };

      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          module.destroy();
        }
        module.initialize();
      }
    })
  ;

<<<<<<< HEAD
  return (invokedResponse !== undefined)
    ? invokedResponse
=======
  return (returnedValue !== undefined)
    ? returnedValue
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
    : this
  ;
};

$.fn.popup.settings = {

  name           : 'Popup',
  debug          : true,
  verbose        : true,
  performance    : true,
  namespace      : 'popup',

<<<<<<< HEAD
  onInit         : function(){},
=======
  onCreate       : function(){},
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
  onShow         : function(){},
  onHide         : function(){},

  variation      : '',
  content        : false,
  html           : false,
  title          : false,

  on             : 'hover',
<<<<<<< HEAD
  clicktoClose   : true,

  position       : 'top center',
  delay          : 150,
  inline         : true,

  duration       : 150,
=======
  target         : false,
  closable       : true,

  context        : 'body',
  position       : 'top center',
  delay          : 150,
  inline         : false,
  preserve       : false,

  duration       : 250,
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
  easing         : 'easeOutQuint',
  transition     : 'scale',

  distanceAway   : 0,
<<<<<<< HEAD
  arrowOffset    : 0,
=======
  offset         : 0,
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
  maxSearchDepth : 10,

  error: {
    content   : 'Your popup has no content specified',
    method    : 'The method you called is not defined.',
    recursion : 'Popup attempted to reposition element to fit, but could not find an adequate position.'
  },

  metadata: {
<<<<<<< HEAD
    arrowOffset : 'arrowOffset',
    content     : 'content',
    html        : 'html',
    position    : 'position',
    title       : 'title',
    variation   : 'variation'
  },

  className   : {
    popup       : 'ui popup',
    visible     : 'visible',
    loading     : 'loading'
=======
    content   : 'content',
    html      : 'html',
    offset    : 'offset',
    position  : 'position',
    title     : 'title',
    variation : 'variation'
  },

  className   : {
    animating   : 'animating',
    loading     : 'loading',
    popup       : 'ui popup',
    position    : 'top left center bottom right',
    visible     : 'visible'
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
  },

  selector    : {
    popup    : '.ui.popup'
  },

  template: function(text) {
    var html = '';
    if(typeof text !== undefined) {
      if(typeof text.title !== undefined && text.title) {
        html += '<div class="header">' + text.title + '</div class="header">';
      }
      if(typeof text.content !== undefined && text.content) {
        html += '<div class="content">' + text.content + '</div>';
      }
    }
    return html;
  }

};

})( jQuery, window , document );
