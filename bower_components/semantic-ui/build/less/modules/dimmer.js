/*
 * # Semantic - Dimmer
 * http://github.com/jlukic/semantic-ui/
 *
 *
 * Copyright 2013 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ( $, window, document, undefined ) {

$.fn.dimmer = function(parameters) {
  var
    $allModules     = $(this),

<<<<<<< HEAD
    settings        = ( $.isPlainObject(parameters) )
      ? $.extend(true, {}, $.fn.dimmer.settings, parameters)
      : $.fn.dimmer.settings,

    selector        = settings.selector,
    namespace       = settings.namespace,
    className       = settings.className,
    error           = settings.error,

    eventNamespace  = '.' + namespace,
    moduleNamespace = 'module-' + namespace,
    moduleSelector  = $allModules.selector || '',

=======
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
    time            = new Date().getTime(),
    performance     = [],

    query           = arguments[0],
    methodInvoked   = (typeof query == 'string'),
    queryArguments  = [].slice.call(arguments, 1),
<<<<<<< HEAD
    clickEvent      = ('ontouchstart' in document.documentElement)
      ? 'touchstart'
      : 'click',

    invokedResponse
=======

    returnedValue
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
  ;

  $allModules
    .each(function() {
      var
<<<<<<< HEAD
=======
        settings        = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.dimmer.settings, parameters)
          : $.extend({}, $.fn.dimmer.settings),

        selector        = settings.selector,
        namespace       = settings.namespace,
        className       = settings.className,
        error           = settings.error,

        eventNamespace  = '.' + namespace,
        moduleNamespace = 'module-' + namespace,
        moduleSelector  = $allModules.selector || '',

        clickEvent      = ('ontouchstart' in document.documentElement)
          ? 'touchstart'
          : 'click',

>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
        $module = $(this),
        $dimmer,
        $dimmable,

        element   = this,
        instance  = $module.data(moduleNamespace),
        module
      ;

      module = {

        preinitialize: function() {
          if( module.is.dimmer() ) {
            $dimmable = $module.parent();
            $dimmer   = $module;
          }
          else {
            $dimmable = $module;
            if( module.has.dimmer() ) {
              $dimmer = $dimmable.children(selector.dimmer).first();
            }
            else {
<<<<<<< HEAD
              module.create();
=======
              $dimmer = module.create();
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
            }
          }
        },

        initialize: function() {
          module.debug('Initializing dimmer', settings);
          if(settings.on == 'hover') {
            $dimmable
              .on('mouseenter' + eventNamespace, module.show)
              .on('mouseleave' + eventNamespace, module.hide)
            ;
          }
          else if(settings.on == 'click') {
            $dimmable
              .on(clickEvent + eventNamespace, module.toggle)
            ;
          }

          if( module.is.page() ) {
            module.debug('Setting as a page dimmer', $dimmable);
            module.set.pageDimmer();
          }

          if(settings.closable) {
            module.verbose('Adding dimmer close event', $dimmer);
            $dimmer
              .on(clickEvent + eventNamespace, module.event.click)
            ;
          }
          module.set.dimmable();
          module.instantiate();
        },

        instantiate: function() {
          module.verbose('Storing instance of module', module);
          instance = module;
          $module
            .data(moduleNamespace, instance)
          ;
        },

        destroy: function() {
          module.verbose('Destroying previous module', $dimmer);
<<<<<<< HEAD
=======
          $module
            .removeData(moduleNamespace)
          ;
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          $dimmable
            .off(eventNamespace)
          ;
          $dimmer
            .off(eventNamespace)
          ;
        },

        event: {

          click: function(event) {
            module.verbose('Determining if event occured on dimmer', event);
            if( $dimmer.find(event.target).size() === 0 || $(event.target).is(selector.content) ) {
              module.hide();
              event.stopImmediatePropagation();
            }
          }

        },

        addContent: function(element) {
          var
<<<<<<< HEAD
            $content = $(element).detach()
          ;
          module.debug('Add content to dimmer', $content);
          if($content.parent()[0] !== $dimmer[0]) {
            $dimmer.append($content);
=======
            $content = $(element)
          ;
          module.debug('Add content to dimmer', $content);
          if($content.parent()[0] !== $dimmer[0]) {
            $content.detach().appendTo($dimmer);
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          }
        },

        create: function() {
<<<<<<< HEAD
          $dimmer = $( settings.template.dimmer() );
          return $dimmer.appendTo($dimmable);
=======
          return $( settings.template.dimmer() ).appendTo($dimmable);
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
        },

        animate: {
          show: function(callback) {
<<<<<<< HEAD
            callback = callback || function(){};
            module.set.dimmed();
            if($.fn.transition !== undefined) {
              $dimmer
                .transition(settings.transition + ' in', settings.duration, function() {
                  module.set.active();
                  callback();
=======
            callback = $.isFunction(callback)
              ? callback
              : function(){}
            ;
            module.set.dimmed();
            if(settings.useCSS && $.fn.transition !== undefined && $dimmer.transition('is supported')) {
              $dimmer
                .transition({
                  animation : settings.transition + ' in',
                  queue     : true,
                  duration  : module.get.duration(),
                  complete  : function() {
                    module.set.active();
                    callback();
                  }
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
                })
              ;
            }
            else {
              module.verbose('Showing dimmer animation with javascript');
              $dimmer
                .stop()
                .css({
                  opacity : 0,
                  width   : '100%',
                  height  : '100%'
                })
<<<<<<< HEAD
                .fadeTo(settings.duration, 1, function() {
=======
                .fadeTo(module.get.duration(), 1, function() {
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
                  $dimmer.removeAttr('style');
                  module.set.active();
                  callback();
                })
              ;
            }
          },
          hide: function(callback) {
<<<<<<< HEAD
            callback = callback || function(){};
            module.remove.dimmed();
            if($.fn.transition !== undefined) {
              module.verbose('Hiding dimmer with css');
              $dimmer
                .transition(settings.transition + ' out', settings.duration, function() {
                  module.remove.active();
                  callback();
=======
            callback = $.isFunction(callback)
              ? callback
              : function(){}
            ;
            if(settings.useCSS && $.fn.transition !== undefined && $dimmer.transition('is supported')) {
              module.verbose('Hiding dimmer with css');
              $dimmer
                .transition({
                  animation : settings.transition + ' out',
                  duration  : module.get.duration(),
                  queue     : true,
                  complete  : function() {
                    module.remove.dimmed();
                    module.remove.active();
                    callback();
                  }
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
                })
              ;
            }
            else {
              module.verbose('Hiding dimmer with javascript');
              $dimmer
                .stop()
<<<<<<< HEAD
                .fadeOut(settings.duration, function() {
                  $dimmer.removeAttr('style');
=======
                .fadeOut(module.get.duration(), function() {
                  $dimmer.removeAttr('style');
                  module.remove.dimmed();
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
                  module.remove.active();
                  callback();
                })
              ;
            }
          }
        },

        get: {
          dimmer: function() {
            return $dimmer;
<<<<<<< HEAD
=======
          },
          duration: function() {
            if(typeof settings.duration == 'object') {
              if( module.is.active() ) {
                return settings.duration.hide;
              }
              else {
                return settings.duration.show;
              }
            }
            return settings.duration;
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          }
        },

        has: {
          dimmer: function() {
            return ( $module.children(selector.dimmer).size() > 0 );
          }
        },

        is: {
<<<<<<< HEAD
          dimmer: function() {
            return $module.is(selector.dimmer);
          },
          dimmable: function() {
            return $module.is(selector.dimmable);
          },
=======
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          active: function() {
            return $dimmer.hasClass(className.active);
          },
          animating: function() {
            return ( $dimmer.is(':animated') || $dimmer.hasClass(className.transition) );
          },
<<<<<<< HEAD
          page: function () {
            return $dimmable.is('body');
          },
          enabled: function() {
            return !$dimmable.hasClass(className.disabled);
=======
          dimmer: function() {
            return $module.is(selector.dimmer);
          },
          dimmable: function() {
            return $module.is(selector.dimmable);
          },
          dimmed: function() {
            return $dimmable.hasClass(className.dimmed);
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          },
          disabled: function() {
            return $dimmable.hasClass(className.disabled);
          },
<<<<<<< HEAD
=======
          enabled: function() {
            return !module.is.disabled();
          },
          page: function () {
            return $dimmable.is('body');
          },
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
          pageDimmer: function() {
            return $dimmer.hasClass(className.pageDimmer);
          }
        },

        can: {
          show: function() {
            return !$dimmer.hasClass(className.disabled);
          }
        },

        set: {
          active: function() {
<<<<<<< HEAD
=======
            module.set.dimmed();
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
            $dimmer
              .removeClass(className.transition)
              .addClass(className.active)
            ;
          },
          dimmable: function() {
            $dimmable.addClass(className.dimmable);
          },
          dimmed: function() {
            $dimmable.addClass(className.dimmed);
          },
          pageDimmer: function() {
            $dimmer.addClass(className.pageDimmer);
          },
          disabled: function() {
            $dimmer.addClass(className.disabled);
          }
        },

        remove: {
          active: function() {
            $dimmer
              .removeClass(className.transition)
              .removeClass(className.active)
            ;
          },
          dimmed: function() {
            $dimmable.removeClass(className.dimmed);
          },
          disabled: function() {
            $dimmer.removeClass(className.disabled);
          }
        },

        show: function(callback) {
<<<<<<< HEAD
          module.debug('Showing dimmer', $dimmer, settings);
          if( !(module.is.active() || module.is.animating() ) && module.is.enabled() ) {
=======
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          module.debug('Showing dimmer', $dimmer, settings);
          if( !module.is.active() && module.is.enabled() ) {
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
            module.animate.show(callback);
            $.proxy(settings.onShow, element)();
            $.proxy(settings.onChange, element)();
          }
          else {
            module.debug('Dimmer is already shown or disabled');
          }
        },

        hide: function(callback) {
<<<<<<< HEAD
          if( module.is.active() && !module.is.animating() ) {
=======
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if( module.is.active() || module.is.animating() ) {
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
            module.debug('Hiding dimmer', $dimmer);
            module.animate.hide(callback);
            $.proxy(settings.onHide, element)();
            $.proxy(settings.onChange, element)();
          }
          else {
            module.debug('Dimmer is not visible');
          }
        },

        toggle: function() {
          module.verbose('Toggling dimmer visibility', $dimmer);
<<<<<<< HEAD
          if( !module.is.active() ) {
=======
          if( !module.is.dimmed() ) {
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862
            module.show();
          }
          else {
            module.hide();
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

      module.preinitialize();

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

$.fn.dimmer.settings = {

  name        : 'Dimmer',
  namespace   : 'dimmer',

<<<<<<< HEAD
  verbose     : true,
  debug       : true,
  performance : true,

  transition  : 'fade',

  on          : false,
  closable    : true,
  duration    : 500,
=======
  debug       : true,
  verbose     : true,
  performance : true,

  transition  : 'fade',
  useCSS      : true,
  on          : false,
  closable    : true,

  duration    : {
    show : 500,
    hide : 500
  },
>>>>>>> 763ed5718ca5ba52521779e9c5ba0a18c5213862

  onChange    : function(){},
  onShow      : function(){},
  onHide      : function(){},

  error   : {
    method   : 'The method you called is not defined.'
  },

  selector: {
    dimmable : '.ui.dimmable',
    dimmer   : '.ui.dimmer',
    content  : '.ui.dimmer > .content, .ui.dimmer > .content > .center'
  },

  template: {
    dimmer: function() {
     return $('<div />').attr('class', 'ui dimmer');
    }
  },

  className : {
    active     : 'active',
    dimmable   : 'ui dimmable',
    dimmed     : 'dimmed',
    disabled   : 'disabled',
    pageDimmer : 'page',
    hide       : 'hide',
    show       : 'show',
    transition : 'transition'
  }

};

})( jQuery, window , document );