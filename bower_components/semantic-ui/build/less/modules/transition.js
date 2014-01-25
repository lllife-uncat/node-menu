/*
 * # Semantic - Transition
 * http://github.com/jlukic/semantic-ui/
 *
 *
 * Copyright 2013 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ( $, window, document, undefined ) {

$.fn.transition = function() {
  var
    $allModules     = $(this),
    moduleSelector  = $allModules.selector || '',

    time            = new Date().getTime(),
    performance     = [],

    moduleArguments = arguments,
    query           = moduleArguments[0],
    queryArguments  = [].slice.call(arguments, 1),
    methodInvoked   = (typeof query === 'string'),

    requestAnimationFrame = window.requestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.msRequestAnimationFrame
      || function(callback) { setTimeout(callback, 0); },

<<<<<<< HEAD
    invokedResponse
=======
    returnedValue
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
  ;
  $allModules
    .each(function() {
      var
        $module  = $(this),
        element  = this,

        // set at run time
        settings,
        instance,

        error,
        className,
        metadata,
        animationEnd,
        animationName,

        namespace,
        moduleNamespace,
        module
      ;

      module = {

        initialize: function() {
          // get settings
          settings        = module.get.settings.apply(element, moduleArguments);
          module.verbose('Converted arguments into settings object', settings);

          // set shortcuts
          error           = settings.error;
          className       = settings.className;
          namespace       = settings.namespace;
          metadata        = settings.metadata;
          moduleNamespace = 'module-' + namespace;

          animationEnd    = module.get.animationEvent();
          animationName   = module.get.animationName();

<<<<<<< HEAD
          instance        = $module.data(moduleNamespace);

          if(instance === undefined) {
            module.instantiate();
          }
=======
          instance        = $module.data(moduleNamespace) || module;

>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          if(methodInvoked) {
            methodInvoked = module.invoke(query);
          }
          // no internal method was found matching query or query not made
          if(methodInvoked === false) {
            module.animate();
          }
<<<<<<< HEAD
=======
          module.instantiate();
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
        },

        instantiate: function() {
          module.verbose('Storing instance of module', module);
<<<<<<< HEAD
          instance = module;
=======
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          $module
            .data(moduleNamespace, instance)
          ;
        },

        destroy: function() {
          module.verbose('Destroying previous module for', element);
          $module
            .removeData(moduleNamespace)
          ;
        },

<<<<<<< HEAD
        animate: function(overrideSettings) {
          settings = overrideSettings || settings;
          module.debug('Preparing animation', settings.animation);
          if(module.is.animating()) {
            if(settings.queue) {
=======
        refresh: function() {
          module.verbose('Refreshing display type on next animation');
          delete instance.displayType;
        },

        forceRepaint: function() {
          module.verbose('Forcing element repaint');
          var
            $parentElement = $module.parent(),
            $nextElement = $module.next()
          ;
          if($nextElement.size() === 0) {
            $module.detach().appendTo($parentElement);
          }
          else {
            $module.detach().insertBefore($nextElement);
          }
        },

        repaint: function() {
          module.verbose('Repainting element');
          var
            fakeAssignment = element.offsetWidth
          ;
        },

        animate: function(overrideSettings) {
          settings = overrideSettings || settings;
          if(!module.is.supported()) {
            module.error(error.support);
            return false;
          }
          module.debug('Preparing animation', settings.animation);
          if(module.is.animating() && settings.queue) {
            if(!settings.allowRepeats && module.has.direction() && module.is.occuring() && instance.queuing !== true) {
              module.error(error.repeated);
            }
            else {
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
              module.queue(settings.animation);
            }
            return false;
          }
<<<<<<< HEAD
          module.save.conditions();
          module.set.duration(settings.duration);
          module.set.animating();
          module.repaint();
          $module
            .addClass(className.transition)
            .addClass(settings.animation)
            .one(animationEnd, module.complete)
          ;
          if(!module.has.direction() && module.can.transition()) {
            module.set.direction();
          }
          if(!module.can.animate()) {
            module.restore.conditions();
            module.error(error.noAnimation);
            return false;
          }
          module.show();
          module.debug('Starting tween', settings.animation, $module.attr('class'));
=======
          if(module.can.animate) {
            module.set.animating(settings.animation);
          }
          else {
            module.error(error.noAnimation, settings.animation);
          }
        },

        reset: function() {
          module.debug('Resetting animation to beginning conditions');
          $module.off(animationEnd);
          module.restore.conditions();
          module.hide();
          module.remove.animating();
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
        },

        queue: function(animation) {
          module.debug('Queueing animation of', animation);
          instance.queuing = true;
          $module
            .one(animationEnd, function() {
              instance.queuing = false;
<<<<<<< HEAD
=======
              module.repaint();
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
              module.animate.apply(this, settings);
            })
          ;
        },

        complete: function () {
          module.verbose('CSS animation complete', settings.animation);
          if(!module.is.looping()) {
<<<<<<< HEAD
            if($module.hasClass(className.outward)) {
              module.restore.conditions();
              module.hide();
            }
            else if($module.hasClass(className.inward)) {
              module.restore.conditions();
              module.show();
=======
            if( module.is.outward() ) {
              module.verbose('Animation is outward, hiding element');
              module.restore.conditions();
              module.remove.display();
              module.hide();
              $.proxy(settings.onHide, this)();
            }
            else if( module.is.inward() ) {
              module.verbose('Animation is outward, showing element');
              module.restore.conditions();
              module.show();
              $.proxy(settings.onShow, this)();
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
            }
            else {
              module.restore.conditions();
            }
<<<<<<< HEAD
=======
            module.remove.duration();
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
            module.remove.animating();
          }
          $.proxy(settings.complete, this)();
        },

<<<<<<< HEAD
        repaint: function(fakeAssignment) {
          module.verbose('Forcing repaint event');
          fakeAssignment = element.offsetWidth;
        },

        has: {
          direction: function(animation) {
            animation = animation || settings.animation;
            if( $module.hasClass(className.inward) || $module.hasClass(className.outward) ) {
              return true;
            }
=======
        has: {
          direction: function(animation) {
            animation = animation || settings.animation;
            if( animation.search(className.inward) !== -1 || animation.search(className.outward) !== -1) {
              module.debug('Direction already set in animation');
              return true;
            }
            return false;
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          }
        },

        set: {

<<<<<<< HEAD
          animating: function() {
            $module.addClass(className.animating);
=======
          animating: function(animation) {
            animation = animation || settings.animation;
            module.save.conditions();
            if(module.can.transition() && !module.has.direction()) {
              module.set.direction();
            }
            module.remove.hidden();
            module.set.display();
            $module
              .addClass(className.animating)
              .addClass(className.transition)
              .addClass(animation)
              .one(animationEnd, module.complete)
            ;
            module.set.duration(settings.duration);
            module.debug('Starting tween', settings.animation, $module.attr('class'));
          },

          display: function() {
            var
              displayType = module.get.displayType()
            ;
            if(displayType !== 'block') {
              module.verbose('Setting final visibility to', displayType);
              $module
                .css({
                  display: displayType
                })
              ;
            }
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          },

          direction: function() {
            if($module.is(':visible')) {
              module.debug('Automatically determining the direction of animation', 'Outward');
              $module
<<<<<<< HEAD
                .addClass(className.outward)
                .removeClass(className.inward)
=======
                .removeClass(className.inward)
                .addClass(className.outward)
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
              ;
            }
            else {
              module.debug('Automatically determining the direction of animation', 'Inward');
              $module
<<<<<<< HEAD
                .addClass(className.inward)
                .removeClass(className.outward)
=======
                .removeClass(className.outward)
                .addClass(className.inward)
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
              ;
            }
          },

          looping: function() {
            module.debug('Transition set to loop');
            $module
              .addClass(className.looping)
            ;
          },

          duration: function(duration) {
            duration = duration || settings.duration;
            duration = (typeof duration == 'number')
              ? duration + 'ms'
              : duration
            ;
            module.verbose('Setting animation duration', duration);
            $module
              .css({
                '-webkit-animation-duration': duration,
                '-moz-animation-duration': duration,
                '-ms-animation-duration': duration,
                '-o-animation-duration': duration,
                'animation-duration': duration
              })
            ;
<<<<<<< HEAD
=======
          },

          hidden: function() {
            $module
              .addClass(className.transition)
              .addClass(className.hidden)
            ;
          },

          visible: function() {
            $module
              .addClass(className.transition)
              .addClass(className.visible)
            ;
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          }
        },

        save: {
<<<<<<< HEAD
          conditions: function() {
            module.cache = {
              className : $module.attr('class'),
              style     : $module.attr('style')
            };
            module.verbose('Saving original attributes', module.cache);
=======
          displayType: function(displayType) {
            instance.displayType = displayType;
          },
          transitionExists: function(animation, exists) {
            $.fn.transition.exists[animation] = exists;
            module.verbose('Saving existence of transition', animation, exists);
          },
          conditions: function() {
            instance.cache = {
              className : $module.attr('class'),
              style     : $module.attr('style')
            };
            module.verbose('Saving original attributes', instance.cache);
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          }
        },

        restore: {
          conditions: function() {
<<<<<<< HEAD
            if(typeof module.cache === undefined) {
              module.error(error.cache);
              return false;
            }
            if(module.cache.className) {
              $module.attr('class', module.cache.className);
=======
            if(instance.cache === undefined) {
              return false;
            }
            if(instance.cache.className) {
              $module.attr('class', instance.cache.className);
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
            }
            else {
              $module.removeAttr('class');
            }
<<<<<<< HEAD
            if(module.cache.style) {
              $module.attr('style', module.cache.style);
            }
            else {
              $module.removeAttr('style');
=======
            if(instance.cache.style) {
              $module.attr('style', instance.cache.style);
            }
            else {
              if(module.get.displayType() === 'block') {
                $module.removeAttr('style');
              }
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
            }
            if(module.is.looping()) {
              module.remove.looping();
            }
<<<<<<< HEAD
            module.verbose('Restoring original attributes', module.cache);
=======
            module.verbose('Restoring original attributes', instance.cache);
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          }
        },

        remove: {

          animating: function() {
            $module.removeClass(className.animating);
          },

<<<<<<< HEAD
=======
          display: function() {
            if(instance.displayType !== undefined) {
              $module.css('display', '');
            }
          },

          duration: function() {
            $module
              .css({
                '-webkit-animation-duration' : '',
                '-moz-animation-duration'    : '',
                '-ms-animation-duration'     : '',
                '-o-animation-duration'      : '',
                'animation-duration'         : ''
              })
            ;
          },

          hidden: function() {
            $module.removeClass(className.hidden);
          },

          visible: function() {
            $module.removeClass(className.visible);
          },

>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          looping: function() {
            module.debug('Transitions are no longer looping');
            $module
              .removeClass(className.looping)
            ;
<<<<<<< HEAD
            module.repaint();
=======
            module.forceRepaint();
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          }

        },

        get: {

          settings: function(animation, duration, complete) {
            // single settings object
<<<<<<< HEAD
            if($.isPlainObject(animation)) {
=======
            if(typeof animation == 'object') {
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
              return $.extend(true, {}, $.fn.transition.settings, animation);
            }
            // all arguments provided
            else if(typeof complete == 'function') {
<<<<<<< HEAD
              return $.extend(true, {}, $.fn.transition.settings, {
=======
              return $.extend({}, $.fn.transition.settings, {
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
                animation : animation,
                complete  : complete,
                duration  : duration
              });
            }
            // only duration provided
            else if(typeof duration == 'string' || typeof duration == 'number') {
<<<<<<< HEAD
              return $.extend(true, {}, $.fn.transition.settings, {
=======
              return $.extend({}, $.fn.transition.settings, {
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
                animation : animation,
                duration  : duration
              });
            }
            // duration is actually settings object
            else if(typeof duration == 'object') {
<<<<<<< HEAD
              return $.extend(true, {}, $.fn.transition.settings, duration, {
=======
              return $.extend({}, $.fn.transition.settings, duration, {
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
                animation : animation
              });
            }
            // duration is actually callback
            else if(typeof duration == 'function') {
<<<<<<< HEAD
              return $.extend(true, {}, $.fn.transition.settings, {
=======
              return $.extend({}, $.fn.transition.settings, {
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
                animation : animation,
                complete  : duration
              });
            }
            // only animation provided
            else {
<<<<<<< HEAD
              return $.extend(true, {}, $.fn.transition.settings, {
=======
              return $.extend({}, $.fn.transition.settings, {
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
                animation : animation
              });
            }
            return $.fn.transition.settings;
          },

<<<<<<< HEAD
=======
          displayType: function() {
            if(instance.displayType === undefined) {
              // create fake element to determine display state
              module.can.transition();
            }
            return instance.displayType;
          },

          transitionExists: function(animation) {
            return $.fn.transition.exists[animation];
          },

>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          animationName: function() {
            var
              element     = document.createElement('div'),
              animations  = {
                'animation'       :'animationName',
                'OAnimation'      :'oAnimationName',
                'MozAnimation'    :'mozAnimationName',
                'WebkitAnimation' :'webkitAnimationName'
              },
              animation
            ;
            for(animation in animations){
              if( element.style[animation] !== undefined ){
<<<<<<< HEAD
                module.verbose('Determining animation vendor name property', animations[animation]);
=======
                module.verbose('Determined animation vendor name property', animations[animation]);
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
                return animations[animation];
              }
            }
            return false;
          },

          animationEvent: function() {
            var
              element     = document.createElement('div'),
              animations  = {
                'animation'       :'animationend',
                'OAnimation'      :'oAnimationEnd',
                'MozAnimation'    :'mozAnimationEnd',
                'WebkitAnimation' :'webkitAnimationEnd'
              },
              animation
            ;
            for(animation in animations){
              if( element.style[animation] !== undefined ){
<<<<<<< HEAD
                module.verbose('Determining animation vendor end event', animations[animation]);
=======
                module.verbose('Determined animation vendor end event', animations[animation]);
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
                return animations[animation];
              }
            }
            return false;
          }

        },

        can: {
          animate: function() {
<<<<<<< HEAD
            if($module.css(animationName) !== 'none') {
              module.debug('CSS definition found');
              return true;
            }
            else {
              module.debug('Unable to find css definition');
=======
            if($module.css(settings.animation) !== 'none') {
              module.debug('CSS definition found',  $module.css(settings.animation));
              return true;
            }
            else {
              module.debug('Unable to find css definition', $module.attr('class'));
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
              return false;
            }
          },
          transition: function() {
            var
<<<<<<< HEAD
              $clone           = $('<div>').addClass( $module.attr('class') ).appendTo($('body')),
              currentAnimation = $clone.css(animationName),
              inAnimation      = $clone.addClass(className.inward).css(animationName)
            ;
            if(currentAnimation != inAnimation) {
              module.debug('In/out transitions exist');
              $clone.remove();
              return true;
            }
            else {
              module.debug('Static animation found');
              $clone.remove();
              return false;
            }
=======
              elementClass     = $module.attr('class'),
              animation        = settings.animation,
              transitionExists = module.get.transitionExists(settings.animation),
              $clone,
              currentAnimation,
              inAnimation,
              displayType
            ;
            if( transitionExists === undefined || instance.displayType === undefined) {
              module.verbose('Determining whether animation exists');
              $clone = $('<div>').addClass( elementClass ).appendTo($('body'));
              currentAnimation = $clone
                .removeClass(className.inward)
                .removeClass(className.outward)
                .addClass(className.animating)
                .addClass(className.transition)
                .addClass(animation)
                .css(animationName)
              ;
              inAnimation = $clone
                .addClass(className.inward)
                .css(animationName)
              ;
              displayType = $clone
                .attr('class', elementClass)
                .show()
                .css('display')
              ;
              module.verbose('Determining final display state', displayType);
              if(currentAnimation != inAnimation) {
                module.debug('Transition exists for animation', animation);
                transitionExists = true;
              }
              else {
                module.debug('Static animation found', animation, displayType);
                transitionExists = false;
              }
              $clone.remove();
              module.save.displayType(displayType);
              module.save.transitionExists(animation, transitionExists);
            }
            return transitionExists;
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          }
        },

        is: {
          animating: function() {
            return $module.hasClass(className.animating);
          },
<<<<<<< HEAD
          looping: function() {
            return $module.hasClass(className.looping);
          },
          visible: function() {
            return $module.is(':visible');
=======
          inward: function() {
            return $module.hasClass(className.inward);
          },
          outward: function() {
            return $module.hasClass(className.outward);
          },
          looping: function() {
            return $module.hasClass(className.looping);
          },
          occuring: function(animation) {
            animation = animation || settings.animation;
            return ( $module.hasClass(animation) );
          },
          visible: function() {
            return $module.is(':visible');
          },
          supported: function() {
            return(animationName !== false && animationEnd !== false);
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          }
        },

        hide: function() {
          module.verbose('Hiding element');
<<<<<<< HEAD
          $module
            .removeClass(className.visible)
            .addClass(className.transition)
            .addClass(className.hidden)
          ;
          module.repaint();
        },
        show: function() {
          module.verbose('Showing element');
          $module
            .removeClass(className.hidden)
            .addClass(className.transition)
            .addClass(className.visible)
          ;
=======
          module.remove.visible();
          module.set.hidden();
          module.repaint();
        },

        show: function(display) {
          module.verbose('Showing element', display);
          module.remove.hidden();
          module.set.visible();
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          module.repaint();
        },

        start: function() {
          module.verbose('Starting animation');
          $module.removeClass(className.disabled);
        },

        stop: function() {
          module.debug('Stopping animation');
          $module.addClass(className.disabled);
        },

        toggle: function() {
          module.debug('Toggling play status');
          $module.toggleClass(className.disabled);
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
            if($allModules.size() > 1) {
              title += ' ' + '(' + $allModules.size() + ')';
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
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
                return false;
              }
              else {
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
          return found || false;
        }
      };
      module.initialize();
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

<<<<<<< HEAD
$.fn.transition.settings = {

  // module info
  name   : 'Transition',

  // debug content outputted to console
  debug        : true,

  // verbose debug output
  verbose      : true,

  // performance data output
  performance  : true,

  // event namespace
  namespace    : 'transition',

  // animation complete event
  complete     : function() {},

  // animation duration
  animation    : 'fade',
  duration     : '700ms',

  // queue up animations
  queue        : true,

  className    : {
    transition : 'ui transition',
    animating  : 'animating',
    looping    : 'looping',
    loading    : 'loading',
    disabled   : 'disabled',
    hidden     : 'hidden',
    visible    : 'visible',
    inward     : 'in',
    outward    : 'out'
=======
$.fn.transition.exists = {};

$.fn.transition.settings = {

  // module info
  name        : 'Transition',

  // debug content outputted to console
  debug       : true,

  // verbose debug output
  verbose     : true,

  // performance data output
  performance : true,

  // event namespace
  namespace   : 'transition',

  // animation complete event
  complete    : function() {},
  onShow      : function() {},
  onHide      : function() {},

  // whether animation can occur twice in a row
  allowRepeats : false,

  // animation duration
  animation  : 'fade',
  duration   : '700ms',

  // new animations will occur after previous ones
  queue       : true,

  className   : {
    animating  : 'animating',
    disabled   : 'disabled',
    hidden     : 'hidden',
    inward     : 'in',
    loading    : 'loading',
    looping    : 'looping',
    outward    : 'out',
    transition : 'ui transition',
    visible    : 'visible'
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
  },

  // possible errors
  error: {
    noAnimation : 'There is no css animation matching the one you specified.',
<<<<<<< HEAD
    method      : 'The method you called is not defined'
=======
    repeated    : 'That animation is already occurring, cancelling repeated animation',
    method      : 'The method you called is not defined',
    support     : 'This browser does not support CSS animations'
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
  }

};


})( jQuery, window , document );
